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
    constructor(props: any) {
        super(props);
        const strID = location.pathname.split("/").pop();
        const id = strID ? parseInt(strID, 10) : 0;
        this.loadEmail(id);
    }
    state: any = {
        isModalOpen: false,
        unReadCount: 0,
        replyData: null,
        isPress: 0,
        forwardData: null,
        avatarKey: 0,
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

    async loadEmail(id: number) {
        const data = await getEmailByID(id);
        if (!data) {
            window.app.handleRoute("/");
        }

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

    handleNewMail = () => {
        window.app.handleRoute("/send");
    };

    handleBackToMail = () => {
        AppStorage.clearMailActionData();
        window.app.handleRoute("/");
    };

    handleBackToSent = () => {
        AppStorage.clearMailActionData();
        window.app.handleRoute("/sent");
    };

    render() {
        const { isModalOpen, unReadCount, isPress } = this.state;

        return (
            <div className="send-email-page" onClick={() => this.handleCloseModal()}>
                <aside className="sidebar">
                    <Sidebar
                        isProfile={0}
                        isPress={isPress}
                        unReadCount={unReadCount}
                        newMail={this.handleNewMail}
                        backToMail={this.handleBackToMail}
                        backToSent={this.handleBackToSent}
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
                                onInput={() => {}}
                            />
                        </div>

                        <div className="top-right-menu">
                            <Button svg={AppStorage.getAvatarUrl()} name="avatar" help="Аккаунт" onClick={this.handleAvatar} />
                        </div>
                    </div>
                    <div className="mail-box-container">
                        <ReadMail email={this.state.email} backToMail={this.handleBackToMail} backToSent={this.handleBackToSent} />
                    </div>

                    <ProfileModal isOpen={isModalOpen} onClose={this.handleCloseModal} onProfileClick={this.handleProfileClick} />
                </div>
            </div>
        );
    }
}

export default ReadEmailPage;
