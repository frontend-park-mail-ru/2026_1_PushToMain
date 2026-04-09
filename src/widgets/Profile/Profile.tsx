import Death13 from "@react/stands";
import "./Profile.scss";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import SelectDate from "../../components/SelectDate/SelectDate";
import UploadAvatar from "../../components/UploadAvatar/UploadAvatar";
import { validation } from "../../utils/validation";

class Profile extends Death13.Component {
    state: any = {
        errors: {},
        name: "",
        surname: "",
        email: "",
        oldPassword: "",
        newPassword: "",
    };

    validateField = (field: string, value: string) => {
        const data: any = {
            email: field === "email" ? value : this.state.email,
            password: field === "password" ? value : this.state.password,
            name: field === "name" ? value : this.state.name,
            surname: field === "surname" ? value : this.state.surname,
        };

        const result = validation(data);

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

    render() {
        const { errors, oldPassword, newPassword, name, surname } = this.state;
        const { profileState, backToMail } = this.props;
        console.log(errors);
        return (
            <div className="profile">
                {profileState === 0 && (
                    <div className="profile-container">
                        <h1>Личные данные</h1>
                        <div className="profile-content">
                            <div className="profile-avatar">
                                <UploadAvatar />
                            </div>
                            <form action="" className="profile-form">
                                <Input
                                    type="text"
                                    placeholder="Введите имя"
                                    input_title="Имя"
                                    name="name"
                                    value={name}
                                    error={errors.name}
                                    onInput={(e: any) => {
                                        this.handleInputChange("name", e.target.value);
                                    }}
                                />
                                <Input
                                    type="text"
                                    placeholder="Введите фамилию"
                                    input_title="Фамилия"
                                    name="surname"
                                    value={surname}
                                    error={errors.surname}
                                    onInput={(e: any) => {
                                        this.handleInputChange("surname", e.target.value);
                                    }}
                                />
                                <SelectDate />
                                <div className="profile__checkbox">
                                    <span>Пол</span>
                                    <div className="checkbox-actions">
                                        <div className="checkbox-form">
                                            <Input type="radio" name="radio-gender" onInput={() => {}} />
                                            <span>Мужской</span>
                                        </div>

                                        <div className="checkbox-form">
                                            <Input type="radio" name="radio-gender" onInput={() => {}} />
                                            <span>Женский</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="profile-actions">
                                    {" "}
                                    <Button
                                        title="Сохранить"
                                        name="change-profile"
                                        onClick={(event: any) => {
                                            event.preventDefault();
                                        }}
                                    />{" "}
                                    <Button
                                        title="Отменить"
                                        name="back-to-mail"
                                        onClick={(event: any) => {
                                            event.preventDefault();
                                            backToMail();
                                        }}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {profileState === 1 && (
                    <div className="profile-form">
                        <h1>Безопасность</h1>
                        <div className="profile-content">
                            <form action="" className="profile-form">
                                <Input
                                    type="password"
                                    placeholder="Введите пароль"
                                    input_title="Старый пароль"
                                    name="oldPassword"
                                    error={errors.oldPpassword}
                                    value={oldPassword}
                                    onInput={(e: any) => {
                                        this.handleInputChange("password", e.target.value);
                                    }}
                                />{" "}
                                <Input
                                    type="password"
                                    placeholder="Введите пароль"
                                    input_title="Новый пароль"
                                    name="newPassword"
                                    error={errors.newPassword}
                                    value={newPassword}
                                    onInput={(e: any) => {
                                        this.handleInputChange("password", e.target.value);
                                    }}
                                />
                                <div className="profile-actions">
                                    {" "}
                                    <Button
                                        title="Сохранить"
                                        name="change-password"
                                        onClick={(event: any) => {
                                            event.preventDefault();
                                        }}
                                    />{" "}
                                    <Button
                                        title="Отменить"
                                        name="back-to-mail"
                                        onClick={(event: any) => {
                                            event.preventDefault();
                                            backToMail();
                                        }}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Profile;
