import Death13 from "@react/stands";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import MailHeader from "../../widgets/MailHeader/MailHeader";
import MailBox from "../../widgets/MailBox/MailBox";
import { getEmail } from "../../api/ApiEmail";
import "./MainPage.scss";
import ProfileModal from "../../widgets/ProfileModal/ProfileModal";
import Profile from "../../widgets/Profile/Profile";
import SendMail from "../../widgets/SendMail/SendMail";
import ReadMail from "../../widgets/ReadMail/ReadMail";

class MainPage extends Death13.Component {
    state: any = {
        emails: [],
        isLoading: true,
        isModalOpen: false,
        isStateMode: 0,
        profileState: 0,
        selectedEmail: null,
        isSelectAll: false,
    };

    constructor(props: any) {
        super(props);
        this.loadEmails();
    }

    async loadEmails() {
        try {
            const emails = await getEmail();
            if (emails === undefined) {
                window.app.handleRoute("/login");
                return;
            }
            this.setState({ emails, isLoading: false });
        } catch (error) {
            console.error("Failed to load emails:", error);
            window.app.handleRoute("/login");
        }
    }

    handleLogout = (event: Event) => {
        event.preventDefault();
        window.app.handleRoute("/login");
    };

    handleAvatar = (event: Event) => {
        event.preventDefault();
        this.setState({ isModalOpen: true });
    };

    handleCloseModal = () => {
        this.setState({ isModalOpen: false });
    };
    handleProfileClick = () => {
        this.setState({ isModalOpen: false, isStateMode: 1 });
    };

    handleBackToMail = () => {
        this.setState({ isStateMode: 0 });
    };

    handleChangeProfile = () => {
        this.setState({ profileState: 0 });
    };

    handleChangePassword = () => {
        this.setState({ profileState: 1 });
    };

    handleNewMail = () => {
        this.setState({ isStateMode: 2 });
    };

    handleReadMail = (email: any) => {
        this.setState({ isStateMode: 3, selectedEmail: email });
    };

    handleSelectAll = () => {};

    handleSearch = (value: string) => {
        console.log("Search:", value);
    };

    render() {
        const { emails, isModalOpen, isStateMode, profileState, selectedEmail, isSelectAll } = this.state;
        console.log(emails);
        return (
            <div className="main-page">
                <aside className="sidebar">
                    <Sidebar
                        isProfile={isStateMode}
                        backToMail={this.handleBackToMail}
                        changeProfile={this.handleChangeProfile}
                        changePassword={this.handleChangePassword}
                        newMail={this.handleNewMail}
                    />
                </aside>
                <div className="right-part">
                    <div className="top-bar">
                        <div className="search-bar">
                            <Input
                                type="text"
                                placeholder="Поиск в почте"
                                name="search"
                                svg="../../assets/svg/Search.svg"
                                onInput={(e: any) => {
                                    this.handleSearch(e.target.value);
                                }}
                            />
                        </div>
                        <div className="top-right-menu">
                            <Button svg="../../assets/svg/Avatar.svg" name="avatar" help="Аккаунт" onClick={this.handleAvatar} />
                        </div>
                    </div>
                    <div className="mail-box-container">
                        {isStateMode === 0 && (
                            <div className="container-form">
                                <MailHeader onSelectAll={this.handleSelectAll} isSelectAll={isSelectAll} />
                                <div className="mail-box-container-form">
                                    {emails.map((email: any, index: number) => (
                                        <MailBox
                                            key={index}
                                            theme={email.header}
                                            title={email.body}
                                            date="15:00"
                                            onClick={() => this.handleReadMail(email)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}{" "}
                        {isStateMode === 1 && <Profile profileState={profileState} />}
                        {isStateMode === 2 && <SendMail />}
                        {isStateMode === 3 && <ReadMail email={selectedEmail} />}
                    </div>

                    <ProfileModal isOpen={isModalOpen} onClose={this.handleCloseModal} onProfileClick={this.handleProfileClick} />
                </div>
            </div>
        );
    }
}

export default MainPage;
