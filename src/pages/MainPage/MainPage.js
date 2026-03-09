import { BaseComponent } from "../../components/BaseComponent.js";
import { Sidebar } from "../../widgets/Sidebar/Sidebar.js";
import { Input } from "../../components/Input/Input.js";
import { MailBox } from "../../widgets/MailBox/MailBox.js";
import { Button } from "../../components/Button/Button.js";
import { MailHeader } from "../../widgets/MailHeader/MailHeader.js";

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
            onclick: (event) => {
                event.preventDefault();
            },
        });

        const avatar = new Button().render({
            svg: "/public/assets/svg/Avatar.svg",
            name: "avatar",
            help: "Аккаунт",
            onclick: (event) => {
                event.preventDefault();
            },
        });

        const topRightMenu = page.querySelector(".top-right-menu");
        topRightMenu.appendChild(setting);
        topRightMenu.appendChild(avatar);

        const mailHeader = new MailHeader().render({});
        const mailBoxContainer = page.querySelector(".mail-box-container");
        mailBoxContainer.appendChild(mailHeader);

        const mailbox1 = new MailBox().render({
            theme: "МГТУ им Н.Э Баумана",
            title: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
            date: "15:00",
        });

        const mailbox2 = new MailBox().render({
            theme: "МГТУ им Н.Э Баумана",
            title: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
            date: "15:00",
        });

        const mailbox3 = new MailBox().render({
            theme: "МГТУ им Н.Э Баумана",
            title: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
            date: "15:00",
        });

        const mailTile = page.querySelector(".mail-box-container");
        mailTile.appendChild(mailbox1);
        mailTile.appendChild(mailbox2);
        mailTile.appendChild(mailbox3);

        return page;
    }
}
