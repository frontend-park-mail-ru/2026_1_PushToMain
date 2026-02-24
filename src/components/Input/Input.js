import { BaseComponent } from "../BaseComponent.js";


export class Input extends BaseComponent {
    render(props) {
        const element = this.renderComponent("Input", {
            type: props.type,
            placeholder: props.placeholder,
            name: props.name,
        });


        return element;
    }
}