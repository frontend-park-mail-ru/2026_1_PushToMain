import Death13 from "@react/stands";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import MailHeader from "../../widgets/MailHeader/MailHeader";
import MailBox from "../../widgets/MailBox/MailBox";
import { getProfile } from "../../api/ApiAuth";
import { readEmail, seacrhEmail, unReadEmail } from "../../api/ApiEmail";
import "./BaseEmailPage.scss";
import ProfileModal from "../../widgets/ProfileModal/ProfileModal";
import { AppStorage } from "../../App";
import { addEmailsInFolder, deleteEmailsFromFolder } from "../../api/ApiFolder";
import { deleteDraft } from "../../api/ApiDraft";
import { trash } from "../../api/ApiTrash";
import { sendFavorite, unFavorite } from "../../api/ApiFavorite";

interface BaseEmailprops {
    currentView: string;
    fetchEmails: (offset: number) => Promise<any>;
    deleteEmails?: (ids: number[]) => Promise<boolean>;
    onReadMail?: (email: any) => void;
    emptyMessage?: string;
    emptySubMessage?: string;
    showUnreadToggle?: boolean;
    showMarkAsRead?: boolean;
    showMoveToFolder?: boolean;
    currentFolderId?: number | null;
    currentFolderName?: string;
}

class BaseEmailPage extends Death13.Component {
    private isLoaded: boolean = false;
    private lastFolderId: number | null = null;
    private isProfileLoaded: boolean = false;

    state: any = {
        emails: [],
        isLoading: true,
        isModalOpen: false,
        isSelectAll: false,
        offset: 0,
        selectedEmails: [],
        total: 0,
    };

    constructor(props: BaseEmailprops) {
        super(props);

        if (!this.isProfileLoaded) {
            this.isProfileLoaded = true;
            this.loadProfile();
        }
        this.loadEmails(0);
    }

    loadProfile = async () => {
        try {
            const data = await getProfile();
            if (data === null) {
                window.app.handleRoute("/login");
            } else {
                AppStorage.setProfileData(data);
            }
        } catch (error) {
            console.error("Failed to load profile:", error);
        }
    };

    loadEmails = async (offset: number) => {
        try {
            const data = await this.props.fetchEmails(offset);
            const emails = data.emails || data.drafts || data || [];

            this.setState({
                emails: Array.isArray(emails) ? emails : [],
                isLoading: false,
                total: data.total || (Array.isArray(emails) ? emails.length : 0),
                offset: offset,
                selectedEmails: [],
                isSelectAll: false,
            });
        } catch (error) {
            console.error(`Failed to load ${this.props.currentView}:`, error);
        }
    };

    formatTime = (dateString: string) => {
        if (!dateString) return "";

        const date = new Date(dateString);
        const currentTime = new Date();

        if (isNaN(date.getTime())) return "";

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

    handleSettingsClick = () => {
        this.setState({ isModalOpen: false });
        AppStorage.setOpenSettingsOnProfile(true);
        window.app.handleRoute("/profile");
    };

    handleNewMail = () => {
        window.app.handleRoute("/send");
    };

    handleReadMail = async (email: any) => {
        if (this.props.currentView === "drafts") {
            window.app.handleRoute("/send");
            return;
        }

        await readEmail([email.id]);

        if (this.props.currentView === "folder") {
            AppStorage.setCurrentFolderId(this.props.currentFolderId);
            AppStorage.setCurrentView("folder");
        }

        window.app.handleRoute(`/read/${email.id}`);
    };

    handleDeleteSelected = async () => {
        const { selectedEmails } = this.state;

        if (selectedEmails.length === 0) return;

        try {
            let success = false;
            if (AppStorage.currentView === "drafts") {
                success = await deleteDraft(selectedEmails);
            } else if (AppStorage.currentView === "folder") {
                success = await deleteEmailsFromFolder(this.props.currentFolderId, selectedEmails);
            } else {
                success = await trash(selectedEmails);
            }

            if (success) {
                await this.loadEmails(this.state.offset);
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
        if (!this.props.showUnreadToggle) return;

        const { emails } = this.state;

        try {
            if (newReadState) {
                await readEmail([emailId]);
            } else {
                await unReadEmail([emailId]);
            }

            const updatedEmails = emails.map((email: any) => {
                if (email.id === emailId) {
                    return { ...email, is_read: newReadState };
                }
                return email;
            });

            this.setState({ emails: updatedEmails });
        } catch (error) {
            console.error("Error toggling read status:", error);
        }
    };

    handleToggleFavoriteSingle = async (emailId: number, newState: boolean) => {
        const { emails } = this.state;

        try {
            if (newState) {
                await sendFavorite([emailId]);
            } else {
                await unFavorite([emailId]);
            }

            const updatedEmails = emails.map((email: any) => {
                if (email.id === emailId) {
                    return { ...email, is_favorite: newState };
                }
                return email;
            });

            this.setState({ emails: updatedEmails });
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    handleMarkAsRead = async () => {
        if (!this.props.showMarkAsRead) return;

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

            this.setState({ emails: updatedEmails });
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

    hasUnreadSelected = () => {
        const { selectedEmails, emails } = this.state;
        return selectedEmails.some((selectedId: number) => {
            const email = emails.find((e: any) => e.id === selectedId);
            return email && !email.is_read;
        });
    };

    handleGoToMain = () => {
        if (this.props.currentView === "inbox") {
            return;
        }
        AppStorage.setCurrentView("inbox");
        AppStorage.clearMailActionData?.();
        AppStorage.setCurrentFolderId?.(null);
        window.app.handleRoute("/");
    };

    handleSearch = async (data: string) => {
        if (!data || data.trim() === "") return;
        try {
            await seacrhEmail(data);
        } catch (error) {
            console.error("Search failed:", error);
        }
    };

    t(key: string): string {
        return AppStorage.t ? AppStorage.t(key) : key;
    }

    toggleSidebar = () => {
        const sidebar = document.querySelector(".sidebar");
        const sidebarOverlay = document.querySelector(".sidebar-overlay");
        if (sidebar) {
            sidebar.classList.toggle("open");
        }
        if (sidebarOverlay) {
            sidebarOverlay.classList.toggle("open");
        }
    };

    handleMoveToFolder = async (folderId: number) => {
        const { selectedEmails } = this.state;
        if (selectedEmails.length === 0 || !folderId) return;

        try {
            await addEmailsInFolder(folderId, selectedEmails);
            await this.loadEmails(this.state.offset);
            this.setState({
                selectedEmails: [],
                isSelectAll: false,
            });
        } catch (error) {
            console.error("Error moving emails to folder:", error);
        }
    };

    render() {
        const { emails, isModalOpen, isSelectAll, total, selectedEmails } = this.state;
        const { emptyMessage = "", emptySubMessage = "", showUnreadToggle = false, currentFolderName = "" } = this.props || {};
        const currentView = AppStorage.currentView || "inbox";

        if (!this.props) {
            return <div>Loading...</div>;
        }

        const currentFolderId = this.props.currentFolderId;

        if (this.props.currentView === "folder" && currentFolderId !== this.lastFolderId) {
            this.lastFolderId = currentFolderId;
            this.loadEmails(0);
        }

        const mobileHeaderTitle = currentView === "folder" ? currentFolderName : this.t(currentView);

        return (
            <div className="main-page" onClick={() => this.handleCloseModal()}>
                <div className="sidebar-overlay" onClick={this.toggleSidebar}></div>
                <aside className="sidebar">
                    <Sidebar
                        isProfile={0}
                        isPress={0}
                        newMail={this.handleNewMail}
                        backToMail={this.handleGoToMain}
                        updateMail={() => this.loadEmails(this.state.offset)}
                        handleGetDrafts={() => window.app.handleRoute("/drafts")}
                        handleGetSendEmail={() => window.app.handleRoute("/sent")}
                        handleGetSpam={() => window.app.handleRoute("/spam")}
                        handleGetTrash={() => window.app.handleRoute("/trash")}
                        handleGetFavorite={() => window.app.handleRoute("/favorite")}
                        loadEmailFromFolder={(offset: number, folderId: number) => {
                            AppStorage.setCurrentFolderId(folderId);
                            window.app.handleRoute(`/folder/${folderId}`);
                        }}
                        selectedFolderId={this.props.currentFolderId || null}
                        currentView={currentView}
                    />
                </aside>
                <div className="right-part">
                    <div className="top-bar">
                        <div
                            className="hamburger-btn"
                            onClick={(e: any) => {
                                e.stopPropagation();
                                this.toggleSidebar();
                            }}>
                            <div className="hamburger-icon" />
                        </div>
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
                    <div className="mail-box-container__mobile-header">
                        <span>{mobileHeaderTitle}</span>
                    </div>
                    <div className="mail-box-container">
                        <div className="container-form">
                            <MailHeader
                                onSelectAll={this.handleSelectAll}
                                isSelectAll={isSelectAll}
                                reloadMail={() => this.loadEmails(this.state.offset)}
                                loadEmail={this.loadEmails.bind(this)}
                                total={total}
                                offset={this.state.offset}
                                selectedCount={selectedEmails.length}
                                selectedEmails={selectedEmails}
                                hasUnreadSelected={this.hasUnreadSelected()}
                                onMarkAsRead={this.handleMarkAsRead}
                                onMoveToFolder={this.handleMoveToFolder}
                                onDelete={this.handleDeleteSelected}
                                mainPage={currentView === "inbox"}
                                currentView={currentView}
                                emails={emails}
                            />
                            {emails.length === 0 && (
                                <div className="mail-box-container-form__placeholder">
                                    <div className="mail-box-container-form__placeholder__icon"></div>
                                    <span>{emptyMessage || "Нет писем"}</span>
                                    {emptySubMessage && <span>{emptySubMessage}</span>}
                                </div>
                            )}
                            {emails.length !== 0 && (
                                <div className="mail-box-container-form">
                                    {emails.map((email: any) => (
                                        <MailBox
                                            key={email.id}
                                            id={email.id}
                                            sender_name={email.sender_name || email.receivers_emails?.[0]}
                                            sender_surname={email.sender_surname}
                                            sender_email={email.sender_email || email.receivers_emails?.[0]}
                                            theme={email.header}
                                            title={email.body}
                                            date={this.formatTime(email.created_at)}
                                            isSelected={selectedEmails.includes(email.id)}
                                            onSelect={this.handleSelectEmail}
                                            isRead={email.is_read !== undefined ? email.is_read : true}
                                            isFavorite={email.is_favorite !== undefined ? email.is_favorite : false}
                                            pageMain={currentView === "inbox"}
                                            currentView={currentView}
                                            onClick={() => this.handleReadMail(email)}
                                            onToggleRead={showUnreadToggle ? this.handleToggleReadSingle : undefined}
                                            onToggleFavorite={this.handleToggleFavoriteSingle}
                                            selectedFolderId={this.props.currentFolderId}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <ProfileModal
                        isOpen={isModalOpen}
                        onClose={this.handleCloseModal}
                        onProfileClick={this.handleProfileClick}
                        onSettingsClick={this.handleSettingsClick}
                    />
                </div>
                <Button
                    className="button-new-letter-mobile"
                    name="button-new-letter-mobile"
                    svg="../../assets/svg/Compose.svg"
                    onClick={(event: any) => {
                        event.preventDefault();
                        this.handleNewMail();
                    }}
                />
            </div>
        );
    }
}

export default BaseEmailPage;
