import { BaseComponent } from "../../components/BaseComponent.js";
import { Sidebar } from "../../widgets/Sidebar/Sidebar.js";
import { Input } from "../../components/Input/Input.js";
import { MailBox } from "../../widgets/MailBox/MailBox.js";
import { Button } from "../../components/Button/Button.js";

export class MainPage extends BaseComponent {

    render(props) {
        const page = this.renderComponent('MainPage', {
            title: 'Главная',
        });

        const sidebar = new Sidebar().render({})

        const search = new Input().render({
            type: 'text',
            placeholder: 'Поиск',
            name: 'search',
            svg: '/public/assets/svg/Search.svg',
            input: (event) => {
            }
        });

        const setting = new Button().render({
            svg: '/public/assets/svg/Settings.svg',
            onclick: (event) => {
                event.preventDefault()
            }
        })

        const avatar = new Button().render({
            svg: '/public/assets/svg/Avatar.svg',
            name: "avatar",
            onclick: (event) => {
                event.preventDefault()
            }
        })

        const mailbox = new MailBox().render({
            theme: "МГТУ им Н.Э Баумана",
            title: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF",
            date: "15:00"
        })

        const SearchContainer = page.querySelector('.search-bar');
        SearchContainer.appendChild(search);

        const TopRightMenu = page.querySelector('.top-right-menu');
        TopRightMenu.appendChild(setting);
        TopRightMenu.appendChild(avatar);

        const SigebarContainer = page.querySelector('.sidebar');
        SigebarContainer.appendChild(sidebar);

        const MailBoxContainer = page.querySelector('.mail-box-container');
        MailBoxContainer.appendChild(mailbox);

        return page;
    }
}
