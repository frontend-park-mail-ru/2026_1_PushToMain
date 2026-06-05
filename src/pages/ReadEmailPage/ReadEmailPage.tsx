import Death13 from "@react/stands";
import "./ReadEmailPage.scss";
import { AppStorage } from "../../App";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import ProfileModal from "../../widgets/ProfileModal/ProfileModal";
import ReadMail from "../../widgets/ReadMail/ReadMail";
import { getEmailByID } from "../../api/ApiEmail";

class ReadEmailPage extends Death13.Component {
  state: any = {
    isModalOpen: false,
    unReadCount: 0,
    replyData: null,
    isPress: 0,
    forwardData: null,
    avatarKey: 0,
    selectedFolderId: null,
    currentView: "read",
    email: {
      id: "",
      header: "",
      body: "",
      createdAt: "",
      senderEmail: "",
      senderImage: "",
      senderName: "",
      senderSurname: "",
      receiverList: [],
    },
  };

  constructor(props: any) {
    super(props);
    const selectedFolderId = AppStorage.getCurrentFolderId?.() || null;

    this.state = {
      ...this.state,
      selectedFolderId: selectedFolderId,
      currentView: "read",
    };
  }

  componentDidMount() {
    const strID = location.pathname.split("/").pop();
    const id = strID ? parseInt(strID, 10) : 0;
    this.loadEmail(id);
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.id !== this.props.id) {
      const strID = location.pathname.split("/").pop();
      const id = strID ? parseInt(strID, 10) : 0;
      this.loadEmail(id);
    }
  }

  async loadEmail(id: number) {
    const data = await getEmailByID(id);
    if (!data) {
      window.app.handleRoute("/");
    }

    AppStorage.cacheSingleEmail(data);

    if (window.app.previousPath === "/sent") {
      this.setState({ isPress: 1 });
    } else {
      this.setState({ isPress: 0 });
    }
    this.setState({
      email: {
        id: data.id,
        header: data.header,
        body: data.body,
        createdAt: data.created_at,
        senderEmail: data.sender_email,
        senderImage: data.sender_image_path,
        senderName: data.sender_name,
        senderSurname: data.sender_surname,
        receiverList: data.receiver_list,
        is_anonymous: data.is_anonymous,
      },
    });
  }

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

  handleGetDrafts = () => {
    AppStorage.setCurrentView("drafts");
    window.app.handleRoute("/");
  };

  handleGetSendEmail = () => {
    AppStorage.setCurrentView("sent");
    window.app.handleRoute("/sent");
  };

  handleGoToMain = () => {
    AppStorage.setCurrentView("inbox");
    AppStorage.clearMailActionData();
    AppStorage.setCurrentFolderId(null);
    window.app.handleRoute("/");
  };

  handleNewMail = () => {
    window.app.handleRoute("/send");
  };

  handleBackToMail = () => {
    AppStorage.clearMailActionData();
    AppStorage.setCurrentFolderId(null);
    window.app.handleRoute("/");
  };

  handleBackToSent = () => {
    AppStorage.clearMailActionData();
    AppStorage.setCurrentFolderId(null);
    window.app.handleRoute("/sent");
  };

  loadEmailFromFolder = async (offset: number, folderID: number) => {
    AppStorage.setCurrentFolderId(folderID);
    AppStorage.setCurrentView("folder");
    window.app.handleRoute("/");
  };

  handleFavoriteToggled = (newIsFavorite: boolean) => {
    const updatedEmail = {
      ...this.state.email,
      is_favorite: newIsFavorite,
    };
    this.setState({ email: updatedEmail });
  };

  t(key: string): string {
    return AppStorage.t(key);
  }

  render() {
    const { isModalOpen, selectedFolderId, currentView } = this.state;

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
            <ReadMail
              key={this.state.email.id}
              email={this.state.email}
              backToMail={this.handleBackToMail}
              backToSent={this.handleBackToSent}
              selectedFolderId={selectedFolderId}
              onFavoriteToggled={this.handleFavoriteToggled}
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

export default ReadEmailPage;
