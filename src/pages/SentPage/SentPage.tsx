import Death13 from "@react/stands";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import MailHeader from "../../widgets/MailHeader/MailHeader";
import MailBox from "../../widgets/MailBox/MailBox";
import { getEmailSend, getEmailByID } from "../../api/ApiEmail";
import "./SentPage.scss";
import ProfileModal from "../../widgets/ProfileModal/ProfileModal";
import { AppStorage } from "../../App";
import { getProfile } from "../../api/ApiAuth";

class SentPage extends Death13.Component {
    state: any = {
        emails: [],
        isLoading: true,
        isModalOpen: false,
        isStateMode: 0,
        email: {
            header: "",
            body: "",
            createdAt: "",
            senderEmail: "",
            senderImage: "",
            senderName: "",
            senderSurname: "",
        },
        isSelectAll: false,
        offset: 0,
        total: 0,
    };

    constructor(props: any) {
        super(props);
        this.loadEmails(this.state.offset);
        this.loadProfile();
    }

    loadProfile = async () => {
        const data = await getProfile();
        if (data === null) {
            window.app.handleRoute("/login");
        } else {
            AppStorage.setProfileData(data);
        }
    };

    loadEmails = async (offset: number) => {
        try {
            const data = await getEmailSend(offset);
            const emails = data.emails;

            if (data === undefined) {
                window.app.handleRoute("/login");
                return;
            }
            this.setState({
                emails: emails,
                isLoading: false,
                total: data.total,
                offset: offset,
            });
        } catch (error) {
            console.error("Failed to load sent emails:", error);
            window.app.handleRoute("/login");
        }
    };

    handleUpdateEmail = () => {
        this.loadEmails(this.state.offset);
    };

    formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const currentTime = new Date();

        if (Math.abs(currentTime.getFullYear() - date.getFullYear()) >= 1) {
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

    async handleReadMail(id: number) {
        const email = await getEmailByID(id);
        window.app.handleRoute(`/read/${email.id}`);
    }

    handleSelectAll = (isChecked: boolean) => {
        this.setState({ isSelectAll: isChecked });
    };

    handleBackToMail = () => {
        window.app.handleRoute("/");
    };

    handleBackToSent = () => {
        this.setState({ isStateMode: 0 });
        this.loadEmails(this.state.offset);
    };

    handleSearch = () => {};

    render() {
        const { emails, isModalOpen, isStateMode, isSelectAll, total } = this.state;

        return (
            <div className="main-page" onClick={() => this.handleCloseModal()}>
                <aside className="sidebar">
                    <Sidebar
                        isProfile={0}
                        isPress={1}
                        newMail={this.handleNewMail}
                        backToMail={this.handleBackToMail}
                        updateMail={this.handleUpdateEmail}
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
                                        <span>Нет отправленных писем</span>
                                        <span>Напишите ваше первое письмо, нажав на кнопку слева</span>
                                    </div>
                                )}
                                {emails.length !== 0 && (
                                    <div className="mail-box-container-form">
                                        {emails.map((email: any, index: number) => (
                                            <MailBox
                                                key={email.id || index}
                                                id={email.id}
                                                theme={email.header}
                                                emails={email.receivers_emails}
                                                title={email.body}
                                                date={this.formatTime(email.created_at)}
                                                isRead={true}
                                                onClick={() => this.handleReadMail(email.id)}
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

export default SentPage;
