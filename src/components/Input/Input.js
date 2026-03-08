import { validation } from "../../utils/validation.js";
import { BaseComponent } from "../BaseComponent.js";

export class Input extends BaseComponent {
    /**
     * Рендерит поле ввода с заданными свойствами.
     * @param {string} props.type - Тип поля ввода
     * @param {string} props.placeholder - Подсказка для поля ввода
     * @param {string} props.input_title - Заголовок поля ввода
     * @param {string} props.name - Название поля ввода
     * @param {string} [props.input_value] - Значение поля ввода
     * @param {string} [props.input_status] - Статус поля ввода
     */
    render(props) {
        const element = this.renderComponent("Input", {
            type: props.type,
            placeholder: props.placeholder,
            input_title: props.input_title,
            name: props.name,
            input_value: props.input_value,
            svg: props.svg,
            help: props.help,
        });

        element.addEventListener("input", (event) => {
            const value = event.target.value;
            props?.input?.(event);
        });

        return element;
    }

    setStatusInput(valid, page) {
        page.querySelectorAll(".input-form").forEach((inputForm) => {
            inputForm.classList.remove("error", "success");
        });

        valid.errors.forEach((err) => {
            const inputForm = page.querySelector(`input[name="${err.field}"]`)?.closest(".input-form");
            if (inputForm) {
                inputForm.classList.add("error");
            }
        });

        const fields = ["name", "surname", "password", "email"];
        fields.forEach((field) => {
            if (!valid.errors.some((err) => err.field === field)) {
                const inputForm = page.querySelector(`input[name="${field}"]`)?.closest(".input-form");
                if (inputForm) {
                    inputForm.classList.add("success");
                }
            }
        });
    }
}
