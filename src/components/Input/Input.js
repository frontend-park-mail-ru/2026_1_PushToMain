import { BaseComponent } from "../BaseComponent.js";


export class Input extends BaseComponent {
    render(props) {
        const element = this.renderComponent("Input", {
            type: props.type,
            placeholder: props.placeholder,
            input_title: props.input_title,
            name: props.name,
            input_value: props.input_value,
            input_status: props.input_status
        });

        return element;
    }
}