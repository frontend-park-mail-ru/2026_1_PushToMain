declare module "@react/stands" {
    export class Component {
        constructor(props: any);
        props: any;
        render(props?: any): any;
        isDeath13Component?: boolean;
    }

    export function createElement(type: any, props: any, ...children: any[]): any;
    export function render(props?: any, router?: HTMLElement): void;
    export function createDOM(fiber: any): HTMLElement | Text | DocumentFragment;
    export function createTextElement(text: string): any;

    const Death13: {
        createElement: typeof createElement;
        render: typeof render;
        Component: typeof Component;
    };

    export default Death13;
}