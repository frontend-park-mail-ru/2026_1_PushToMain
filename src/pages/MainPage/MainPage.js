import { BaseComponent } from "../../components/BaseComponent.js";
import { Sidebar } from "../../widgets/Sidebar/Sidebar.js";
import { Input } from "../../components/Input/Input.js";
import { MailBox } from "../../widgets/MailBox/MailBox.js";
import { Button } from "../../components/Button/Button.js";
import { MailHeader } from "../../widgets/MailHeader/MailHeader.js";
import { getEmail } from "../../api/ApiEmail.js";
import { logOut } from "../../api/ApiAuth.js";

export class MainPage extends BaseComponent {
    /**
     * Рендерит страницу главную страницу с заданными свойствами.
     * @returns {HTMLElement} Возвращает DOM-элемент главной страницы
     */
    render() {
        const page = this.renderComponent("MainPage", {
            title: "Главная",
        });

        const sidebar = new Sidebar().render({});
        const sidebarContainer = page.querySelector(".sidebar");
        sidebarContainer.appendChild(sidebar);

        const search = new Input().render({
            type: "text",
            placeholder: "Поиск в почте",
            name: "search",
            svg: "/public/assets/svg/Search.svg",
            input: () => {},
        });

        const searchContainer = page.querySelector(".search-bar");
        searchContainer.appendChild(search);

        const setting = new Button().render({
            svg: "/public/assets/svg/Settings.svg",
            help: "Настройки",
            onClick: (event) => {
                event.preventDefault();
                this.logout();
            },
        });

        const avatar = new Button().render({
            svg: "/public/assets/svg/Avatar.svg",
            name: "avatar",
            help: "Аккаунт",
            onClick: (event) => {
                event.preventDefault();
            },
        });

        const topRightMenu = page.querySelector(".top-right-menu");
        topRightMenu.appendChild(setting);
        topRightMenu.appendChild(avatar);

        const mailHeader = new MailHeader().render({});
        const mailBoxContainer = page.querySelector(".mail-box-container");
        mailBoxContainer.appendChild(mailHeader);

        getEmail().then((emails) => {
            if (emails === undefined) {
                window.app.handleRoute("/login");
                return;
            }
            emails.forEach((element) => {
                const mailTile = new MailBox().render({
                    theme: element.header,
                    title: element.body,
                    date: "15:00",
                });
                mailBoxContainer.appendChild(mailTile);
            });
        });

        return page;
    }
    /**
     * Выполняет выход пользователя из системы
     */
    logout() {
        logOut();
        window.app.handleRoute("/login");
    }
}
