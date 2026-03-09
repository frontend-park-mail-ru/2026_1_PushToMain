import { BaseComponent } from "../../components/BaseComponent.js";
import { Button } from "../../components/Button/Button.js";
import { postDataReg } from "../../api/ApiAuth.js";
import { validation } from "../../utils/validation.js";
import { Input } from "../../components/Input/Input.js";

export class RegPage extends BaseComponent {
    /**
     * Создает экземпляр страницы регистрации
     * @constructor
     */
    constructor() {
        super();
        this.state = 1;
        this.fullData = {};
    }

    /**
     * Обновляет содержимое страницы в соответствии с текущим состоянием (this.state).
     * Удаляет старый контент из this.rootElement, рендерит новый контент с помощью this.render()
     * и добавляет его в this.rootElement.
     */
    updateView() {
        const newContent = this.render();
        this.rootElement.innerHTML = "";
        this.rootElement.appendChild(newContent);
    }

    /**
     * Рендерит страницу регистраци с заданными свойствами.
     * Каждая часть формы регистрации отображается в зависимости от текущего состояния (this.state).
     * @returns {HTMLElement} Возвращает DOM-элемент страницы регистрации
     */
    render() {
        const page = this.renderComponent("RegPage", {
            title: "Регистрация",
        });

        this.rootElement = document.getElementById("root");

        const inputName = new Input().render({
            type: "text",
            placeholder: "Введите имя",
            input_title: "Имя",
            name: "name",
            input_value: this.fullData.name,
        });

        const inputSurname = new Input().render({
            type: "text",
            placeholder: "Введите фамилию",
            input_title: "Фамилия",
            name: "surname",
            input_value: this.fullData.surname,
        });

        const button_login = new Button().render({
            name: "button-login-for-reg",
            title: "Войти",
            onClick: (event) => {
                event.preventDefault();
                window.app.handleRoute("/login");
            },
        });

        const button_reg_state1 = new Button().render({
            name: "button-reg-for-reg",
            title: "Продолжить",
            onClick: (event) => {
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
                    this.state = 2;
                    this.fullData = { ...this.fullData, ...data };
                    this.updateView();
                } else {
                    valid.errors.forEach((err) => {
                        const fieldErrorContainer = page.querySelector(`.auth-input__error[name="${err.field}"]`);
                        fieldErrorContainer.innerText = err.message;
                    });
                }
            },
        });

        const actionsContainer = page.querySelector(".auth-form__actions");
        const inputContainer = page.querySelector(".auth-form__inputs");

        if (this.state === 1) {
            inputContainer.appendChild(inputName);
            inputContainer.appendChild(inputSurname);

            actionsContainer.appendChild(button_reg_state1);
            actionsContainer.appendChild(button_login);
        } else {
            const inputEmail = new Input().render({
                type: "email",
                placeholder: "Введите новый адрес *@smail.ru",
                input_title: "Адрес почты",
                name: "email",
                input_value: this.fullData.email,
            });

            const inputPassword = new Input().render({
                type: "password",
                placeholder: "Введите пароль",
                input_title: "Пароль",
                name: "password",
                input_value: this.fullData.password,
            });

            const eyePassword = new Input().render({
                type: "checkbox",
                name: "eye-password",
                input: () => {
                    const CheckBoxEye = document.querySelector('input[name="eye-password"]');
                    const visPassword = inputPassword.querySelector("input");

                    if (CheckBoxEye.checked) {
                        visPassword.type = "text";
                    } else {
                        visPassword.type = "password";
                    }
                },
            });

            const button_reg_state2 = new Button().render({
                name: "button-reg-for-reg",
                title: "Зарегистрироваться",
                onClick: async (event) => {
                    event.preventDefault();
                    const form = event.currentTarget.form;
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData.entries());
                    this.fullData = { ...this.fullData, ...data };

                    const errorContainer = page.querySelectorAll(".auth-input__error");
                    errorContainer.forEach((container) => {
                        container.innerText = "";
                    });

                    const valid = validation(data);

                    new Input().setStatusInput(valid, page);

                    if (valid.isValid) {
                        const response = await postDataReg(data);
                        if (!response.isValid) {
                            new Input().setStatusInput(response, page);
                            response.errors.forEach((err) => {
                                const fieldErrorContainer = page.querySelector(`.auth-input__error[name="${err.field}"]`);
                                fieldErrorContainer.innerText = err.message;
                            });
                        } else {
                            document.cookie = `token=${response.token}; path=/; samesite=Strict; max-age=60*60*24`;
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

            const buttonBack = new Button().render({
                name: "button-login-for-reg",
                title: "Назад",
                onClick: (event) => {
                    event.preventDefault();
                    const form = event.currentTarget.form;
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData.entries());
                    this.state = 1;
                    this.fullData = { ...this.fullData, ...data };
                    this.updateView();
                },
            });

            inputContainer.appendChild(inputEmail);
            inputContainer.appendChild(inputPassword);

            const inputForm = inputPassword.querySelector(".input-form");
            inputForm.appendChild(eyePassword);

            actionsContainer.appendChild(button_reg_state2);
            actionsContainer.appendChild(buttonBack);
        }

        return page;
    }
}
