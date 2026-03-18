import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { validation } from "../../utils/validation";
import { postDataLogin } from "../../api/ApiAuth";
import "./LoginPage.css";

class LoginPage extends Death13.Component {
    state: any = {
        email: "",
        password: "",
        errors: {},
    };

    async handleSubmit(event: Event) {
        const form = (event.currentTarget as HTMLFormElement)?.form;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const valid = validation(data);

        if (valid.isValid) {
            const response = await postDataLogin(data);
            if (!response) return;
            if (!response.isValid) {
            } else {
                window.app.handleRoute("/");
            }
        }
    }

    render() {
        const { errors } = this.state;
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-page__form-container">
                        <div className="logo-container">
                            <img src="../../assets/svg/Logo.svg" />
                            <h1 className="logo__title">SMail</h1>
                        </div>
                        <h1 className="auth-form__title">Авторизация</h1>
                        <form action="" className="auth-form">
                            <div className="auth-form__inputs">
                                <Input
                                    type="email"
                                    placeholder="Введите почту"
                                    input_title="Почта"
                                    name="email"
                                    error={errors.email}
                                    onInput={() => {}}
                                />
                                <Input
                                    type="password"
                                    placeholder="Введите пароль"
                                    input_title="Пароль"
                                    name="password"
                                    error={errors.password}
                                    onInput={() => {}}
                                />
                            </div>
                            <div className="auth-form__actions">
                                <Button
                                    title="Войти"
                                    name="button-login-for-login"
                                    onClick={async (event: Event) => {
                                        event.preventDefault();
                                        this.handleSubmit(event);
                                    }}
                                />
                                <Button
                                    title="Зарегистрироваться"
                                    name="button-reg-for-login"
                                    onClick={(event: Event) => {
                                        event.preventDefault();
                                        window.app.handleRoute("/register");
                                    }}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginPage;
