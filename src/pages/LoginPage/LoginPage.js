import { BaseComponent } from "../../components/BaseComponent.js";
import { Button } from "../../components/Button/Button.js";
import { postDataLogin } from "../../api/ApiAuth.js";
import { validation } from "../../utils/validation.js";

export class LoginPage extends BaseComponent {
    /**
     * Рендерит страницу авторизации с заданными свойствами.
     */
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
            onClick: async (event) => {
                event.preventDefault()
                const form = event.currentTarget.form
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                const error_container = page.querySelector('.auth-input__error')


                if (validation(data).isValid) {
                    const response = await postDataLogin(data);
                    error_container.innerText = response.error;
                } else {
                    error_container.innerText = 'Есть пустые поля';
                }

                if (response.error) {
                    error_container.innerText = response.error;
                }
                else {
                    window.app.handleRoute('/');
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
