import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import "./RegPage.css";

class RegPage extends Death13.Component {
    render() {
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-page__form-container">
                        <div className="logo-container">
                            <img src="../../assets/svg/Logo.svg" />
                            <h1 className="logo__title">SMail</h1>
                        </div>
                        <h1 className="auth-form__title">Регистрация</h1>
                        <form action="" className="auth-form">
                            <div className="auth-form__inputs">
                                <Input type="text" placeholder="Введите имя" input_title="Введите имя" name="name" onInput={() => {}} />
                                <Input type="text" placeholder="Введите фамилию" input_title="Фамилия" name="surname" onInput={() => {}} />
                            </div>
                            <div className="auth-form__actions">
                                <Button
                                    title="Продолжить"
                                    name="button-reg-for-reg"
                                    onClick={(event: any) => {
                                        event.preventDefault();
                                    }}
                                />
                                <Button
                                    title="Войти"
                                    name="button-login-for-reg"
                                    onClick={(event: any) => {
                                        event.preventDefault();
                                        window.app.handleRoute("/login");
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

export default RegPage;
