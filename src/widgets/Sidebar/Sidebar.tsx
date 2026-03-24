import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import "./Sidebar.css";

const Sidebar = () => {
    const [isVisible, setIsVisible] = Death13.useState<boolean>(false);

    return (
        <div className="sidebar-widget">
            <div className="logo-container">
                <img src="../../assets/svg/Logo.svg" />
                <h1 className="logo__title">SMail</h1>
            </div>
            <div className="main-button">
                <Button
                    title="Новое письмо"
                    name="button-new-letter"
                    svg="../../assets/svg/Compose.svg"
                    onClick={(event: any) => {
                        event.preventDefault();
                    }}
                />
            </div>
            <div className="main-button-container">
                <Button
                    name="button-inbox"
                    title="Входящие"
                    svg="../../assets/svg/Inbox.svg"
                    onClick={(event: any) => {
                        event.preventDefault();
                    }}
                />
                <Button
                    name="button-drafs"
                    title="Черновики"
                    svg="../../assets/svg/Draft.svg"
                    onClick={(event: any) => {
                        event.preventDefault();
                    }}
                />
                <Button
                    name="button-sends"
                    title="Отправленные"
                    svg="../../assets/svg/Sent.svg"
                    onClick={(event: any) => {
                        event.preventDefault();
                    }}
                />
                <Button
                    name="button-favorites"
                    title="Избранные"
                    svg="../../assets/svg/SidebarFavorites.svg"
                    onClick={(event: any) => {
                        event.preventDefault();
                    }}
                />
            </div>
            <div className="drop-down">
                <Button
                    name="button-drop-down"
                    title={isVisible ? "Скрыть" : "Ещё"}
                    svg="../../assets/svg/DropdownArrow.svg"
                    onClick={(event: any) => {
                        event.preventDefault();
                        setIsVisible(!isVisible);
                    }}
                />
                {isVisible && (
                    <div className="extra-button-container">
                        <Button
                            name="button-archive"
                            title="Архив"
                            svg="../../assets/svg/Archive.svg"
                            onClick={(event: any) => {
                                event.preventDefault();
                            }}
                        />
                        <Button
                            name="button-spam"
                            title="Спам"
                            svg="../../assets/svg/Spam.svg"
                            onClick={(event: any) => {
                                event.preventDefault();
                            }}
                        />
                        <Button
                            name="button-trash"
                            title="Корзина"
                            svg="../../assets/svg/Trash.svg"
                            onClick={(event: any) => {
                                event.preventDefault();
                            }}
                        />
                        <Button
                            name="button-all-letter"
                            title="Все письма"
                            svg="../../assets/svg/AllMail.svg"
                            onClick={(event: any) => {
                                event.preventDefault();
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Sidebar;