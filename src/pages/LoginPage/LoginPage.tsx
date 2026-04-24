import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { validation } from "../../utils/validation";
import { postDataLogin } from "../../api/ApiAuth";
import "./LoginPage.scss";
import { AppStorage } from "../../App";

class LoginPage extends Death13.Component {
    state: any = {
        errors: {},
        isLoading: false,
        email: "",
        password: "",
    };

    validateField = (field: string, value: string) => {
        const data: any = {
            email: field === "email" ? value : this.state.email,
            password: field === "password" ? value : this.state.password,
        };

        const result = validation(data, this.t);

        if (!result.isValid) {
            const fieldError = result.errors.find((err: any) => err.field === field);
            if (fieldError) {
                return fieldError.message;
            }
        }
        return undefined;
    };

    handleInputChange = (field: string, value: string) => {
        const error = this.validateField(field, value);

        this.setState({
            [field]: value,
            errors: {
                ...this.state.errors,
                [field]: error,
            },
        });
    };

    validateAllFields = () => {
        const data = {
            email: this.state.email,
            password: this.state.password,
        };

        const result = validation(data, this.t);
        const newErrors: any = {};

        if (!result.isValid) {
            result.errors.forEach((err: any) => {
                if (err.field && !newErrors[err.field]) {
                    newErrors[err.field] = err.message;
                }
            });
        }

        this.setState({ errors: newErrors });
        return result.isValid;
    };

    async handleSubmit(event: Event) {
        event.preventDefault();

        const isValid = this.validateAllFields();

        if (!isValid) {
            return;
        }

        this.setState({ isLoading: true });

        const response = await postDataLogin({
            email: this.state.email,
            password: this.state.password,
        });

        if (response && response.isValid) {
            window.app.handleRoute("/");
        } else if (response && !response.isValid) {
            const serverErrors: any = {};
            response.errors?.forEach((err: any) => {
                if (err.field && !serverErrors[err.field]) {
                    serverErrors[err.field] = err.message;
                }
            });
            this.setState({ errors: serverErrors, isLoading: false });
        }
    }

    t(key: string): string {
        return AppStorage.t(key);
    }

    render() {
        const { errors, email, password } = this.state;
        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-page__form-container">
                        <div className="logo-container">
                            <img src="../../assets/svg/Logo.svg" />
                            <h1 className="logo__title">SMail</h1>
                        </div>
                        <h1 className="auth-form__subtitle">{this.t("auth_subtitle")}</h1>
                        <h1 className="auth-form__title">{this.t("auth_title")}</h1>
                        <form action="" className="auth-form">
                            <div className="auth-form__inputs">
                                <Input
                                    type="email"
                                    placeholder={this.t("enter_email")}
                                    input_title={this.t("email")}
                                    name="email"
                                    error={errors.email}
                                    value={email}
                                    onInput={(e: any) => {
                                        this.handleInputChange("email", e.target.value);
                                    }}
                                />
                                <Input
                                    type="password"
                                    placeholder={this.t("enter_password")}
                                    input_title={this.t("password")}
                                    name="password"
                                    error={errors.password}
                                    value={password}
                                    onInput={(e: any) => {
                                        this.handleInputChange("password", e.target.value);
                                    }}
                                />
                            </div>
                            <div className="auth-form__actions">
                                <Button
                                    title={this.t("enter")}
                                    name="button-login-for-login"
                                    onClick={async (event: Event) => {
                                        event.preventDefault();
                                        await this.handleSubmit(event);
                                    }}
                                />
                                <Button
                                    title={this.t("register")}
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
