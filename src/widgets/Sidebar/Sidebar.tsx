import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import "./Sidebar.scss";
import { AppStorage } from "../../App";

class Sidebar extends Death13.Component {
    state: any = {
        isVisible: false,
        name: AppStorage.name,
        surname: AppStorage.surname,
        email: AppStorage.email,
        avatarUrl: AppStorage.getAvatarUrl(),
        language: AppStorage.language,
        unReadCount: AppStorage.unReadCount,
    };

    private unsubscribe: (() => void) | null = null;

    constructor(props: any) {
        super(props);

        this.unsubscribe = AppStorage.subscribe(() => {
            this.setState({
                name: AppStorage.name,
                surname: AppStorage.surname,
                email: AppStorage.email,
                avatarUrl: AppStorage.getAvatarUrl(),
                unReadCount: AppStorage.unReadCount,
                language: AppStorage.language,
            });
        });
    }

    t(key: string): string {
        return AppStorage.t(key);
    }

    render() {
        const { isVisible, name, surname, email, avatarUrl, unReadCount } = this.state;
        const { isProfile = 0, backToMail, changeProfile, changePassword, newMail, updateMail, handleSetting } = this.props;

        return (
            <div className="sidebar-widget">
                <div
                    className="logo-container"
                    onClick={(event: any) => {
                        event.preventDefault();
                        if (this.props.updateMail) {
                            updateMail();
                        }
                        backToMail();
                    }}>
                    <img src="../../assets/svg/Logo.svg" />
                    <h1 className="logo__title">SMail</h1>
                </div>
                {isProfile !== 1 && (
                    <div className="sidebar-content">
                        <div className="main-button">
                            <Button
                                title={this.t("new_letter")}
                                name="button-new-letter"
                                onClick={(event: any) => {
                                    event.preventDefault();
                                    newMail();
                                }}
                            />
                        </div>
                        <div className="main-button-container">
                            <Button
                                name="button-inbox"
                                title={this.t("inbox")}
                                isSelect={this.props.isPress === 0}
                                count={unReadCount}
                                onClick={(event: any) => {
                                    event.preventDefault();
                                    if (this.props.updateMail) {
                                        updateMail();
                                    }
                                    backToMail();
                                }}
                            />

                            <Button
                                name="button-drafs"
                                title={this.t("drafts")}
                                onClick={(event: any) => {
                                    event.preventDefault();
                                }}
                            />
                            <Button
                                name="button-sends"
                                title={this.t("sent")}
                                isSelect={this.props.isPress === 1}
                                onClick={(event: any) => {
                                    event.preventDefault();
                                    window.app.handleRoute("/sent");
                                }}
                            />

                            <Button
                                name="button-favorites"
                                title={this.t("starred")}
                                onClick={(event: any) => {
                                    event.preventDefault();
                                }}
                            />
                        </div>

                        <div className="drop-down">
                            <Button
                                name="button-drop-down"
                                title={isVisible ? this.t("hide") : this.t("yet")}
                                onClick={(event: any) => {
                                    event.preventDefault();
                                    this.setState({ isVisible: !isVisible });
                                    const button = event.currentTarget;
                                    button.classList.toggle("active");
                                }}
                            />
                            {isVisible && (
                                <div className="extra-button-container">
                                    <Button
                                        name="button-spam"
                                        title={this.t("spam")}
                                        onClick={(event: any) => {
                                            event.preventDefault();
                                        }}
                                    />
                                    <Button
                                        name="button-trash"
                                        title={this.t("trash")}
                                        onClick={(event: any) => {
                                            event.preventDefault();
                                        }}
                                    />
                                    <Button
                                        name="button-all-letter"
                                        title={this.t("all_letter")}
                                        onClick={(event: any) => {
                                            event.preventDefault();
                                            backToMail();
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}{" "}
                {isProfile === 1 && (
                    <div className="sidebar-content">
                        <div className="sidebar-profile">
                            <img src={avatarUrl}></img>
                            <span>
                                {name} {surname}
                            </span>
                            <p>{email}</p>
                        </div>
                        <div className="main-button-profile">
                            <Button
                                title={this.t("mailbox")}
                                name="button-back-letter"
                                onClick={(event: any) => {
                                    event.preventDefault();
                                    backToMail();
                                }}
                            />
                        </div>
                        <div className="main-button-container">
                            <Button
                                name="button-profile"
                                title={this.t("personal_information")}
                                isSelect={this.props.isPressProfile === 0}
                                onClick={(event: any) => {
                                    event.preventDefault();
                                    changeProfile();
                                }}
                            />
                            <Button
                                name="button-security"
                                title={this.t("security")}
                                isSelect={this.props.isPressProfile === 1}
                                onClick={(event: any) => {
                                    event.preventDefault();
                                    changePassword();
                                }}
                            />
                            <Button
                                name="button-settings"
                                title={this.t("settings")}
                                isSelect={this.props.isPressProfile === 2}
                                onClick={(event: any) => {
                                    event.preventDefault();
                                    handleSetting();
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Sidebar;
