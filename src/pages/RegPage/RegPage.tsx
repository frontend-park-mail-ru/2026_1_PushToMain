import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { validation } from "../../utils/validation";
import { postDataReg } from "../../api/ApiAuth";
import "./RegPage.scss";
import { AppStorage } from "../../App";

class RegPage extends Death13.Component {
    state: any = {
        step: 1,
        formData: {
            name: "",
            surname: "",
            email: "",
            password: "",
        },
        errors: {},
    };

    handleInputChange = (field: string, value: string) => {
        const error = this.validateField(field, value);

        this.setState({
            formData: {
                ...this.state.formData,
                [field]: value,
            },
            errors: {
                ...this.state.errors,
                [field]: error,
            },
        });
    };

    validateField = (field: string, value: string) => {
        const data: any = {
            name: field === "name" ? value : this.state.formData.name,
            surname: field === "surname" ? value : this.state.formData.surname,
            email: field === "email" ? value : this.state.formData.email,
            password: field === "password" ? value : this.state.formData.password,
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

    validateStep1 = () => {
        const data = {
            name: this.state.formData.name,
            surname: this.state.formData.surname,
        };

        const result = validation(data, this.t);
        const newErrors: any = {};

        if (!result.isValid) {
            result.errors.forEach((err: any) => {
                if (err.field) {
                    newErrors[err.field] = err.message;
                }
            });
        }

        this.setState({ errors: newErrors });
        return result.isValid;
    };

    validateStep2 = () => {
        const data = {
            email: this.state.formData.email,
            password: this.state.formData.password,
        };

        const result = validation(data, this.t);
        const newErrors: any = {};

        if (!result.isValid) {
            result.errors.forEach((err: any) => {
                if (err.field) {
                    newErrors[err.field] = err.message;
                }
            });
        }

        this.setState({ errors: newErrors });
        return result.isValid;
    };

    handleNextStep = (event: Event) => {
        event.preventDefault();

        const isValid = this.validateStep1();

        if (isValid) {
            this.setState({ step: 2 });
        }
    };

    handleBackStep = (event: Event) => {
        event.preventDefault();
        this.setState({ step: 1 });
    };

    handleRegister = async (event: Event) => {
        event.preventDefault();

        const isValid = this.validateStep2();

        if (!isValid) {
            return;
        }

        try {
            const response = await postDataReg(this.state.formData);

            if (response && response.isValid) {
                window.app.handleRoute("/");
            } else if (response && !response.isValid) {
                const serverErrors: any = {};
                response.errors?.forEach((err: any) => {
                    if (err.field) {
                        serverErrors[err.field] = err.message;
                    }
                });
                this.setState({ errors: serverErrors });
            }
        } catch (error) {
            console.error("Registration error:", error);
            this.setState({
                errors: {
                    email: "Ошибка соединения",
                    password: "Ошибка соединения",
                },
            });
        }
    };

    t(key: string): string {
        return AppStorage.t(key);
    }

    render() {
        const { step, formData, errors } = this.state;

        return (
            <div className="auth-page">
                <div className="auth-container">
                    <div className="auth-page__form-container">
                        <div className="logo-container">
                            <img src="../../assets/svg/Logo.svg" />
                            <h1 className="logo__title">SMail</h1>
                        </div>
                        <h1 className="auth-form__subtitle">{this.t("auth_subtitle")}</h1>
                        <h1 className="auth-form__title">{this.t("auth_title2")}</h1>
                        <form action="" className="auth-form">
                            <div className="auth-form__inputs">
                                {step === 1 && (
                                    <div className="auth-form__inputs">
                                        <Input
                                            key="name-input"
                                            type="text"
                                            placeholder={this.t("enter_name")}
                                            input_title={this.t("name")}
                                            name="name"
                                            error={errors.name}
                                            value={formData.name}
                                            onInput={(e: any) => {
                                                this.handleInputChange("name", e.target.value);
                                            }}
                                        />
                                        <Input
                                            key="surname-input"
                                            type="text"
                                            placeholder={this.t("enter_surname")}
                                            input_title={this.t("surname")}
                                            name="surname"
                                            error={errors.surname}
                                            value={formData.surname}
                                            onInput={(e: any) => {
                                                this.handleInputChange("surname", e.target.value);
                                            }}
                                        />
                                    </div>
                                )}
                                {step === 2 && (
                                    <div className="auth-form__inputs">
                                        <Input
                                            type="email"
                                            placeholder={this.t("enter_email")}
                                            input_title={this.t("email")}
                                            name="email"
                                            error={errors.email}
                                            value={formData.email}
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
                                            value={formData.password}
                                            onInput={(e: any) => {
                                                this.handleInputChange("password", e.target.value);
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="auth-form__actions">
                                {step === 1 && (
                                    <div className="auth-form__actions">
                                        <Button title={this.t("continue")} name="button-reg-for-reg" onClick={this.handleNextStep} />
                                        <Button
                                            title={this.t("enter")}
                                            name="button-login-for-reg"
                                            onClick={(event: Event) => {
                                                event.preventDefault();
                                                window.app.handleRoute("/login");
                                            }}
                                        />
                                    </div>
                                )}
                                {step === 2 && (
                                    <div className="auth-form__actions">
                                        <Button title={this.t("register")} name="button-reg-for-reg" onClick={this.handleRegister} />
                                        <Button title={this.t("back")} name="button-login-for-reg" onClick={this.handleBackStep} />
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default RegPage;
