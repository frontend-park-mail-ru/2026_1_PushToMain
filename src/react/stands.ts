let nextUnitOfWork: Fiber | null = null;
let wipRoot: Fiber | null = null;
let currentRoot: Fiber | null = null;
let deletions: Fiber[] = [];
let wipFiber: Fiber | null = null;

interface Hook {
    state: any;
    queue: any[];
}

interface Fiber {
    type: string | ((props: any) => any);
    props: any;
    parent: Fiber | null;
    dom: Node | null;
    sibling?: Fiber;
    child?: Fiber;
    effectTag?: "DELETION" | "UPDATE" | "PLACEMENT";
    alternate?: Fiber;
    hooks?: Hook[];
    hookIndex?: number;
    instance?: any;
}

function useState<T>(initial: T): [T, (action: T | ((prev: T) => T)) => void] {
    const fiber = wipFiber;
    if (!fiber) throw new Error("useState must be called inside a component");

    const currentHookIndex = fiber.hookIndex || 0;

    const oldHook = fiber.alternate?.hooks?.[currentHookIndex];

    const hook: Hook = {
        state: oldHook ? oldHook.state : initial,
        queue: oldHook ? [...oldHook.queue] : [],
    };

    hook.queue.forEach((action: any) => {
        hook.state = action instanceof Function ? action(hook.state) : action;
    });

    const setState = (action: T | ((prev: T) => T)) => {
        hook.queue.push(action);

        wipRoot = {
            dom: currentRoot?.dom || null,
            props: currentRoot?.props || { children: [] },
            alternate: currentRoot,
            type: "root",
            parent: null,
        } as Fiber;

        nextUnitOfWork = wipRoot;
        deletions = [];
    };

    if (!fiber.hooks) {
        fiber.hooks = [];
    }
    fiber.hooks[currentHookIndex] = hook;
    fiber.hookIndex = currentHookIndex + 1;

    return [hook.state, setState];
}

window.requestIdleCallback =
    window.requestIdleCallback ||
    function (cb) {
        return setTimeout(() => {
            const start = Date.now();
            cb({
                didTimeout: false,
                timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
            });
        }, 1);
    };

function createDom(fiber: Fiber): Node {
    if (fiber.type === "root") {
        return fiber.dom as Node;
    }

    let dom: Node;

    if (fiber.type === "TEXT_ELEMENT") {
        dom = document.createTextNode(fiber.props.nodeValue || "");
    } else {
        dom = document.createElement(fiber.type as string);
        const props = { ...fiber.props };
        if (props.className) {
            props.class = props.className;
            delete props.className;
        }
        updateDomProperties(dom, {}, props);
    }

    return dom;
}

function updateDomProperties(dom: Node, prevProps: any, nextProps: any) {
    const isTextNode = dom.nodeType === Node.TEXT_NODE;

    if (isTextNode) {
        if (prevProps.nodeValue !== nextProps.nodeValue) {
            (dom as Text).nodeValue = nextProps.nodeValue || "";
        }
        return;
    }

    const element = dom as HTMLElement;

    Object.keys(prevProps).forEach((name) => {
        if (name === "children") return;

        let attrName = name;
        if (name === "className") attrName = "class";

        if (name.startsWith("on")) {
            const eventName = name.toLowerCase().substring(2);
            element.removeEventListener(eventName, prevProps[name]);
        } else if (!(name in nextProps)) {
            if (name === "value") {
                (element as any).value = "";
            } else {
                element.removeAttribute(attrName);
            }
        }
    });

    Object.keys(nextProps).forEach((name) => {
        if (name === "children") return;

        let attrName = name;
        if (name === "className") attrName = "class";

        if (name.startsWith("on")) {
            const eventName = name.toLowerCase().substring(2);
            element.addEventListener(eventName, nextProps[name]);
        } else if (prevProps[name] !== nextProps[name]) {
            if (nextProps[name] === false || nextProps[name] === null || nextProps[name] === undefined) {
                if (name === "value") {
                    (element as any).value = "";
                } else {
                    element.removeAttribute(attrName);
                }
            } else {
                if (name === "value") {
                    (element as any).value = nextProps[name];
                } else {
                    element.setAttribute(attrName, String(nextProps[name]));
                }
            }
        }
    });
}

function reconcileChildren(wipFiber: Fiber, elements: any[]) {
    let index = 0;
    let oldFiber = wipFiber.alternate?.child;
    let prevSibling: Fiber | null = null;

    const validElements = elements.filter((el) => el != null);

    while (index < validElements.length || oldFiber != null) {
        const element = validElements[index];
        let newFiber: Fiber | null = null;

        const sameType = oldFiber && element && oldFiber.type === element.type;

        if (sameType) {
            newFiber = {
                type: oldFiber!.type,
                props: element.props,
                parent: wipFiber,
                dom: oldFiber!.dom,
                alternate: oldFiber,
                effectTag: "UPDATE",
            };
            if (oldFiber?.instance) {
                newFiber.instance = oldFiber.instance;
            }
        } else if (element) {
            newFiber = {
                type: element.type,
                props: element.props,
                parent: wipFiber,
                dom: null,
                alternate: undefined,
                effectTag: "PLACEMENT",
            };
        }

        if (oldFiber && !sameType) {
            oldFiber.effectTag = "DELETION";
            deletions.push(oldFiber);
        }

        if (oldFiber) {
            oldFiber = oldFiber.sibling;
        }

        if (index === 0) {
            wipFiber.child = newFiber || undefined;
        } else if (prevSibling && newFiber) {
            prevSibling.sibling = newFiber;
        }

        if (newFiber) {
            prevSibling = newFiber;
        }

        index++;
    }
}

function updateFunctionComponent(fiber: Fiber) {
    wipFiber = fiber;
    wipFiber.hookIndex = 0;
    wipFiber.hooks = [];

    const children = [(fiber.type as (props: any) => any)(fiber.props)];
    reconcileChildren(fiber, children);
}

function updateClassComponent(fiber: Fiber) {
    let instance = fiber.instance;

    if (!instance) {
        instance = new (fiber.type as any)(fiber.props);
        instance._fiber = fiber;
        fiber.instance = instance;
    } else {
        instance.props = fiber.props;
        if (fiber.alternate?.instance) {
            instance.state = fiber.alternate.instance.state;
        }
    }

    const children = [instance.render()];
    reconcileChildren(fiber, children);
}

function updateHostComponent(fiber: Fiber) {
    if (!fiber.dom) {
        fiber.dom = createDom(fiber);
    }
    reconcileChildren(fiber, fiber.props.children || []);
}

function performUnitOfWork(fiber: Fiber): Fiber | null {
    const isFunctionComponent = typeof fiber.type === "function";
    const isClassComponent = isFunctionComponent && (fiber.type as any).prototype?.isDeath13Component === true;

    if (isClassComponent) {
        updateClassComponent(fiber);
    } else if (isFunctionComponent) {
        updateFunctionComponent(fiber);
    } else {
        updateHostComponent(fiber);
    }

    if (fiber.child) {
        return fiber.child;
    }

    let nextFiber: Fiber | null = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }

    return null;
}

function commitRoot() {
    deletions.forEach(commitWork);

    if (wipRoot?.child) {
        commitWork(wipRoot.child);
    }

    currentRoot = wipRoot;
    wipRoot = null;
    deletions = [];
}

function commitWork(fiber: Fiber | null | undefined) {
    if (!fiber) return;

    let domParentFiber = fiber.parent;
    while (domParentFiber && !domParentFiber.dom) {
        domParentFiber = domParentFiber.parent;
    }

    const domParent = domParentFiber?.dom;

    if (fiber.effectTag === "PLACEMENT" && fiber.dom && domParent) {
        domParent.appendChild(fiber.dom);
    } else if (fiber.effectTag === "UPDATE" && fiber.dom) {
        updateDomProperties(fiber.dom, fiber.alternate?.props || {}, fiber.props);
    } else if (fiber.effectTag === "DELETION") {
        commitDeletion(fiber, domParent!);
        return;
    }

    if (fiber.child) {
        commitWork(fiber.child);
    }
    if (fiber.sibling) {
        commitWork(fiber.sibling);
    }
}

function commitDeletion(fiber: Fiber, domParent: Node) {
    if (fiber.dom) {
        if (domParent.contains(fiber.dom)) {
            domParent.removeChild(fiber.dom);
        }
    } else if (fiber.child) {
        commitDeletion(fiber.child, domParent);
    }
    if (fiber.sibling) {
        commitDeletion(fiber.sibling, domParent);
    }
}

function workLoop(deadline: IdleDeadline) {
    let shouldYield = false;

    while (nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }

    if (!nextUnitOfWork && wipRoot) {
        commitRoot();
    }

    requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

function render(element: any, container: HTMLElement) {
    wipRoot = {
        dom: container,
        props: {
            children: [element],
        },
        alternate: currentRoot,
        type: "root",
        parent: null,
    } as Fiber;

    deletions = [];
    nextUnitOfWork = wipRoot;
}

function createElement(type: any, props: any, ...children: any[]) {
    const flattenedChildren = children.flat();

    return {
        type,
        props: {
            ...props,
            children: flattenedChildren
                .map((child) => {
                    if (child === undefined || child === null || child === false) {
                        return null;
                    }
                    if (typeof child === "object") {
                        return child;
                    }
                    return createTextElement(child);
                })
                .filter(Boolean),
        },
    };
}

function createTextElement(text: any) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: String(text),
            children: [],
        },
    };
}

class Component {
    props: any;
    state: any;
    _fiber?: Fiber;

    constructor(props: any) {
        this.props = props;
        this.state = {};
    }

    setState(partialState: any) {
        const newState = { ...this.state, ...partialState };

        if (JSON.stringify(this.state) === JSON.stringify(newState)) {
            return;
        }

        this.state = newState;

        const fiber = this._fiber;
        if (!fiber) return;

        let rootFiber: Fiber = fiber;
        while (rootFiber.parent) {
            rootFiber = rootFiber.parent;
        }

        wipRoot = {
            dom: rootFiber.dom,
            props: rootFiber.props,
            alternate: currentRoot,
            type: "root",
            parent: null,
        } as Fiber;

        deletions = [];
        nextUnitOfWork = wipRoot;

        requestIdleCallback(workLoop);
    }

    render(): any {
        return null;
    }

    isDeath13Component?: boolean;
}

Component.prototype.isDeath13Component = true;

const Death13 = {
    createElement,
    Component,
    render,
    useState,
};

export default Death13;
