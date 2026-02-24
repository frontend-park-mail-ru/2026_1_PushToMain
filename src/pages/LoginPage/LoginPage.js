import { BaseComponent } from "../../components/BaseComponent.js";
import { Button } from "../../components/Button/Button.js";
import { RegPage } from "../RegPage/RegPage.js";


export class LoginPage extends BaseComponent {
    render(props) {

        const inputs = [
            {
                type: 'email',
                placeholder: 'Email',
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