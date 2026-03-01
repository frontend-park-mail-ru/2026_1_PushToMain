import { BaseComponent } from "../../components/BaseComponent.js";
import { Button } from "../../components/Button/Button.js";
import { postDataLogin } from "../../api/ApiAuth.js";
import { validation } from "../../utils/validation.js";

export class LoginPage extends BaseComponent {
    render(props) {

        const inputs = [
            {
                type: 'email',
                placeholder: 'Введите почту',
                input_title: 'Почта',
                name: 'email'
            },
            {
                type: 'password',
                placeholder: 'Введите пароль',
                input_title: 'Пароль',
                name: 'password'
            }
        ];

        const page = this.renderComponent('LoginPage', {
            title: 'Вход',
            inputs: inputs
        });

        const button_login = new Button().render({
            name: 'button-login-for-login',
            title: 'Войти',
            onClick: (event) => {
                event.preventDefault()
                const form = event.currentTarget.form
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                if (validation(data).isValid) {
                    postDataLogin(data);
                } else {
                    const error_container = page.querySelector('.auth-input__error')
                    error_container.innerHTML = ''
                    const error = document.createTextNode('Указан неверный пароль или почта')
                    error_container.appendChild(error)
                }
            }
        });

        const button_reg = new Button().render({
            name: 'button-reg-for-login',
            title: 'Зарегистрироваться',
            onClick: (event) => {
                event.preventDefault();
                window.app.handleRoute('/register');
            }

        });

        const actionsContainer = page.querySelector('.auth-form__actions');
        actionsContainer.appendChild(button_login);
        actionsContainer.appendChild(button_reg);

        return page;
    }

}