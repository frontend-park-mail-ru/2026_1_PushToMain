import { BaseComponent } from "../BaseComponent.js";

export class Button extends BaseComponent {
    render(props) {
        const element = this.renderComponent("Button", {
            name: props.name,
            title: props.title,
        });

        element.addEventListener('click', () => props?.onClick?.());

        return element;
    }
}