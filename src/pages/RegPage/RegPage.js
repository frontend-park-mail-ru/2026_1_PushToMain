import { BaseComponent } from "../../components/BaseComponent.js";
import { Button } from "../../components/Button/Button.js";
import { postDataReg } from "../../api/ApiAuth.js";
import { validation } from "../../utils/validation.js";

export class RegPage extends BaseComponent {
    constructor() {
        super();
        this.state = 1;
        this.fullData = {};
    }

    updateView() {
        const newContent = this.render();
        this.rootElement.innerHTML = '';
        this.rootElement.appendChild(newContent);
    }


    render(props) {

        const inputs_reg_state1 = [
            {
                type: 'text',
                placeholder: 'Введите имя',
                input_title: "Имя",
                name: 'name'
            },
            {
                type: 'text',
                placeholder: 'Введите фамилию',
                input_title: "Фамилия",
                name: 'surname'
            },
        ];

        const inputs_reg_state2 = [
            {
                type: 'email',
                placeholder: 'Введите адрес почты',
                input_title: "Адрес почты",
                name: 'email'
            },
            {
                type: 'password',
                placeholder: 'Введите пароль',
                input_title: "Пароль",
                name: 'password'
            },
            {
                type: 'password',
                placeholder: 'Введите пароль',
                input_title: "Повторите пароль",
                name: 'repassword'
            }
        ];

        const currentInputs = this.state === 1 ? inputs_reg_state1 : inputs_reg_state2;

        const page = this.renderComponent('RegPage', {
            title: 'Регистрация',
            inputs: currentInputs,
            input_value: this.fullData,
        });

        this.rootElement = document.getElementById('root');;



        const button_login = new Button().render({
            name: 'button-login-for-reg',
            title: 'Войти',
            onClick: (event) => {
                event.preventDefault();
                window.app.handleRoute('/login');
            }
        });

        const button_reg_state1 = new Button().render({
            name: 'button-reg-for-reg',
            title: 'Продолжить',
            onClick: (event) => {
                event.preventDefault()
                const form = event.currentTarget.form
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                if (validation(data).isValid) {
                    this.state = 2;
                    this.fullData = { ...this.fullData, ...data };
                    this.updateView();
                } else {
                    const error_container = page.querySelector('.auth-input__error');
                    error_container.innerText = 'Есть пустые поля';
                }
            }

        });


        const actionsContainer = page.querySelector('.auth-form__actions');


        if (this.state === 1) {
            actionsContainer.appendChild(button_reg_state1);
            actionsContainer.appendChild(button_login);

        } else {
            const button_reg_state2 = new Button().render({
                name: 'button-reg-for-reg',
                title: 'Зарегистрироваться',
                onClick: async (event) => {
                    event.preventDefault()
                    const form = event.currentTarget.form
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData.entries());
                    this.fullData = { ...this.fullData, ...data };
                    const error_container = page.querySelector('.auth-input__error');

                    if (validation(data).isValid) {
                        const response = await postDataReg(this.fullData);
                        error_container.innerText = response.error;
                    } else {
                        error_container.innerText = 'Есть пустые поля';
                    }
                }
            });

            const button_back = new Button().render({
                name: 'button-login-for-reg',
                title: 'Назад',
                onClick: (event) => {
                    event.preventDefault()
                    const form = event.currentTarget.form
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData.entries());
                    this.state = 1;
                    this.fullData = { ...this.fullData, ...data };
                    this.updateView();
                }
            });


            actionsContainer.appendChild(button_reg_state2);
            actionsContainer.appendChild(button_back);

        }

        return page;
    }

}