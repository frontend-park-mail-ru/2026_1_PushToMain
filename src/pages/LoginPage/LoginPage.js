import { BaseComponent } from "../../components/BaseComponent.js";
import { Button } from "../../components/Button/Button.js";
import { postDataLogin } from "../../api/ApiAuth.js";
import { validation } from "../../utils/validation.js";
import { Input } from "../../components/Input/Input.js";

export class LoginPage extends BaseComponent {
    /**
     * Рендерит страницу авторизации с заданными свойствами.
     * @returns {HTMLElement} Возвращает DOM-элемент страницы авторизации
     */
    render() {
        const page = this.renderComponent("LoginPage", {
            title: "Авторизация",
        });

        const inputLogin = new Input().render({
            type: "email",
            placeholder: "ivan.petrov@smail.ru",
            input_title: "Почта",
            name: "email",
            input: (event) => {
                const re = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@smail.ru/

                const errorContainer = page.querySelector('.auth-input__error[name="email"]');
                const inputForm = page.querySelector('.input-form[name="email"]');
                if (event.target.value !== "" && !re.test(event.target.value)) {
                    errorContainer.innerText = "Почта должна быть вида *@smail.ru";
                    inputForm.classList.add('error');
                }
                else {
                    errorContainer.innerText = "";
                    inputForm.classList.remove('error');
                }
            },
        });

        const inputPassword = new Input().render({
            type: "password",
            placeholder: "Введите пароль",
            input_title: "Пароль",
            name: "password",
            input: (event) => {
                const errorContainer = page.querySelector('.auth-input__error[name="password"]');
                const inputForm = page.querySelector('.input-form[name="password"]');
                if (event.target.value !== "" && event.target.value.length < 8) {
                    errorContainer.innerText = "Пароль должен быть не менее 8 символов";
                    inputForm.classList.add('error');
                }
                else {
                    errorContainer.innerText = "";
                    inputForm.classList.remove('error');
                }
            },
        });

        const eyePassword = new Input().render({
            type: "checkbox",
            name: "eye-password",
            input: () => {
                const checkBoxEye = document.querySelector('input[name="eye-password"]');
                const visPassword = inputPassword.querySelector("input");

                if (checkBoxEye.checked) {
                    visPassword.type = "text";
                } else {
                    visPassword.type = "password";
                }
            },
        });

        const inputContainer = page.querySelector(".auth-form__inputs");
        inputContainer.appendChild(inputLogin);
        inputContainer.appendChild(inputPassword);

        const inputForm = inputPassword.querySelector(".input-form");
        inputForm.appendChild(eyePassword);

        const buttonLogin = new Button().render({
            name: "button-login-for-login",
            title: "Войти",
            onClick: async (event) => {
                event.preventDefault();
                const form = event.currentTarget.form;
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                const errorContainer = page.querySelectorAll(".auth-input__error");
                errorContainer.forEach((container) => {
                    container.innerText = "";
                });

                const valid = validation(data);

                new Input().setStatusInput(valid, page);

                if (valid.isValid) {
                    const response = await postDataLogin(data);
                    if (!response.isValid) {
                        new Input().setStatusInput(response, page);
                        response.errors.forEach((err) => {
                            const fieldErrorContainer = page.querySelector(`.auth-input__error[name="${err.field}"]`);
                            fieldErrorContainer.innerText = err.message;
                        });
                    } else {
                        window.app.handleRoute("/");
                    }
                } else {
                    valid.errors.forEach((err) => {
                        const fieldErrorContainer = page.querySelector(`.auth-input__error[name="${err.field}"]`);
                        fieldErrorContainer.innerText = err.message;
                    });
                }
            },
        });

        const buttonReg = new Button().render({
            name: "button-reg-for-login",
            title: "Зарегистрироваться",
            onClick: (event) => {
                event.preventDefault();
                window.app.handleRoute("/register");
            },
        });

        const actionsContainer = page.querySelector(".auth-form__actions");
        actionsContainer.appendChild(buttonLogin);
        actionsContainer.appendChild(buttonReg);

        return page;
    }
}
