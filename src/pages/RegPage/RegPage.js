import { BaseComponent } from "../../components/BaseComponent.js";
import { Button } from "../../components/Button/Button.js";
import { postDataReg } from "../../api/ApiAuth.js";

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
                placeholder: 'Номер телефона',
                name: 'phone'
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

        const button_login = new Button().render({
            name: 'button-login-for-reg',
            title: 'Войти',
            onClick: () => {
                window.app.handleRoute('/login');
            }
        });

        const button_reg = new Button().render({
            name: 'button-reg-for-reg',
            title: 'Зарегистрироваться',
            onClick: () => {
                event.preventDefault()
                const form = document.querySelector(".auth-form");
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                if (this.validation(data)) {
                    postDataReg(data);
                }
            }

        });

        const actionsContainer = page.querySelector('.auth-form__actions');
        actionsContainer.appendChild(button_reg);
        actionsContainer.appendChild(button_login);

        return page;
    }


    validation(data) {
        const name = data.name;
        const phone = data.phone;
        const email = data.email;
        const password = data.password;
        const repassword = data.repassword;

        let flag = true;

        const errors = [];

        if (!name) {
            errors.push({ field: 'name', massege: 'Поле имя обязательно' })
            flag = false;
        }

        if (!phone) {
            errors.push({ field: 'email', massege: 'Поле номер телефона обязательно' })
            flag = false;

        }

        if (!email) {
            errors.push({ field: 'email', massege: 'Поле почты обязательно' })
            flag = false;

        }

        if (!password) {
            errors.push({ field: 'password', massege: 'Поле пароля обязательно' })
            flag = false;

        }

        if (!repassword) {
            errors.push({ field: 'repassword', massege: 'Поле повторный пароль обязательно' })
            flag = false;

        }

        if (password.length <= 8) {
            errors.push({ field: 'Coincidence', massege: 'Длинна пароля меньше 8 символов' })
            flag = false;
        }

        if (password !== repassword) {
            errors.push({ field: 'Coincidence', massege: 'Пароли не совпадают' })
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