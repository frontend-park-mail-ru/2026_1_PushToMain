import Death13 from "@react/stands";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import MailHeader from "../../widgets/MailHeader/MailHeader";
import MailBox from "../../widgets/MailBox/MailBox";
import { getEmail } from "../../api/ApiEmail";
import "./MainPage.scss";
import ProfileModal from "../../widgets/ProfileModal/ProfileModal";
import Profile from "../../widgets/Profile/Profile";

class MainPage extends Death13.Component {
    state: any = {
        emails: [],
        isLoading: true,
        isModalOpen: false,
        isProfileMode: false,
    };

    async componentDidMount() {
        try {
            const emails = await getEmail();
            if (emails === undefined) {
                window.app.handleRoute("/login");
                return;
            }
            this.setState({ emails, isLoading: false });
        } catch (error) {
            console.error("Failed to load emails:", error);
            window.app.handleRoute("/login");
        }
    }

    handleLogout = (event: Event) => {
        event.preventDefault();
        window.app.handleRoute("/login");
    };

    handleAvatar = (event: Event) => {
        event.preventDefault();
        this.setState({ isModalOpen: true });
    };

    handleCloseModal = () => {
        this.setState({ isModalOpen: false });
    };
    handleProfileClick = () => {
        this.setState({ isModalOpen: false, isProfileMode: true });
    };

    handleBackToMail = () => {
        this.setState({ isProfileMode: false });
    };

    handleSearch = (value: string) => {
        // Поиск писем
        console.log("Search:", value);
    };

    render() {
        const { emails, isModalOpen, isProfileMode } = this.state;
        return (
            <div className="main-page">
                <aside className="sidebar">
                    <Sidebar isProfile={isProfileMode} backToMail={this.handleBackToMail} />
                </aside>
                <div className="right-part">
                    <div className="top-bar">
                        <div className="search-bar">
                            <Input
                                type="text"
                                placeholder="Поиск в почте"
                                name="search"
                                svg="../../assets/svg/Search.svg"
                                onInput={(e: any) => {
                                    this.handleSearch(e.target.value);
                                }}
                            />
                        </div>
                        <div className="top-right-menu">
                            <Button svg="../../assets/svg/Avatar.svg" name="avatar" help="Аккаунт" onClick={this.handleAvatar} />
                        </div>
                    </div>
                    <div className="mail-box-container">
                        {!isProfileMode && (
                            <div>
                                <MailHeader />
                                {emails.map((email: any, index: number) => (
                                    <MailBox key={index} theme={email.header} title={email.body} date="15:00" />
                                ))}
                            </div>
                        )}{" "}
                        {isProfileMode && <Profile />}
                    </div>

                    <ProfileModal isOpen={isModalOpen} onClose={this.handleCloseModal} onProfileClick={this.handleProfileClick} />
                </div>
            </div>
        );
    }
}

export default MainPage;
