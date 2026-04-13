import Death13 from "@react/stands";
import "./ProfileModal.scss";
import Button from "../../components/Button/Button";
import { logOut } from "../../api/ApiAuth";
import { AppStorage } from "../../App";

class ProfileModal extends Death13.Component {
    handleClose = () => {
        this.props.onClose();
    };

    handleExit = async () => {
        await logOut();

        AppStorage.setProfileData({ name: "", surname: "", email: "", image_path: "" });
        AppStorage.setUnReadCount(0);

        window.app.handleRoute("/login");
    };

    handleProfileClick = (event: any) => {
        event.preventDefault();
        this.props.onProfileClick();
        this.props.onClose();
    };

    render() {
        const { isOpen } = this.props;
        if (!isOpen) return null;

        return (
            <div className="modal-overlay shadow" onClick={(e: any) => e.stopPropagation()}>
                <div className="overlay__title">
                    <p>Здравствуйте, {AppStorage.name}!</p>
                    <div className="overlay__close">
                        <Button svg="../../assets/svg/Close.svg" onClick={this.handleClose} />
                    </div>
                </div>
                <div className="overlay__avatar">
                    <img src={AppStorage.getAvatarUrl()}></img>
                </div>
                <div className="overlay__email">{AppStorage.email}</div>
                <div className="overlay-actions">
                    <Button title="Профиль" name="profile" svg="../../assets/svg/User.svg" onClick={this.handleProfileClick} />
                    <Button
                        title="Настройки"
                        name="settings"
                        svg="../../assets/svg/Settings.svg"
                        onClick={(event: any) => {
                            event.preventDefault();
                        }}
                    />
                </div>
                <div className="button-exit">
                    <Button
                        title="Выйти"
                        onClick={(event: any) => {
                            event.preventDefault();
                            this.handleExit();
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default ProfileModal;
