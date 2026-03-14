export const Death13 = {
    createElement,
    render,
};

export function createDOM(fiber) {
    if (typeof fiber.type === "function") {
        const renderedElement = fiber.type(fiber.props);
        return createDOM(renderedElement);
    }
    const dom = fiber.type === "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type);

    const isProperty = (key) => key !== "children";
    Object.keys(fiber.props)
        .filter(isProperty)
        .forEach((name) => {
            dom[name] = fiber.props[name];
        });

    fiber.props.children.forEach((child) => {
        render(child, dom);
    });

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

export function render(element, container) {
    const dom = createDOM(element);
    container.appendChild(dom);
}
