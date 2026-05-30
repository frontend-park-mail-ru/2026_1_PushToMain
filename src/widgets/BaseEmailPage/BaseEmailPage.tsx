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
import SupportModal from "../../widgets/SupportModal/SupportModal";
import { AppStorage } from "../../App";
import { addEmailsInFolder, deleteEmailsFromFolder } from "../../api/ApiFolder";
import { deleteDraft } from "../../api/ApiDraft";
import { trash } from "../../api/ApiTrash";
import { sendFavorite, unFavorite } from "../../api/ApiFavorite";
import { formatTime } from "../../utils/date";

interface BaseEmailprops {
  currentView: string;
  fetchEmails: (_offset: number) => Promise<any>;
  deleteEmails?: (_ids: number[]) => Promise<boolean>;
  onReadMail?: (_email: any) => void;
  emptyMessage?: string;
  emptySubMessage?: string;
  showUnreadToggle?: boolean;
  showMarkAsRead?: boolean;
  showMoveToFolder?: boolean;
  currentFolderId?: number | null;
  currentFolderName?: string;
}

class BaseEmailPage extends Death13.Component {
  private lastFolderId: number | null = null;
  private loadEmailInterval: number | null = null;
  private initialLoadDone: boolean = false;

  state: any = {
    emails: [],
    fetchEmails: null,
    isLoading: true,
    isModalOpen: false,
    isSelectAll: false,
    offset: 0,
    selectedEmails: new Set<number>(),
    total: 0,
  };

  constructor(props: BaseEmailprops) {
    super(props);
    this.initialLoadDone = false;
    this.state.fetchEmails = props.fetchEmails;

    AppStorage.currentView = props.currentView;
  }

  componentDidMount() {
    if (!AppStorage.isProfileLoaded) {
      this.loadProfile();
    }
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    this.loadEmails(0);
  }

  componentDidUpdate() {
    const currentFolderId = this.props.currentFolderId;

    if (
      this.props.currentView === "folder" &&
      currentFolderId !== this.lastFolderId
    ) {
      this.lastFolderId = currentFolderId;
      this.loadEmails(0);
    }
  }

  componentWillUnmount() {
    if (this.handleVisibilityChange) {
      document.removeEventListener(
        "visibilitychange",
        this.handleVisibilityChange,
      );
    }
  }

  private handleVisibilityChange = () => {
    if (!document.hidden && this.initialLoadDone) {
      this.loadEmails(this.state.offset);
    }
  };

  private getSelectedArray(): number[] {
    return Array.from(this.state.selectedEmails);
  }

  loadProfile = async () => {
    try {
      const data = await getProfile();
      if (data === null) {
        window.app.handleRoute("/login");
      } else {
        AppStorage.setProfileData(data);
        AppStorage.isProfileLoaded = true;
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
      window.app.handleRoute("/login");
    }
  };

  loadEmails = async (offset: number) => {
    if (!AppStorage.email || AppStorage.email === "") {
      return;
    }

    this.setState({ isLoading: true });

    if (!this.state.fetchEmails) {
      console.warn("fetchEmails prop is missing in BaseEmailPage");
      return;
    }

    try {
      const data = await this.state.fetchEmails(offset);
      const emails = data.emails || data.drafts || data || [];
      const list = Array.isArray(emails) ? emails : [];

      AppStorage.cacheEmails(list);

      this.setState({
        emails: Array.isArray(emails) ? emails : [],
        isLoading: false,
        total: data.total || (Array.isArray(emails) ? emails.length : 0),
        offset: offset,
        selectedEmails: new Set<number>(),
        isSelectAll: false,
      });
    } catch (error) {
      console.error(`Failed to load ${this.props.currentView}:`, error);
    }

    this.initialLoadDone = true;
    this.setState({ isLoading: false });
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
    window.app.handleRoute("/profile/personal");
  };

  handleSettingsClick = () => {
    this.setState({ isModalOpen: false });
    AppStorage.setOpenSettingsOnProfile(true);
    window.app.handleRoute("/profile/interface");
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

  handleTrashSingle = async (emailId: number) => {
    let success = false;
    if (AppStorage.currentView === "drafts") {
      success = await deleteDraft([emailId]);
    } else if (AppStorage.currentView === "folder") {
      success = await deleteEmailsFromFolder(this.props.currentFolderId, [
        emailId,
      ]);
    } else {
      success = await trash([emailId]);
    }

    if (success) {
      await this.loadEmails(this.state.offset);
    }
  };

  handleDeleteSelected = async () => {
    const { selectedEmails } = this.state;

    if (selectedEmails.size === 0) return;

    try {
      let success = false;
      if (AppStorage.currentView === "drafts") {
        success = await deleteDraft(this.getSelectedArray());
      } else if (AppStorage.currentView === "folder") {
        success = await deleteEmailsFromFolder(
          this.props.currentFolderId,
          this.getSelectedArray(),
        );
      } else {
        success = await trash(this.getSelectedArray());
      }

      if (success) {
        await this.loadEmails(this.state.offset);
        this.setState({
          selectedEmails: new Set<number>(),
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

    const unreadIds = this.getSelectedArray().filter((selectedId: number) => {
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

  handleSelectEmail = (emailId: number) => {
    const currentSet = this.state.selectedEmails;
    const newSet = new Set<number>(currentSet);

    if (newSet.has(emailId)) {
      newSet.delete(emailId);
    } else {
      newSet.add(emailId);
    }

    const allSelected =
      this.state.emails.length > 0 && newSet.size === this.state.emails.length;

    this.setState({
      selectedEmails: newSet,
      isSelectAll: allSelected,
    });
  };

  handleSelectAll = (isChecked?: boolean) => {
    if (isChecked) {
      const allIds = new Set<number>(this.state.emails.map((e: any) => e.id));
      this.setState({
        isSelectAll: true,
        selectedEmails: allIds,
      });
    } else {
      this.setState({
        isSelectAll: false,
        selectedEmails: new Set<number>(),
      });
    }
  };

  hasUnreadSelected = () => {
    const { emails } = this.state;
    return this.getSelectedArray().some((selectedId: number) => {
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
    if (selectedEmails.size === 0 || !folderId) return;

    try {
      await addEmailsInFolder(folderId, this.getSelectedArray());
      await this.loadEmails(this.state.offset);
      this.setState({
        selectedEmails: new Set<number>(),
        isSelectAll: false,
      });
    } catch (error) {
      console.error("Error moving emails to folder:", error);
    }
  };

  handleSupport = () => {
    const supportModal = document.querySelector(".support-modal");
    if (supportModal) {
      supportModal.classList.toggle("show");
    }
  };

  render() {
    const { emails, isModalOpen, total } = this.state;
    const {
      emptyMessage = "",
      emptySubMessage = "",
      showUnreadToggle = false,
      currentFolderName = "",
    } = this.props || {};
    const currentView = AppStorage.currentView || "inbox";

    const selectedArray = this.getSelectedArray();

    const isSelectAll = this.state.isSelectAll;

    if (!this.props) {
      return <div>Loading...</div>;
    }

    const mobileHeaderTitle =
      currentView === "folder" ? currentFolderName : this.t(currentView);

    return (
      <div className="main-page" onClick={() => this.handleCloseModal()}>
        <SupportModal />
        <div className="sidebar-overlay" onClick={this.toggleSidebar}></div>
        <aside className="sidebar">
          <Sidebar
            isProfile={0}
            isPress={0}
            name={AppStorage.name}
            surname={AppStorage.surname}
            avatarUrl={AppStorage.getAvatarUrl()}
            email={AppStorage.email}
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
              }}
            >
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
              <div
                className="support"
                help="Поддержка"
                onClick={this.handleSupport}
              />
              <Button
                svg={AppStorage.getAvatarUrl()}
                name="avatar"
                help="Аккаунт"
                onClick={this.handleAvatar}
              />
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
                selectedCount={selectedArray.length}
                selectedEmails={selectedArray}
                hasUnreadSelected={this.hasUnreadSelected()}
                onMarkAsRead={this.handleMarkAsRead}
                onMoveToFolder={this.handleMoveToFolder}
                onDelete={this.handleDeleteSelected}
                mainPage={currentView === "inbox"}
                currentView={currentView}
                emails={emails}
                isLoading={this.state.isLoading}
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
                  {emails.map((email: any) => {
                    return (
                      <MailBox
                        key={`${email.id}-${email.is_starred}`}
                        id={email.id}
                        sender_name={
                          email.sender_name || email.receivers_emails?.[0]
                        }
                        sender_surname={email.sender_surname}
                        sender_email={
                          email.sender_email || email.receivers_emails?.[0]
                        }
                        receivers_emails={
                          currentView === "drafts"
                            ? email.receivers
                            : email.receivers_emails
                        }
                        theme={email.header}
                        title={email.body}
                        date={formatTime(email.created_at)}
                        isSelected={selectedArray.includes(email.id)}
                        onSelect={this.handleSelectEmail}
                        isRead={
                          email.is_read !== undefined ? email.is_read : true
                        }
                        isFavorite={
                          email.is_starred !== undefined
                            ? email.is_starred
                            : false
                        }
                        isAnonymous={email.is_anonymous}
                        pageMain={currentView === "inbox"}
                        currentView={currentView}
                        onClick={() => this.handleReadMail(email)}
                        onToggleRead={
                          showUnreadToggle
                            ? this.handleToggleReadSingle
                            : undefined
                        }
                        onToggleFavorite={this.handleToggleFavoriteSingle}
                        onTrash={this.handleTrashSingle}
                        selectedFolderId={this.props.currentFolderId}
                      />
                    );
                  })}
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
