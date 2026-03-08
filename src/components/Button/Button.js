import { BaseComponent } from "../BaseComponent.js";

export class Button extends BaseComponent {
    /**
     * Рендерит кнопку с заданными свойствами.
     * @param {string} props.name - Название кнопки
     * @param {string} props.title - Текст на кнопке
     * @param {function} [props.onClick] - Функция, которая будет вызвана при нажатии на кнопку
     */
    render(props) {
        const element = this.renderComponent("Button", {
            type: props.type,
            name: props.name,
            title: props.title,
            svg: props.svg,
            count: props.count,
            help: props.help,
        });

        element.addEventListener("click", (event) => {
            props?.onClick?.(event);
        });
        return element;
    }
}
