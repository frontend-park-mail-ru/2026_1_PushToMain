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
            });
        });
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
                                title="Новое письмо"
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
                                title="Входящие"
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
                                title="Черновики"
                                onClick={(event: any) => {
                                    event.preventDefault();
                                }}
                            />
                            <Button
                                name="button-sends"
                                title="Отправленные"
                                isSelect={this.props.isPress === 1}
                                onClick={(event: any) => {
                                    event.preventDefault();
                                    window.app.handleRoute("/sent");
                                }}
                            />

                            <Button
                                name="button-favorites"
                                title="Избранные"
                                onClick={(event: any) => {
                                    event.preventDefault();
                                }}
                            />
                        </div>

                        <div className="drop-down">
                            <Button
                                name="button-drop-down"
                                title={isVisible ? "Скрыть" : "Ещё"}
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
                                        title="Спам"
                                        onClick={(event: any) => {
                                            event.preventDefault();
                                        }}
                                    />
                                    <Button
                                        name="button-trash"
                                        title="Корзина"
                                        onClick={(event: any) => {
                                            event.preventDefault();
                                        }}
                                    />
                                    <Button
                                        name="button-all-letter"
                                        title="Все письма"
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
                                title="Почтовый ящик"
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
                                title="Личные данные"
                                isSelect={this.props.isPressProfile === 0}
                                onClick={(event: any) => {
                                    event.preventDefault();
                                    changeProfile();
                                }}
                            />
                            <Button
                                name="button-security"
                                title="Безопасность"
                                isSelect={this.props.isPressProfile === 1}
                                onClick={(event: any) => {
                                    event.preventDefault();
                                    changePassword();
                                }}
                            />
                            <Button
                                name="button-settings"
                                title="Настройки"
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
