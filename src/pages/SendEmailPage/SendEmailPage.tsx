import Death13 from "@react/stands";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import SendMail from "../../widgets/SendMail/SendMail";
import "./SendEmailPage.scss";
import ProfileModal from "../../widgets/ProfileModal/ProfileModal";
import NotificationManager from "../../widgets/NotificationManager/NotificationManager";
import Input from "../../components/Input/Input";
import { AppStorage } from "../../App";
import { getProfile } from "../../api/ApiAuth";

class SendEmailPage extends Death13.Component {
  constructor(props: any) {
    super(props);

    this.loadMailActionData();
    if (!AppStorage.isProfileLoaded) {
      AppStorage.isProfileLoaded = true;
      this.loadProfile();
    }
  }

  state: any = {
    isModalOpen: false,
    unReadCount: 0,
    replyData: null,
    currentView: "send",
    forwardData: null,
    avatarKey: 0,
  };

  loadProfile = async () => {
    const data = await getProfile();
    if (data === null) {
      window.app.handleRoute("/login");
      NotificationManager.show(false, "auth_error");
    } else {
      AppStorage.setProfileData(data);
    }
  };

  loadMailActionData = () => {
    const replyData = AppStorage.getReplyData();
    const forwardData = AppStorage.getForwardData();

    this.setState({
      replyData,
      forwardData,
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
    AppStorage.clearMailActionData();
    this.setState({ replyData: null, forwardData: null });
  };

  handleBackToMail = () => {
    AppStorage.clearMailActionData();
    AppStorage.setCurrentFolderId(null);
    AppStorage.setCurrentView("inbox");
    window.app.handleRoute("/");
  };

  handleBackToSent = () => {
    AppStorage.clearMailActionData();
    AppStorage.setCurrentFolderId(null);
    AppStorage.setCurrentView("sent");
    window.app.handleRoute("/sent");
  };

  handleGetSendEmail = () => {
    AppStorage.setCurrentView("sent");
    window.app.handleRoute("/sent");
  };

  handleGetDrafts = () => {
    AppStorage.setCurrentView("drafts");
    window.app.handleRoute("/");
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

  handleGoToMain = () => {
    AppStorage.setCurrentView("inbox");
    AppStorage.clearMailActionData();
    AppStorage.setCurrentFolderId(null);
    window.app.handleRoute("/");
  };

  loadEmailFromFolder = async (offset: number, folderID: number) => {
    AppStorage.setCurrentFolderId(folderID);
    AppStorage.setCurrentView("folder");
    window.app.handleRoute("/");
  };

  t(key: string): string {
    return AppStorage.t(key);
  }

  render() {
    const { isModalOpen, replyData, forwardData, currentView } = this.state;

    const mailActionData = replyData || forwardData;

    return (
      <div className="send-email-page" onClick={() => this.handleCloseModal()}>
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
            <div className="search-bar">
              <Input
                type="text"
                placeholder={this.t("search")}
                name="search"
                svg="../../assets/svg/Search.svg"
                onInput={() => {}}
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
          <div className="mail-box-container">
            <SendMail
              backToMail={this.handleBackToMail}
              actionData={mailActionData}
            />
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

export default SendEmailPage;
