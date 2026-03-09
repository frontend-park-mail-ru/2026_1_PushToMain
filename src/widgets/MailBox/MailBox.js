import { BaseComponent } from "../../components/BaseComponent.js";
import { Input } from "../../components/Input/Input.js";

export class MailBox extends BaseComponent {
    /**
     * Рендерит компонент почтового ящика с заданными свойствами
     * @param {Object} props - Объект свойств для компонента почтового ящика
     * @param {string} props.theme - Тема оформления почтового ящика
     * @param {string} props.title - Заголовок почтового ящика
     * @param {string|Date} props.date - Дата, связанная с почтовым ящиком
     * @returns {HTMLElement} Возвращает DOM-элемент компонента почтового ящика
     */
    render(props) {
        const widget = this.renderComponent("MailBox", {
            theme: props.theme,
            title: props.title,
            date: props.date,
        });

        const selectCheckBox = new Input().render({
            type: "checkbox",
            name: "select-checkbox",
            input: () => {},
        });

        const favoritesCheckBox = new Input().render({
            type: "checkbox",
            name: "favorites-checkbox",
        });

        const checkBoxContainer = widget.querySelector(".checkbox-container");
        checkBoxContainer.appendChild(selectCheckBox);
        checkBoxContainer.appendChild(favoritesCheckBox);

        return widget;
    }
}
