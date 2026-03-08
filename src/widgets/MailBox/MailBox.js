import { BaseComponent } from "../../components/BaseComponent.js";
import { Input } from "../../components/Input/Input.js";

export class MailBox extends BaseComponent {
    render(props) {
        const widget = this.renderComponent("MailBox", {
            theme: props.theme,
            title: props.title,
            date: props.date,
        });

        const SelectCheckBox = new Input().render({
            type: "checkbox",
            name: "select-checkbox",
            input: (event) => {
                console.log("Haha");
            },
        });

        const FavoritesCheckBox = new Input().render({
            type: "checkbox",
            name: "favorites-checkbox",
        });

        const CheckBoxContainer = widget.querySelector(".checkbox-container");
        CheckBoxContainer.appendChild(SelectCheckBox);
        CheckBoxContainer.appendChild(FavoritesCheckBox);

        return widget;
    }
}
