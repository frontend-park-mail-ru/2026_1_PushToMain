let wipRoot = null;
let currentRoot = null;
let nextUnitOfWork = null;
let deletions = [];

export class Component {
    constructor(props) {
        this.props = props;
    }

    render() {}
}

Component.prototype.isDeath13Component = true;

function updateDom(dom, prevProps, nextProps) {
    Object.keys(prevProps)
        .filter((name) => name !== "children")
        .forEach((name) => {
            if (name.startsWith("on")) {
                const eventType = name.toLowerCase().substring(2);
                dom.removeEventListener(eventType, prevProps[name]);
            } else {
                dom[name] = "";
            }
        });

    Object.keys(nextProps)
        .filter((name) => name !== "children")
        .forEach((name) => {
            if (name.startsWith("on")) {
                const eventType = name.toLowerCase().substring(2);
                dom.addEventListener(eventType, nextProps[name]);
            } else {
                dom[name] = nextProps[name];
            }
        });
}

function commitDeletion(fiber, domParent) {
    if (fiber.dom) {
        domParent.removeChild(fiber.dom);
    } else {
        commitDeletion(fiber.child, domParent);
    }
}

export function createDom(fiber) {
    if (typeof fiber.type === "function") {
        return null;
    }

    const dom = fiber.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type);

    updateDom(dom, {}, fiber.props || {});

    return dom;
}

function performUnitOfWork(fiber) {
    const isFunctionComponent = typeof fiber.type === "function";

    if (isFunctionComponent) {
        if (fiber.type.prototype && fiber.type.prototype.isDeath13Component) {
            const instance = new fiber.type(fiber.props);
            const children = [instance.render()];
            reconcileChildren(fiber, children);
        } else {
            updateFunctionComponent(fiber);
            const children = [fiber.type(fiber.props)];
            reconcileChildren(fiber, children);
        }
    } else {
        if (!fiber.dom) {
            fiber.dom = createDom(fiber);
        }

        reconcileChildren(fiber, fiber.props.children);
    }

    if (fiber.child) {
        return fiber.child;
    }

    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling;
        }
        nextFiber = nextFiber.parent;
    }
}

function reconcileChildren(wipFiber, elements) {
    if (!elements) return;

    let index = 0;
    let prevSibling = null;
    let oldFiber = wipFiber.alternate && wipFiber.alternate.child;

    while (index < elements.length || oldFiber != null) {
        const element = elements[index];
        let newFiber = null;

        const sameType = oldFiber && element && element.type === oldFiber.type;

        if (sameType) {
            newFiber = {
                type: oldFiber.type,
                props: element.props,
                dom: oldFiber.dom,
                parent: wipFiber,
                alternate: oldFiber,
                effectTag: "UPDATE",
            };
        }

        if (element && !sameType) {
            newFiber = {
                type: element.type,
                props: element.props,
                dom: null,
                parent: wipFiber,
                alternate: null,
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
            wipFiber.child = newFiber;
        } else if (element) {
            prevSibling.sibling = newFiber;
        }

        prevSibling = newFiber;
        index++;
    }
}

export function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children
                .map((child) => {
                    if (child === true || child === false || child === null || child === undefined) {
                        return null;
                    }
                    return typeof child === "object" ? child : createTextElement(String(child));
                })
                .filter((child) => child !== null),
        },
    };
}

function workLoop(deadline) {
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

export function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        },
    };
}

export function render(element, container) {
    wipRoot = {
        dom: container,
        props: {
            children: [element],
        },
        alternate: currentRoot,
    };
    deletions = [];
    nextUnitOfWork = wipRoot;
}

let wipFiber = null;
let hookIndex = null;

export function updateFunctionComponent(fiber) {
    wipFiber = fiber;
    hookIndex = 0;
    wipFiber.hooks = [];

    const children = [fiber.type(fiber.props)];
    reconcileChildren(fiber, children);
}
export function useState(initial) {
    const oldHook = wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[hookIndex];

    const hook = {
        state: oldHook ? oldHook.state : initial,
        queue: [],
    };

    const actions = oldHook ? oldHook.queue : [];
    actions.forEach((action) => {
        if (typeof action === "function") {
            hook.state = action(hook.state);
        } else {
            hook.state = action;
        }
    });

    const setState = (action) => {
        hook.queue.push(action);

        wipRoot = {
            dom: currentRoot.dom,
            props: currentRoot.props,
            alternate: currentRoot,
        };
        nextUnitOfWork = wipRoot;
        deletions = [];
    };

    wipFiber.hooks.push(hook);
    hookIndex++;
    return [hook.state, setState];
}

function commitRoot() {
    deletions.forEach(commitWork);
    commitWork(wipRoot.child);
    currentRoot = wipRoot;
    wipRoot = null;
}

function commitWork(fiber) {
    if (!fiber) return;

    let domParentFiber = fiber.parent;
    while (!domParentFiber.dom) {
        domParentFiber = domParentFiber.parent;
    }
    const domParent = domParentFiber.dom;

    if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
        domParent.appendChild(fiber.dom);
    } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
        updateDom(fiber.dom, fiber.alternate.props, fiber.props);
    } else if (fiber.effectTag === "DELETION") {
        commitDeletion(fiber, domParent);
    }

    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

export const Death13 = {
    createElement,
    render,
    Component,
    useState,
};

export default Death13;
