import Death13 from "@react/stands";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import MailHeader from "../../widgets/MailHeader/MailHeader";
import MailBox from "../../widgets/MailBox/MailBox";
import { getEmail } from "../../api/ApiEmail";
import "./MainPage.css";

class MainPage extends Death13.Component {
    state: any = {
        emails: [],
        isLoading: true,
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

    handleSettings = (event: Event) => {
        event.preventDefault();
        // Открыть настройки
    };

    handleAvatar = (event: Event) => {
        event.preventDefault();
        // Открыть аккаунт
    };

    handleSearch = (value: string) => {
        // Поиск писем
        console.log("Search:", value);
    };

    render() {
        const { emails} = this.state;

        return (
            <div className="main-page">
                <aside className="sidebar">
                    <Sidebar />
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
                            <Button svg="../../assets/svg/Settings.svg" name="settings" help="Настройки" onClick={this.handleSettings} />
                            <Button svg="../../assets/svg/Avatar.svg" name="avatar" help="Аккаунт" onClick={this.handleAvatar} />
                        </div>
                    </div>
                    <div className="mail-box-container">
                        <MailHeader />
                        {emails.map((email: any, index: number) => (
                            <MailBox key={index} theme={email.header} title={email.body} date="15:00" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default MainPage;
