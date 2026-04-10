import Death13 from "@react/stands";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import MailHeader from "../../widgets/MailHeader/MailHeader";
import MailBox from "../../widgets/MailBox/MailBox";
import { getEmail } from "../../api/ApiEmail";
import "./MainPage.scss";
import ProfileModal from "../../widgets/ProfileModal/ProfileModal";
import SendMail from "../../widgets/SendMail/SendMail";
import ReadMail from "../../widgets/ReadMail/ReadMail";

class MainPage extends Death13.Component {
    state: any = {
        emails: [],
        isLoading: true,
        isModalOpen: false,
        isStateMode: 0,
        selectedEmail: null,
        isSelectAll: false,
        isEmail: false,
    };

    constructor(props: any) {
        super(props);
        this.loadEmails();
        document.addEventListener("click", this.handleCloseModal);
    }

    async loadEmails() {
        try {
            const data = await getEmail();
            const emails = data.emails;

            if (data === undefined) {
                window.app.handleRoute("/login");
                return;
            }
            this.setState({ emails: emails, isLoading: false });
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

    handleNewMail = () => {
        this.setState({ isStateMode: 2 });
    };

    handleReadMail = (email: any) => {
        this.setState({ isStateMode: 3, selectedEmail: email });
    };

    handleSelectAll() {}

    handleSearch = (value: string) => {
        console.log("Search:", value);
    };

    render() {
        const { emails, isModalOpen, isStateMode, selectedEmail, isSelectAll } = this.state;
        return (
            <div className="main-page">
                <aside className="sidebar">
                    <Sidebar
                        isProfile={0}
                        backToMail={() => {}}
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
                            <Button 
                                svg="../../assets/svg/Avatar.svg" 
                                name="avatar" 
                                help="Аккаунт" 
                                onClick={this.handleAvatar} 
                            />
                        </div>
                    </div>
                    <div className="mail-box-container">
                        {isStateMode === 0 && (
                            <div className="container-form">
                                <MailHeader onSelectAll={this.handleSelectAll} isSelectAll={isSelectAll} />
                                {emails.length === 0 && (
                                    <div className="mail-box-container-form__placeholder">
                                        <div className="mail-box-container-form__placeholder__icon"></div>
                                        <span>Ваш почтовый ящик пуст :(</span>
                                        <span>Напишите ваше первое письмо, нажав на кнопку слева</span>
                                    </div>
                                )}
                                {emails.length !== 0 && (
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
                                )}
                            </div>
                        )}
                        {isStateMode === 2 && <SendMail />}
                        {isStateMode === 3 && <ReadMail email={selectedEmail} />}
                    </div>

                    <ProfileModal 
                        isOpen={isModalOpen} 
                        onClose={this.handleCloseModal} 
                        onProfileClick={this.handleProfileClick} 
                    />
                </div>
            </div>
        );
    }
}

export default MainPage;