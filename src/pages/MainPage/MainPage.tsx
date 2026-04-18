import Death13 from "@react/stands";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import MailHeader from "../../widgets/MailHeader/MailHeader";
import MailBox from "../../widgets/MailBox/MailBox";
import { getProfile } from "../../api/ApiAuth";
import { getEmailAll, getEmailSend, readEmail } from "../../api/ApiEmail";
import "./MainPage.scss";
import ProfileModal from "../../widgets/ProfileModal/ProfileModal";
import { AppStorage } from "../../App";

class MainPage extends Death13.Component {
    state: any = {
        emails: [],
        isLoading: true,
        isModalOpen: false,
        isStateMode: 0,
        selectedEmail: null,
        isSelectAll: false,
        offset: 0,
        selectedEmails: [],
    };

    constructor(props: any) {
        super(props);
        this.loadEmails(this.state.offset);
        this.loadProfile();
    }

    loadProfile = async () => {
        const data = await getProfile();
        AppStorage.setProfileData(data);
    };

    loadEmails = async (offset: number) => {
        try {
            const data = await getEmailAll(offset);
            const emails = data.emails;

            if (data === undefined) {
                window.app.handleRoute("/login");
                return null;
            }
            this.setState({
                emails: emails,
                isLoading: false,
                total: data.total,
                offset: offset,
            });
            AppStorage.setUnReadCount(data.unread_count);
        } catch (error) {
            console.error("Failed to load emails:", error);
            window.app.handleRoute("/login");
        }
    };

    handleUpdateEmail = () => {
        this.loadEmails(this.state.offset);
    };

    handleLogout = async (event: Event) => {
        event.preventDefault();
        window.app.handleRoute("/login");
    };

    formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const currentTime = new Date();
        if (Math.abs(currentTime.getDate() - date.getDate()) > 1) {
            return date.toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        }

        if (date.toDateString() === currentTime.toDateString()) {
            return date.toLocaleTimeString("ru-RU", {
                hour: "2-digit",
                minute: "2-digit",
            });
        }

        const yesterday = new Date(currentTime);
        yesterday.setDate(currentTime.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return "Вчера";
        }

        return date.toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "short",
        });
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
        window.app.handleRoute("/send");
    };

    async handleReadMail(email: any) {
        this.setState({ isStateMode: 3, selectedEmail: email });
        await readEmail(email.id);
        window.app.handleRoute(`/read/${email.id}`);
    }

    handleSelectAll = (isChecked: boolean) => {
        const { emails } = this.state;
        const selectedEmails = isChecked ? emails.map((email: any) => email.id) : [];
        this.setState({
            isSelectAll: isChecked,
            selectedEmails: selectedEmails,
        });
    };

    handleSelectEmail = (emailId: string, isSelected: boolean) => {
        const { selectedEmails, emails } = this.state;
        let newSelectedEmails;

        if (isSelected) {
            newSelectedEmails = [...selectedEmails, emailId];
        } else {
            newSelectedEmails = selectedEmails.filter((id: string) => id !== emailId);
        }

        this.setState({
            selectedEmails: newSelectedEmails,
            isSelectAll: newSelectedEmails.length === emails.length,
        });
    };

    handleGetSendEmail = async () => {
        await getEmailSend(this.state.offset);
    };

    handleGoToMain = () => {
        this.setState({ isStateMode: 0 });
    };

    handleSearch = () => {};

    render() {
        const { emails, isModalOpen, isStateMode, isSelectAll, total, selectedEmails } = this.state;
        return (
            <div className="main-page" onClick={() => this.handleCloseModal()}>
                <aside className="sidebar">
                    <Sidebar
                        isProfile={0}
                        isPress={0}
                        newMail={this.handleNewMail}
                        backToMail={this.handleGoToMain}
                        updateMail={this.handleUpdateEmail}
                        handleGetSendEmail={this.handleGetSendEmail}
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
                                onInput={() => {
                                    this.handleSearch();
                                }}
                            />
                        </div>
                        <div className="top-right-menu">
                            <Button svg={AppStorage.getAvatarUrl()} name="avatar" help="Аккаунт" onClick={this.handleAvatar} />
                        </div>
                    </div>
                    <div className="mail-box-container">
                        {isStateMode === 0 && (
                            <div className="container-form">
                                <MailHeader
                                    onSelectAll={this.handleSelectAll}
                                    isSelectAll={isSelectAll}
                                    reloadMail={this.handleUpdateEmail}
                                    loadEmail={this.loadEmails}
                                    total={total}
                                />
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
                                                id={email.id}
                                                theme={email.header}
                                                title={email.body}
                                                date={this.formatTime(email.created_at)}
                                                isSelected={selectedEmails.includes(email.id)}
                                                onSelect={(id: string, selected: boolean) => this.handleSelectEmail(id, selected)}
                                                isRead={email.is_read}
                                                pageMain={true}
                                                onClick={() => this.handleReadMail(email)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <ProfileModal isOpen={isModalOpen} onClose={this.handleCloseModal} onProfileClick={this.handleProfileClick} />
                </div>
            </div>
        );
    }
}

export default MainPage;
