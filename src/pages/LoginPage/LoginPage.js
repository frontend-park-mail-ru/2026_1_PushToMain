import { BaseComponent } from "../../components/BaseComponent.js";
import { Button } from "../../components/Button/Button.js";

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
                history.pushState({}, null, '/register');
                window.app.handleRoute();
            }

        });

        const button_login = new Button().render({
            title: 'Войти',
            onClick: () => {
                history.pushState({}, null, '/login')
                window.app.handleRoute();
            }
        })

        const actionsContainer = page.querySelector('.auth-form__actions');
        actionsContainer.appendChild(button_reg);
        actionsContainer.appendChild(button_login);

        return page;
    }
}