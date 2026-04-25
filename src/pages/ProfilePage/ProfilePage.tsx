import Death13 from "@react/stands";
import "./ProfilePage.scss";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import UploadAvatar from "../../components/UploadAvatar/UploadAvatar";
import { validation } from "../../utils/validation";
import { changePassword, getProfile, changeProfile } from "../../api/ApiAuth";
import { AppStorage } from "../../App";
import ProfileModal from "../../widgets/ProfileModal/ProfileModal";
import ConfirmationModal from "../../widgets/ConfirmationModal/ConfirmationModal";
import SelectDate from "../../components/SelectDate/SelectDate";
import FolderChange from "../../widgets/FolderChange/FolderChange";

class ProfilePage extends Death13.Component {
    private unsubscribe: (() => void) | null = null;

    constructor(props: any) {
        super(props);

        this.unsubscribe = AppStorage.subscribe(() => {
            this.setState({ language: AppStorage.language });
        });

        this.loadProfile();

        const shouldOpenSettings = AppStorage.getOpenSettingsOnProfile();

        this.state = {
            errors: {},
            touched: {},
            name: AppStorage.name,
            surname: AppStorage.surname,
            email: AppStorage.email,
            folders: AppStorage.folders,
            oldPassword: "",
            newPassword: "",
            gender: "male",
            profileState: shouldOpenSettings ? 2 : 0,
            avatarKey: 0,
            avatarUrl: AppStorage.getAvatarUrl(),
            isModalOpen: false,
            isConfirm: false,
            isStatus: false,
            language: AppStorage.language,
        };
    }

    loadProfile = async () => {
        const data = await getProfile();
        if (data === null) {
            window.app.handleRoute("/login");
        } else {
            AppStorage.setProfileData({
                name: data.name || "",
                surname: data.surname || "",
                email: data.email || "",
                image_path: data.image_path || "",
                folders: data.folders || {},
            });
            this.setState({
                name: data.name || "",
                surname: data.surname || "",
                email: data.email || "",
                avatarUrl: AppStorage.getAvatarUrl(),
                isStatus: false,
            });
        }
    };

    validateField = (field: string, value: string) => {
        const data: any = {
            email: field === "email" ? value : this.state.email,
            newPassword: field === "newPassword" ? value : this.state.newPassword,
            oldPassword: field === "oldPassword" ? value : this.state.oldPassword,
            name: field === "name" ? value : this.state.name,
            surname: field === "surname" ? value : this.state.surname,
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

    handleAvatarUpdate = () => {
        this.setState({
            avatarKey: this.state.avatarKey + 1,
            avatarUrl: AppStorage.getAvatarUrl(),
            isConfirm: true,
            isStatus: true,
        });
    };

    async handleChangePassword(event: any) {
        event.preventDefault();
        try {
            const response = await changePassword({
                old_password: this.state.oldPassword,
                new_password: this.state.newPassword,
            });

            if (response) {
                this.setState({ oldPassword: "", newPassword: "", isConfirm: true, isStatus: true });
            }
        } catch {
            this.setState({ isConfirm: true });
        }
    }

    async handleChangeProfileData(event: any) {
        event.preventDefault();
        try {
            const response = await changeProfile({
                name: this.state.name,
                surname: this.state.surname,
            });
            if (response) {
                const currentImagePath = AppStorage.image_path;
                AppStorage.setProfileData({
                    name: this.state.name,
                    surname: this.state.surname,
                    email: this.state.email,
                    image_path: currentImagePath,
                    folders: this.state.folders,
                });
                this.setState({
                    name: this.state.name,
                    surname: this.state.surname,
                    isConfirm: true,
                    isStatus: true,
                });
            } else {
                this.setState({ isConfirm: true, isStatus: false });
            }
        } catch (error) {
            console.error("Ошибка изменения профиля:", error);
            this.setState({ isConfirm: true, isStatus: false });
        }
    }

    handleInputChange = (field: string, value: string) => {
        const error = this.validateField(field, value);

        this.setState({
            [field]: value,
            touched: {
                ...this.state.touched,
                [field]: true,
            },
            errors: {
                ...this.state.errors,
                [field]: error,
            },
        });
    };

    shouldShowSuccess = (field: string): boolean => {
        const value = this.state[field];
        const error = this.state.errors[field];
        const isTouched = this.state.touched[field];

        return isTouched && value && !error;
    };

    handleGenderChange = (value: string) => {
        this.setState({ gender: value });
    };

    handleLogout = async (event: Event) => {
        event.preventDefault();
        this.setState({ isModalOpen: false, isConfirm: false });
        window.app.handleRoute("/login");
    };

    handleBackToMail = () => {
        this.setState({ isModalOpen: false, isConfirm: false });
        window.app.handleRoute("/");
    };

    handleAvatar = (event: Event) => {
        event.stopPropagation();
        event.preventDefault();
        this.setState({ isModalOpen: true });
    };

    handleCloseModal = () => {
        this.setState({ isModalOpen: false, isConfirm: false });
    };

    handleProfileClick = () => {
        this.setState({ isModalOpen: false, isConfirm: false });
        window.app.handleRoute("/profile");
    };

    handleChangeProfile = () => {
        this.setState({ profileState: 0 });
    };

    handleChangePasswordState = () => {
        this.setState({ profileState: 1 });
    };

    handleSetting = () => {
        this.setState({ profileState: 2 });
    };

    handleFolder = () => {
        this.setState({ profileState: 3 });
    };

    t(key: string): string {
        return AppStorage.t(key);
    }

    render() {
        const {
            errors,
            oldPassword,
            newPassword,
            name,
            surname,
            profileState,
            avatarKey,
            avatarUrl,
            isModalOpen,
            isConfirm,
            isStatus,
            gender,
        } = this.state;

        return (
            <div className="profile-page" onClick={() => this.handleCloseModal()}>
                <aside className="sidebar">
                    <Sidebar
                        isProfile={1}
                        isPressProfile={profileState}
                        backToMail={this.handleBackToMail}
                        changeProfile={this.handleChangeProfile}
                        changePassword={this.handleChangePasswordState}
                        handleSetting={this.handleSetting}
                        handleFolder={this.handleFolder}
                        newMail={() => {}}
                    />
                </aside>

                <div className="right-part">
                    <div className="top-bar">
                        <div className="search-bar"></div>
                        <div className="top-right-menu">
                            <Button svg={AppStorage.getAvatarUrl()} name="avatar" help="Аккаунт" onClick={this.handleAvatar} />
                        </div>
                    </div>
                    <div className="profile-content-area">
                        {profileState === 0 && (
                            <div className="profile-container">
                                <h1>{this.t("personal_information")}</h1>
                                <div className="profile-content">
                                    <div className="profile-avatar">
                                        <UploadAvatar image={avatarUrl} onAvatarUpdate={this.handleAvatarUpdate} key={avatarKey} />
                                    </div>
                                    <form action="" className="profile-form">
                                        <Input
                                            type="text"
                                            placeholder={this.t("enter_name")}
                                            input_title={this.t("name")}
                                            name="name"
                                            value={name}
                                            success={this.shouldShowSuccess("name")}
                                            error={errors.name}
                                            onInput={(e: any) => {
                                                this.handleInputChange("name", e.target.value);
                                            }}
                                        />
                                        <Input
                                            type="text"
                                            placeholder={this.t("enter_surname")}
                                            input_title={this.t("surname")}
                                            name="surname"
                                            value={surname}
                                            success={this.shouldShowSuccess("surname")}
                                            error={errors.surname}
                                            onInput={(e: any) => {
                                                this.handleInputChange("surname", e.target.value);
                                            }}
                                        />
                                        <SelectDate />
                                        <div className="profile__checkbox">
                                            <span>{this.t("gender")}</span>
                                            <div className="checkbox-actions">
                                                <div className="checkbox-form">
                                                    <Input
                                                        id="male"
                                                        type="radio"
                                                        name="radio-gender"
                                                        checked={gender === "male"}
                                                        onInput={() => this.handleGenderChange("male")}
                                                    />
                                                    <label for="male">{this.t("male")}</label>
                                                </div>

                                                <div className="checkbox-form">
                                                    <Input
                                                        id="female"
                                                        type="radio"
                                                        name="radio-gender"
                                                        checked={gender === "female"}
                                                        onInput={() => this.handleGenderChange("female")}
                                                    />
                                                    <label for="female">{this.t("female")}</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="profile-actions">
                                            <Button
                                                title={this.t("save")}
                                                name="change-profile"
                                                onClick={(event: any) => {
                                                    event.preventDefault();
                                                    this.handleChangeProfileData(event);
                                                }}
                                            />
                                            <Button
                                                title={this.t("back")}
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
                                <h1>{this.t("security")}</h1>
                                <div className="profile-content">
                                    <form action="" className="profile-form">
                                        <Input
                                            type="password"
                                            placeholder={this.t("enter_password")}
                                            input_title={this.t("oldpassword")}
                                            name="oldPassword"
                                            error={errors.oldPassword}
                                            value={oldPassword}
                                            onInput={(e: any) => {
                                                this.handleInputChange("oldPassword", e.target.value);
                                            }}
                                        />
                                        <Input
                                            type="password"
                                            placeholder={this.t("enter_password")}
                                            input_title={this.t("newpassword")}
                                            name="newPassword"
                                            error={errors.newPassword}
                                            value={newPassword}
                                            onInput={(e: any) => {
                                                this.handleInputChange("newPassword", e.target.value);
                                            }}
                                        />
                                        <div className="profile-actions">
                                            <Button
                                                title={this.t("save")}
                                                name="change-password"
                                                onClick={(event: any) => {
                                                    this.handleChangePassword(event);
                                                }}
                                            />
                                            <Button
                                                title={this.t("back")}
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
                        {profileState === 2 && (
                            <div className="profile-security">
                                <h1>{this.t("settings")}</h1>
                                <div className="profile-content">
                                    <form action="" className="profile-form">
                                        <div className="profile__checkbox">
                                            <span>{this.t("theme")}</span>
                                            <div className="checkbox-actions">
                                                <div className="checkbox-form">
                                                    <Input
                                                        id="dark"
                                                        type="radio"
                                                        name="radio-theme"
                                                        checked={AppStorage.theme === "dark"}
                                                        onInput={() => AppStorage.setTheme("dark")}
                                                    />
                                                    <label for="dark">{this.t("dark_theme")}</label>
                                                </div>
                                                <div className="checkbox-form">
                                                    <Input
                                                        id="light"
                                                        type="radio"
                                                        name="radio-theme"
                                                        checked={AppStorage.theme === "light"}
                                                        onInput={() => AppStorage.setTheme("light")}
                                                    />
                                                    <label for="light">{this.t("light_theme")}</label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="profile__checkbox">
                                            <span>{this.t("interface_language")}</span>
                                            <div className="checkbox-actions">
                                                <div className="checkbox-form">
                                                    <Input
                                                        id="ru"
                                                        type="radio"
                                                        name="radio-language"
                                                        checked={AppStorage.language === "ru"}
                                                        onInput={() => AppStorage.setLanguage("ru")}
                                                    />
                                                    <label for="ru">{this.t("russian")}</label>
                                                </div>
                                                <div className="checkbox-form">
                                                    <Input
                                                        id="en"
                                                        type="radio"
                                                        name="radio-language"
                                                        checked={AppStorage.language === "en"}
                                                        onInput={() => AppStorage.setLanguage("en")}
                                                    />
                                                    <label for="en">{this.t("english")}</label>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        {profileState === 3 && (
                            <div className="profile-security">
                                <h1>{this.t("folder")}</h1>
                                <div className="profile-content">
                                    <form action="" className="profile-form">
                                        <FolderChange />
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                    <ProfileModal
                        isOpen={isModalOpen}
                        onClose={this.handleCloseModal}
                        onProfileClick={this.handleProfileClick}
                        onLogout={this.handleLogout}
                    />
                    <ConfirmationModal isOpen={isConfirm} onClose={this.handleCloseModal} isStatus={isStatus} />
                </div>
            </div>
        );
    }
}

export default ProfilePage;
