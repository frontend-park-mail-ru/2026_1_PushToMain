import Death13 from "@react/stands";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import SendMail from "../../widgets/SendMail/SendMail";
import "./SendEmailPage.scss";
import ProfileModal from "../../widgets/ProfileModal/ProfileModal";
import Input from "../../components/Input/Input";
import { AppStorage } from "../../App";
import { getProfile } from "../../api/ApiAuth";

class SendEmailPage extends Death13.Component {
    state: any = {
        isModalOpen: false,
        unReadCount: 0,
    };

    constructor(props: any) {
        super(props);
        this.loadProfile();
        document.addEventListener("click", this.handleCloseModal);
    }

    loadProfile = async () => {
        const data = await getProfile();
        AppStorage.setProfileData(data);
    };

    handleAvatar = (event: Event) => {
        event.stopPropagation();
        event.preventDefault();
        this.setState({ isModalOpen: true });
    };

    handleCloseModal = () => {
        this.setState({ isModalOpen: false });
    };

    handleProfileClick = () => {
        this.setState({ isModalOpen: false });
        window.app.handleRoute("/profile");
    };

    handleBackToMail = () => {
        window.app.handleRoute("/");
    };

    handleNewMail = () => {
        // Уже на странице отправки
    };

    render() {
        const { isModalOpen, unReadCount } = this.state;

        return (
            <div className="send-email-page">
                <aside className="sidebar">
                    <Sidebar isProfile={0} unReadCount={unReadCount} newMail={this.handleNewMail} backToMail={this.handleBackToMail} />
                </aside>
                <div className="right-part">
                    <div className="top-bar">
                        <div className="search-bar">
                            <Input
                                type="text"
                                placeholder="Поиск в почте"
                                name="search"
                                svg="../../assets/svg/Search.svg"
                                onInput={() => {}}
                            />
                        </div>
                        <div className="top-right-menu">
                            <Button
                                svg={AppStorage.image_path || `../../assets/svg/Avatar.svg`}
                                name="avatar"
                                help="Аккаунт"
                                onClick={this.handleAvatar}
                            />
                        </div>
                    </div>
                    <div className="mail-box-container">
                        <SendMail backToMail={this.handleBackToMail} />
                    </div>

                    <ProfileModal isOpen={isModalOpen} onClose={this.handleCloseModal} onProfileClick={this.handleProfileClick} />
                </div>
            </div>
        );
    }
}

export default SendEmailPage;
