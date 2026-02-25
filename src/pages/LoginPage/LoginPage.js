import { BaseComponent } from "../../components/BaseComponent.js";
import { Button } from "../../components/Button/Button.js";
import { postDataLogin } from "../../api/ApiAuth.js";

export class LoginPage extends BaseComponent {
    render(props) {

        const inputs = [
            {
                type: 'email',
                placeholder: 'Почта',
                name: 'email'
            },
            {
                type: 'password',
                placeholder: 'Пароль',
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
            onClick: () => {
                event.preventDefault()
                const form = document.querySelector(".auth-form");
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                if (this.validation(data)) {
                    postDataLogin(data);
                }
            }
        });

        const button_reg = new Button().render({
            name: 'button-reg-for-login',
            title: 'Зарегистрироваться',
            onClick: () => {
                window.app.handleRoute('/register');
            }

        });

        const actionsContainer = page.querySelector('.auth-form__actions');
        actionsContainer.appendChild(button_login);
        actionsContainer.appendChild(button_reg);

        return page;
    }

    validation(data) {
        const email = data.email;
        const password = data.password;

        const errors = [];

        let flag = true;

        if (!email) {
            errors.push({ field: 'email', massege: 'Поле email пустое' })
            flag = false;
        }

        if (!password) {
            errors.push({ field: 'password', massege: 'Поле email пустое' })
            flag = false;

        }

        console.log(errors);

        if (flag) {
            return true;
        } else {
            return false;
        }
    }
}