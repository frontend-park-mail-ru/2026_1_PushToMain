import { BaseComponent } from "../../components/BaseComponent.js";
import { Sidebar } from "../../widgets/Sidebar/Sidebar.js";
import { Input } from "../../components/Input/Input.js";
import { MailBox } from "../../widgets/MailBox/MailBox.js";
import { Button } from "../../components/Button/Button.js";
import { MailHeader } from "../../widgets/MailHeader/MailHeader.js";

export class MainPage extends BaseComponent {
    render(props) {
        const page = this.renderComponent("MainPage", {
            title: "Главная",
        });

        const sidebar = new Sidebar().render({});
        const SigebarContainer = page.querySelector(".sidebar");
        SigebarContainer.appendChild(sidebar);

        const search = new Input().render({
            type: "text",
            placeholder: "Поиск в почте",
            name: "search",
            svg: "/public/assets/svg/Search.svg",
            input: (event) => {},
        });

        const SearchContainer = page.querySelector(".search-bar");
        SearchContainer.appendChild(search);

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

        const TopRightMenu = page.querySelector(".top-right-menu");
        TopRightMenu.appendChild(setting);
        TopRightMenu.appendChild(avatar);

        const mailHeader = new MailHeader().render({});
        const MailBoxContainer = page.querySelector(".mail-box-container");
        MailBoxContainer.appendChild(mailHeader);

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

        const MailTile = page.querySelector(".mail-box-container");
        MailTile.appendChild(mailbox1);
        MailTile.appendChild(mailbox2);
        MailTile.appendChild(mailbox3);

        return page;
    }
}
