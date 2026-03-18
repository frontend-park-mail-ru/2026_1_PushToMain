import Death13 from "@react/stands";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import MailHeader from "../../widgets/MailHeader/MailHeader";

class MainPage extends Death13.Component {
    render() {
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
                                onInput={() => {}}
                            />
                        </div>
                        <div className="top-right-menu">
                            <Button
                                svg="../../assets/svg/Settings.svg"
                                name="settings"
                                help="Настройки"
                                onClick={(event: any) => {
                                    event.preventDefault();
                                }}
                            />
                            <Button
                                svg="../../assets/svg/Avatar.svg"
                                name="avatar"
                                help="Аккаунт"
                                onClick={(event: any) => {
                                    event.preventDefault();
                                }}
                            />
                        </div>
                    </div>
                    <div className="mail-box-container">
                        <MailHeader />
                    </div>
                </div>
            </div>
        );
    }
}

export default MainPage;
