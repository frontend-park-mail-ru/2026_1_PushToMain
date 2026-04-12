import Death13 from "@react/stands";
import "./ProfilePage.scss";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import SelectDate from "../../components/SelectDate/SelectDate";
import UploadAvatar from "../../components/UploadAvatar/UploadAvatar";
import { validation } from "../../utils/validation";
import { changePassword, getProfile } from "../../api/ApiAuth";
import { AppStorage } from "../../App";
import { URLMINIO } from "../../api/config";

class ProfilePage extends Death13.Component {
    constructor(props: any) {
        super(props);
        this.loadProfile();
    }

    state: any = {
        errors: {},
        name: AppStorage.name,
        surname: AppStorage.surname,
        email: AppStorage.email,
        image_path: AppStorage.image_path,
        oldPassword: "",
        newPassword: "",
        gender: "male",
        profileState: 0,
    };

    loadProfile = async () => {
        const data = await getProfile();
        AppStorage.setProfileData(data);
        this.setState({
            name: data.name || "",
            surname: data.surname || "",
            email: data.email || "",
            image_path: `${URLMINIO}/${data.image_path}` || "",
        });
    };

    validateField = (field: string, value: string) => {
        const data: any = {
            email: field === "email" ? value : this.state.email,
            newPassword: field === "newPassword" ? value : this.state.newPassword,
            oldPassword: field === "oldPassword" ? value : this.state.oldPassword,
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

    async handleChangePassword(event: any) {
        event.preventDefault();
        try {
            const response = await changePassword({
                oldPassword: this.state.oldPassword,
                newPassword: this.state.newPassword,
            });

            if (response) {
                console.log("Пароль успешно изменен");
            }
        } catch (error) {
            console.error("Ошибка изменения пароля", error);
        }
    }

    handleInputChange = (field: string, value: string) => {
        const error = this.validateField(field, value);
        console.log(field, value);

        this.setState({
            [field]: value,
            errors: {
                ...this.state.errors,
                [field]: error,
            },
        });
    };

    handleGenderChange = (value: string) => {
        this.setState({ gender: value });
    };

    handleBackToMail = () => {
        window.app.handleRoute("/");
    };

    handleChangeProfile = () => {
        this.setState({ profileState: 0 });
    };

    handleChangePasswordState = () => {
        this.setState({ profileState: 1 });
    };

    render() {
        const { errors, oldPassword, newPassword, name, surname, gender, profileState, image_path } = this.state;

        return (
            <div className="profile-page">
                <aside className="sidebar">
                    <Sidebar
                        isProfile={1}
                        backToMail={this.handleBackToMail}
                        changeProfile={this.handleChangeProfile}
                        changePassword={this.handleChangePasswordState}
                        newMail={() => {}}
                    />
                </aside>

                <div className="right-part">
                    <div className="profile-content-area">
                        {profileState === 0 && (
                            <div className="profile-container">
                                <h1>Личные данные</h1>
                                <div className="profile-content">
                                    <div className="profile-avatar">
                                        <UploadAvatar image={image_path} />
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
                                                    <Input
                                                        id="male"
                                                        type="radio"
                                                        name="radio-gender"
                                                        checked={gender === "male"}
                                                        onInput={() => this.handleGenderChange("male")}
                                                    />
                                                    <label for="male">Мужской</label>
                                                </div>

                                                <div className="checkbox-form">
                                                    <Input
                                                        id="female"
                                                        type="radio"
                                                        name="radio-gender"
                                                        checked={gender === "female"}
                                                        onInput={() => this.handleGenderChange("female")}
                                                    />
                                                    <label for="female">Женский</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="profile-actions">
                                            <Button
                                                title="Сохранить"
                                                name="change-profile"
                                                onClick={(event: any) => {
                                                    event.preventDefault();
                                                }}
                                            />
                                            <Button
                                                title="Отменить"
                                                name="back-to-mail"
                                                onClick={(event: any) => {
                                                    event.preventDefault();
                                                    this.handleBackToMail();
                                                }}
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {profileState === 1 && (
                            <div className="profile-security">
                                <h1>Безопасность</h1>
                                <div className="profile-content">
                                    <form action="" className="profile-form">
                                        <Input
                                            type="password"
                                            placeholder="Введите пароль"
                                            input_title="Старый пароль"
                                            name="oldPassword"
                                            error={errors.oldPassword}
                                            value={oldPassword}
                                            onInput={(e: any) => {
                                                this.handleInputChange("oldPassword", e.target.value);
                                            }}
                                        />
                                        <Input
                                            type="password"
                                            placeholder="Введите пароль"
                                            input_title="Новый пароль"
                                            name="newPassword"
                                            error={errors.newPassword}
                                            value={newPassword}
                                            onInput={(e: any) => {
                                                this.handleInputChange("newPassword", e.target.value);
                                            }}
                                        />
                                        <div className="profile-actions">
                                            <Button
                                                title="Сохранить"
                                                name="change-password"
                                                onClick={(event: any) => {
                                                    this.handleChangePassword(event);
                                                }}
                                            />
                                            <Button
                                                title="Отменить"
                                                name="back-to-mail"
                                                onClick={(event: any) => {
                                                    event.preventDefault();
                                                    this.handleBackToMail();
                                                }}
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfilePage;
