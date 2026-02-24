import { BaseComponent } from "../../components/BaseComponent.js";
import { Button } from "../../components/Button/Button.js";
import { LoginPage } from "../LoginPage/LoginPage.js";
import { Input } from "../../components/Input/Input.js";




export class RegPage extends BaseComponent {
    render(props) {

        const inputs = [
            {
                type: 'text',
                placeholder: 'Имя',
                name: 'name'
            },
            {
                type: 'text',
                placeholder: 'Отчество (необязательно)',
                name: 'subname'
            },
            {
                type: 'email',
                placeholder: 'Email',
                name: 'email'
            },
            {
                type: 'password',
                placeholder: 'Пароль',
                name: 'password'
            },
            {
                type: 'password',
                placeholder: 'Повторный пароль',
                name: 'repassword'
            }
        ];

        const page = this.renderComponent('RegPage', {
            title: 'Регистрация',
            inputs: inputs
        });

        const button_reg = new Button().render({
            title: 'Зарегистрироваться',
            onClick: () => {
                window.location.hash = '/register'
            }
        });

        const button_login = new Button().render({
            title: 'Войти',
            onClick: () => {
                window.location.hash = '/login'
            }
        })

        const actionsContainer = page.querySelector('.auth-form__actions');
        actionsContainer.appendChild(button_reg);
        actionsContainer.appendChild(button_login);

        return page;
    }
}