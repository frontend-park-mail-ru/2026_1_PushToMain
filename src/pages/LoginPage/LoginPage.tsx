import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import "./LoginPage.css";

class LoginPage extends Death13.Component {
    render() {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-page__form-container">
                        <div className="logo-container">
                            <svg width="72px" height="60px">
                                <use href="/public/assets/svg/Logo.svg"></use>
                            </svg>
                            <h1 className="logo__title">SMail</h1>
                        </div>
                        <h1 className="auth-form__title">Авторизация</h1>
                        <form action="" className="auth-form">
                            <div className="auth-form__inputs">
                                <Input type="email" placeholder="Введите почту" input_title="Почта" name="email" />
                                <Input type="password" placeholder="Введите пароль" input_title="Пароль" name="password" />
                            </div>
                            <div className="auth-form__actions">
                                <Button title="Войти" name="button-login-for-login" />
                                <Button title="Зарегистрироваться" name="button-reg-for-login" />
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginPage;
