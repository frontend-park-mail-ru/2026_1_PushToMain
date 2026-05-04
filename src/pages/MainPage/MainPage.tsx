import Death13 from "@react/stands";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import MailHeader from "../../widgets/MailHeader/MailHeader";
import MailBox from "../../widgets/MailBox/MailBox";
import { getProfile } from "../../api/ApiAuth";
import {
    getEmailAll,
    getEmailSend,
    readEmail,
    seacrhEmail,
    unReadEmail,
    deleteEmailByID,
    deleteMyEmailByID,
    getEmailsFavorite,
    getEmailsSpam,
    getEmailsTrash,
} from "../../api/ApiEmail";
import "./MainPage.scss";
import ProfileModal from "../../widgets/ProfileModal/ProfileModal";
import { AppStorage } from "../../App";
import { getEmailsFromFolder, addEmailsInFolder, deleteEmailsFromFolder } from "../../api/ApiFolder";
import { getDrafts, getDraftByID, deleteDraft } from "../../api/ApiDraft";

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
        isSettings: false,
        selectedFolderId: null,
        currentView: "inbox",
    };

    constructor(props: any) {
        super(props);

        const savedView = AppStorage.getCurrentView();
        const savedFolderId = AppStorage.getCurrentFolderId?.() || null;

        if (savedView && savedView !== "inbox") {
            this.state = {
                ...this.state,
                currentView: savedView,
                selectedFolderId: savedView === "folder" ? savedFolderId : null,
            };

            setTimeout(() => {
                if (savedView === "spam") {
                    this.handleGetSpam();
                } else if (savedView === "trash") {
                    this.handleGetTrash();
                } else if (savedView === "favorite") {
                    this.handleGetFavorite();
                } else if (savedView === "drafts") {
                    this.handleGetDrafts();
                } else if (savedView === "folder" && savedFolderId) {
                    this.loadEmailFromFolder(0, savedFolderId);
                } else if (savedView === "sent") {
                    this.handleGetSendEmail();
                }
            }, 0);
        } else {
            this.loadEmails(this.state.offset);
        }

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

    handleGetSpam = async () => {
        try {
            const data = await getEmailsSpam(0);
            const emails = data.emails || data || [];

            this.setState({
                emails: Array.isArray(emails) ? emails : [],
                isLoading: false,
                total: data.total || (Array.isArray(emails) ? emails.length : 0),
                offset: 0,
                currentView: "spam",
                selectedFolderId: null,
                selectedEmails: [],
                isSelectAll: false,
            });
        } catch (error) {
            console.error("Failed to load spam:", error);
        }
    };

    handleGetTrash = async () => {
        try {
            const data = await getEmailsTrash(0);
            const emails = data.emails || data || [];

            this.setState({
                emails: Array.isArray(emails) ? emails : [],
                isLoading: false,
                total: data.total || (Array.isArray(emails) ? emails.length : 0),
                offset: 0,
                currentView: "trash",
                selectedFolderId: null,
                selectedEmails: [],
                isSelectAll: false,
            });
        } catch (error) {
            console.error("Failed to load trash:", error);
        }
    };

    handleGetFavorite = async () => {
        try {
            const data = await getEmailsFavorite(0);
            const emails = data.emails || data || [];

            this.setState({
                emails: Array.isArray(emails) ? emails : [],
                isLoading: false,
                total: data.total || (Array.isArray(emails) ? emails.length : 0),
                offset: 0,
                currentView: "favorite",
                selectedFolderId: null,
                selectedEmails: [],
                isSelectAll: false,
            });
        } catch (error) {
            console.error("Failed to load favorites:", error);
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

    handleSettingsClick = () => {
        this.setState({ isModalOpen: false });
        AppStorage.setOpenSettingsOnProfile(true);
        window.app.handleRoute("/profile");
    };

    handleNewMail = () => {
        window.app.handleRoute("/send");
    };

    async handleReadMail(email: any) {
        // Если это черновик - открываем редактирование
        if (this.state.currentView === "drafts") {
            const response = await getDraftByID(email.id);
            if (response) {
                const draft = await response.json();

                // Сохраняем данные черновика для редактирования
                AppStorage.setDraftData({
                    id: draft.id,
                    header: draft.header,
                    body: draft.body,
                    receivers: draft.receivers || [],
                });

                window.app.handleRoute("/send");
            }
            return;
        }

        this.setState({ isStateMode: 3, selectedEmail: email });
        await readEmail([email.id]);
        AppStorage.setCurrentFolderId(this.state.selectedFolderId);
        window.app.handleRoute(`/read/${email.id}`);
    }

    handleDeleteSelected = async () => {
        const { selectedEmails, currentView, selectedFolderId } = this.state;

        if (selectedEmails.length === 0) return;

        try {
            let success = false;

            if (currentView === "drafts") {
                success = await deleteDraft(selectedEmails);
            } else if (currentView === "sent") {
                success = await deleteMyEmailByID(selectedEmails);
            } else if (currentView === "folder" && selectedFolderId) {
                success = await deleteEmailsFromFolder(selectedFolderId, selectedEmails);
            } else {
                success = await deleteEmailByID(selectedEmails);
            }

            if (success) {
                if (currentView === "drafts") {
                    await this.handleGetDrafts();
                } else if (currentView === "sent") {
                    await this.handleGetSendEmail();
                } else if (currentView === "folder" && this.state.selectedFolderId) {
                    await this.loadEmailFromFolder(this.state.offset, this.state.selectedFolderId);
                } else {
                    await this.loadEmails(this.state.offset);
                }

                this.setState({
                    selectedEmails: [],
                    isSelectAll: false,
                });
            }
        } catch (error) {
            console.error("Error deleting emails:", error);
        }
    };

    handleToggleReadSingle = async (emailId: number, newReadState: boolean) => {
        const { emails } = this.state;

        try {
            if (newReadState) {
                await readEmail([emailId]);
                AppStorage.setUnReadCount(Math.max(0, AppStorage.unReadCount - 1));
            } else {
                await unReadEmail(emailId);
                AppStorage.setUnReadCount(AppStorage.unReadCount + 1);
            }

            const updatedEmails = emails.map((email: any) => {
                if (email.id === emailId) {
                    return { ...email, is_read: newReadState };
                }
                return email;
            });

            this.setState({
                emails: updatedEmails,
            });
        } catch (error) {
            console.error("Error toggling read status:", error);
        }
    };

    handleMarkAsRead = async () => {
        const { selectedEmails } = this.state;
        const unreadIds = selectedEmails.filter((selectedId: number) => {
            const email = this.state.emails.find((e: any) => e.id === selectedId);
            return email && !email.is_read;
        });

        if (unreadIds.length > 0) {
            await readEmail(unreadIds);
            const updatedEmails = this.state.emails.map((email: any) => {
                if (unreadIds.includes(email.id)) {
                    return { ...email, is_read: true };
                }
                return email;
            });

            this.setState({
                emails: updatedEmails,
            });

            this.setState((prevState: any) => ({
                emails: prevState.emails.map((email: any) => {
                    if (unreadIds.includes(email.id)) {
                        return { ...email, is_read: true };
                    }
                    return email;
                }),
            }));
            AppStorage.setUnReadCount(AppStorage.unReadCount - unreadIds.length);
        }
    };

    handleSelectEmail = (emailId: number, isSelected: boolean) => {
        const { selectedEmails, emails } = this.state;
        let newSelectedEmails;

        if (isSelected) {
            newSelectedEmails = [...selectedEmails, emailId];
        } else {
            newSelectedEmails = selectedEmails.filter((id: number) => id !== emailId);
        }

        const allSelected = emails.length > 0 && newSelectedEmails.length === emails.length;

        this.setState({
            selectedEmails: newSelectedEmails,
            isSelectAll: allSelected,
        });
    };

    handleSelectAll = (isChecked: boolean) => {
        const { emails } = this.state;

        if (isChecked) {
            const allEmailIds = emails.map((email: any) => email.id);
            this.setState({
                isSelectAll: true,
                selectedEmails: allEmailIds,
            });
        } else {
            this.setState({
                isSelectAll: false,
                selectedEmails: [],
            });
        }
    };

    handleMoveToFolder = async (folderId: number) => {
        const { selectedEmails } = this.state;

        if (selectedEmails.length === 0) return;

        await addEmailsInFolder(folderId, selectedEmails);

        await this.loadEmails(this.state.offset);

        this.setState({
            selectedEmails: [],
            isSelectAll: false,
        });
    };

    hasUnreadSelected = () => {
        const { selectedEmails, emails } = this.state;
        return selectedEmails.some((selectedId: number) => {
            const email = emails.find((e: any) => e.id === selectedId);
            return email && !email.is_read;
        });
    };

    handleGetSendEmail = async () => {
        try {
            const data = await getEmailSend(0);
            const emails = data.emails;

            this.setState({
                emails: emails,
                isLoading: false,
                total: data.total,
                offset: 0,
                currentView: "sent",
                selectedFolderId: null,
                selectedEmails: [],
                isSelectAll: false,
            });
            window.app.handleRoute("/sent");
        } catch (error) {
            console.error("Failed to load sent emails:", error);
        }
    };

    handleGetDrafts = async () => {
        try {
            const data = await getDrafts(0);
            const emails = data.drafts;

            this.setState({
                emails: emails,
                isLoading: false,
                total: data.total || emails.length,
                offset: 0,
                currentView: "drafts",
                selectedFolderId: null,
                selectedEmails: [],
                isSelectAll: false,
            });
        } catch (error) {
            console.error("Failed to load drafts:", error);
        }
    };

    handleGoToMain = () => {
        this.setState({
            isStateMode: 0,
            selectedFolderId: null,
            currentView: "inbox",
            selectedEmails: [],
            isSelectAll: false,
        });
        this.loadEmails(0);
    };

    handleSearch = async (data: string) => {
        await seacrhEmail(data);
    };

    loadEmailFromFolder = async (offset: number, folderID: number) => {
        const data = await getEmailsFromFolder(offset, folderID);
        const emails = data.emails;
        this.setState({
            emails: emails,
            isLoading: false,
            total: data.total,
            offset: offset,
            selectedFolderId: folderID,
            currentView: "folder",
            selectedEmails: [],
            isSelectAll: false,
        });
    };

    t(key: string): string {
        return AppStorage.t(key);
    }

    render() {
        const { emails, isModalOpen, isStateMode, isSelectAll, total, selectedEmails, currentView } = this.state;
        return (
            <div className="main-page" onClick={() => this.handleCloseModal()}>
                <aside className="sidebar">
                    <Sidebar
                        isProfile={0}
                        isPress={0}
                        newMail={this.handleNewMail}
                        backToMail={this.handleGoToMain}
                        updateMail={this.handleUpdateEmail}
                        handleGetDrafts={this.handleGetDrafts}
                        handleGetSendEmail={this.handleGetSendEmail}
                        handleGetSpam={this.handleGetSpam}
                        handleGetTrash={this.handleGetTrash}
                        handleGetFavorite={this.handleGetFavorite}
                        loadEmailFromFolder={this.loadEmailFromFolder}
                        selectedFolderId={this.state.selectedFolderId}
                        currentView={currentView}
                    />
                </aside>
                <div className="right-part">
                    <div className="top-bar">
                        <div className="search-bar">
                            <Input
                                type="text"
                                placeholder={this.t("search")}
                                name="search"
                                svg="../../assets/svg/Search.svg"
                                onInput={(e: any) => {
                                    this.handleSearch(e.target.value);
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
                                    offset={this.state.offset}
                                    selectedCount={selectedEmails.length}
                                    selectedEmails={selectedEmails}
                                    hasUnreadSelected={this.hasUnreadSelected()}
                                    onMarkAsRead={this.handleMarkAsRead}
                                    onMoveToFolder={this.handleMoveToFolder}
                                    onDelete={this.handleDeleteSelected}
                                    mainPage={true}
                                    currentView={currentView}
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
                                        {emails.map((email: any) => (
                                            <MailBox
                                                key={email.id}
                                                id={email.id}
                                                theme={email.header}
                                                title={email.body}
                                                date={this.formatTime(email.created_at)}
                                                isSelected={selectedEmails.includes(email.id)}
                                                onSelect={this.handleSelectEmail}
                                                isRead={email.is_read}
                                                pageMain={currentView === "inbox"}
                                                onClick={() => this.handleReadMail(email)}
                                                onToggleRead={this.handleToggleReadSingle}
                                                selectedFolderId={this.state.selectedFolderId}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <ProfileModal
                        isOpen={isModalOpen}
                        onClose={this.handleCloseModal}
                        onProfileClick={this.handleProfileClick}
                        onSettingsClick={this.handleSettingsClick}
                    />
                </div>
            </div>
        );
    }
}

export default MainPage;
