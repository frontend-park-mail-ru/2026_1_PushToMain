import { BaseComponent } from "../BaseComponent.js";

export class Input extends BaseComponent {
    /**
     * Рендерит поле ввода с заданными свойствами.
     * @param {string} props.type - Тип поля ввода
     * @param {string} props.placeholder - Подсказка для поля ввода
     * @param {string} props.input_title - Заголовок поля ввода
     * @param {string} props.name - Название поля ввода
     * @param {string} [props.input_value] - Значение поля ввода
     * @param {string} [props.svg] - SVG иконка для поля ввода
     * @param {string} [props.help] - Вспомогательный текст подсказки
     * @returns {HTMLElement} Возвращает DOM-элемент поля ввода
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
            props?.input?.(event);
        });

        return element;
    }

    /**
     * Устанавливает статус валидации для полей ввода на странице
     * @param {Object} valid - Объект с результатами валидации
     * @param {Array<Object>} valid.errors - Массив ошибок валидации
     * @param {string} valid.errors[].field - Название поля с ошибкой
     * @param {HTMLElement} page - Корневой элемент страницы или DOM-элемент, содержащий поля ввода
     * @returns {void}
     */
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
