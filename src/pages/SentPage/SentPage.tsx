import Death13 from "@react/stands";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import MailHeader from "../../widgets/MailHeader/MailHeader";
import MailBox from "../../widgets/MailBox/MailBox";
import {
  getEmailSend,
  getEmailByID,
  deleteMyEmailByID,
} from "../../api/ApiEmail";
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
    currentView: "sent",
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
    selectedEmails: [],
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

  handleGetDrafts = () => {
    AppStorage.setCurrentView("drafts");
    window.app.handleRoute("/");
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

  handleDeleteSelected = async () => {
    const { selectedEmails } = this.state;
    if (selectedEmails.length === 0) return;

    try {
      const success = await deleteMyEmailByID(selectedEmails);
      if (success) {
        await this.loadEmails(this.state.offset);
        this.setState({
          selectedEmails: [],
          isSelectAll: false,
        });
      }
    } catch (error) {
      console.error("Error deleting sent emails:", error);
    }
  };

  loadEmailFromFolder = async (offset: number, folderID: number) => {
    AppStorage.setCurrentFolderId(folderID);
    AppStorage.setCurrentView("folder");
    window.app.handleRoute("/");
  };

  handleSelectEmail = (emailId: number, isSelected: boolean) => {
    const { selectedEmails, emails } = this.state;
    let newSelectedEmails;

    if (isSelected) {
      newSelectedEmails = [...selectedEmails, emailId];
    } else {
      newSelectedEmails = selectedEmails.filter((id: number) => id !== emailId);
    }

    const allSelected =
      emails.length > 0 && newSelectedEmails.length === emails.length;

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

  handleBackToSent = () => {
    this.setState({ isStateMode: 0 });
    this.loadEmails(this.state.offset);
  };

  handleSearch = () => {};

  handleGoToMain = () => {
    AppStorage.setCurrentView("inbox");
    AppStorage.clearMailActionData();
    AppStorage.setCurrentFolderId(null);
    window.app.handleRoute("/");
  };

  handleGetSendEmail = () => {
    this.loadEmails(0);
  };

  handleGetSpam = () => {
    AppStorage.setCurrentView("spam");
    window.app.handleRoute("/");
  };

  handleGetTrash = () => {
    AppStorage.setCurrentView("trash");
    window.app.handleRoute("/");
  };

  handleGetFavorite = () => {
    AppStorage.setCurrentView("favorite");
    window.app.handleRoute("/");
  };

  t(key: string): string {
    return AppStorage.t(key);
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

  render() {
    const {
      emails,
      isModalOpen,
      isStateMode,
      isSelectAll,
      total,
      selectedEmails,
      currentView,
    } = this.state;

    return (
      <div className="main-page" onClick={() => this.handleCloseModal()}>
        <aside className="sidebar">
          <Sidebar
            isProfile={0}
            isPress={0}
            newMail={this.handleNewMail}
            backToMail={this.handleGoToMain}
            updateMail={this.handleGoToMain}
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
            <div
              className="hamburger-btn"
              onClick={(e: any) => {
                e.stopPropagation();
                this.toggleSidebar();
              }}
            >
              <img src="../../assets/svg/Hamburger.svg" alt="Menu" />
            </div>
            <div className="search-bar">
              <Input
                type="text"
                placeholder={this.t("search")}
                name="search"
                svg="../../assets/svg/Search.svg"
                onInput={() => {
                  this.handleSearch();
                }}
              />
            </div>

            <div className="top-right-menu">
              <Button
                svg={AppStorage.getAvatarUrl()}
                name="avatar"
                help="Аккаунт"
                onClick={this.handleAvatar}
              />
            </div>
          </div>
          <div className="mail-box-container__mobile-header">
            <span>{this.t("sent")}</span>
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
                  onDelete={this.handleDeleteSelected}
                />
                {emails.length === 0 && (
                  <div className="mail-box-container-form__placeholder">
                    <div className="mail-box-container-form__placeholder__icon"></div>
                    <span>Нет отправленных писем</span>
                    <span>
                      Напишите ваше первое письмо, нажав на кнопку слева
                    </span>
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
                        isSelected={selectedEmails.includes(email.id)}
                        onSelect={this.handleSelectEmail}
                        isRead={true}
                        pageMain={false}
                        onClick={() => this.handleReadMail(email.id)}
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
          />
        </div>
      </div>
    );
  }
}

export default SentPage;
