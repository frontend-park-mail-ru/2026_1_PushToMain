import Death13 from "@react/stands";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import SendMail from "../../widgets/SendMail/SendMail";
import "./SendEmailPage.scss";
import ProfileModal from "../../widgets/ProfileModal/ProfileModal";
import Input from "../../components/Input/Input";
import { AppStorage } from "../../App";
import { getProfile } from "../../api/ApiAuth";

class SendEmailPage extends Death13.Component {
  constructor(props: any) {
    super(props);

    this.loadMailActionData();
    this.loadProfile();
  }

  state: any = {
    isModalOpen: false,
    unReadCount: 0,
    replyData: null,
    forwardData: null,
    avatarKey: 0,
  };

  loadProfile = async () => {
    const data = await getProfile();
    if (data === null) {
      window.app.handleRoute("/login");
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

  handleBackToMail = () => {
    AppStorage.clearMailActionData();
    window.app.handleRoute("/");
  };

  handleNewMail = () => {
    AppStorage.clearMailActionData();
    this.setState({ replyData: null, forwardData: null });
  };

  render() {
    const { isModalOpen, unReadCount, replyData, forwardData } = this.state;

    const mailActionData = replyData || forwardData;

    return (
      <div className="send-email-page" onClick={() => this.handleCloseModal()}>
        <aside className="sidebar">
          <Sidebar
            isProfile={0}
            unReadCount={unReadCount}
            newMail={this.handleNewMail}
            backToMail={this.handleBackToMail}
          />
        </aside>
        <div className="right-part">
          <div className="top-bar">
            {/*
                        <div className="search-bar">
                            <Input
                                type="text"
                                placeholder="Поиск в почте"
                                name="search"
                                svg="../../assets/svg/Search.svg"
                                onInput={() => {}}
                            />
                </div>
                */}
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
