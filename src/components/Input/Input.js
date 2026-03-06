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
            input_status: props.input_status,
            svg: props.svg || '/public/assets/svg/blank.svg',

        });



        element.addEventListener('input', (event) => {
            const value = event.target.value;
            props?.input?.(event);
            const valid = validation({ [props.type]: value });
            if (!valid.isValid) {
                valid.errors.forEach(err => {
                    const fieldErrorContainer = element.querySelector(`.auth-input__error[name="${err.field}"]`);
                    fieldErrorContainer.innerText = err.message;
                })
            }
        })
        return element;
    }
}
