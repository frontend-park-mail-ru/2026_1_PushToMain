export class Component {
    constructor(props) {
        this.props = props;
    }

    render() {}
}

Component.prototype.isDeath13Component = true;

export function createDOM(fiber) {
    if (typeof fiber.type === "function") {
        if (fiber.type.prototype && fiber.type.prototype.isDeath13Component) {
            const instance = new fiber.type(fiber.props);
            const renderedElement = instance.render();
            return createDOM(renderedElement);
        } else {
            const renderedElement = fiber.type(fiber.props);
            return createDOM(renderedElement);
        }
    }

    const dom = fiber.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type);

    const isProperty = (key) => key !== "children";
    Object.keys(fiber.props)
        .filter(isProperty)
        .forEach((name) => {
            dom[name] = fiber.props[name];
        });

    if (fiber.props.children) {
        fiber.props.children.forEach((child) => {
            render(child, dom);
        });
    }
    return dom;
}

export function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map((child) => {
                return typeof child === "object" ? child : createTextElement(child);
            }),
        },
    };
}

export function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        },
    };
}

export function render(props, router) {
    const dom = createDOM(props);
    router.appendChild(dom);
}

export const Death13 = {
    createElement,
    render,
    Component,
};

export default Death13
