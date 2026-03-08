import { BaseComponent } from "../../components/BaseComponent.js";
import { Button } from "../../components/Button/Button.js";

export class Sidebar extends BaseComponent {
    constructor() {
        super();
        this.state = 1;
    }
    render(props) {
        const sidebar = this.renderComponent("Sidebar", {});

        const buttonNewLetter = new Button().render({
            name: "button-new-letter",
            title: "Новое письмо",
            svg: "/public/assets/svg/Compose.svg",
            onClick: (event) => {
                event.preventDefault();
            },
        });

        const MainButton = sidebar.querySelector(".main-button");
        MainButton.appendChild(buttonNewLetter);

        const buttonInbox = new Button().render({
            name: "button-inbox",
            title: "Входящие",
            svg: "/public/assets/svg/Inbox.svg",
            count: 1,
            onClick: (event) => {
                event.preventDefault();
            },
        });

        const buttonDrafs = new Button().render({
            name: "button-drafs",
            title: "Черновики",
            svg: "/public/assets/svg/Draft.svg",
            count: 1,
            onClick: (event) => {
                event.preventDefault();
            },
        });
        const buttonSends = new Button().render({
            name: "button-sends",
            title: "Отправленные",
            svg: "/public/assets/svg/Sent.svg",
            onClick: (event) => {
                event.preventDefault();
            },
        });
        const buttonFavorites = new Button().render({
            name: "button-favorites",
            title: "Избранные",
            svg: "/public/assets/svg/SidebarFavorites.svg",
            onClick: (event) => {
                event.preventDefault();
            },
        });

        const buttonProject = new Button().render({
            name: "button-project",
            title: "VK проект",
            svg: "/public/assets/svg/Folder.svg",
            onClick: (event) => {
                event.preventDefault();
            },
        });

        const MainButtonContainer = sidebar.querySelector(".main-button-container");
        MainButtonContainer.appendChild(buttonInbox);
        MainButtonContainer.appendChild(buttonDrafs);
        MainButtonContainer.appendChild(buttonSends);
        MainButtonContainer.appendChild(buttonFavorites);
        MainButtonContainer.appendChild(buttonProject);

        const buttonDropDown = new Button().render({
            name: "button-drop-down",
            title: "Скрыть",
            svg: "/public/assets/svg/DropdownArrow.svg",
            onClick: (event) => {
                event.preventDefault();

                const button = event.currentTarget;
                button.classList.toggle("active");

                const arrow = button.querySelector("svg");
                arrow.classList.toggle("rotated");

                const buttonArchive = new Button().render({
                    name: "button-archive",
                    title: "Архив",
                    svg: "/public/assets/svg/Archive.svg",
                    onClick: (event) => {
                        event.preventDefault();
                    },
                });
                const buttonSpam = new Button().render({
                    name: "button-spam",
                    title: "Спам",
                    svg: "/public/assets/svg/Spam.svg",
                    onClick: (event) => {
                        event.preventDefault();
                    },
                });
                const buttonTrash = new Button().render({
                    name: "button-trash",
                    title: "Корзина",
                    svg: "/public/assets/svg/Trash.svg",
                    onClick: (event) => {
                        event.preventDefault();
                    },
                });
                const buttonAllLetter = new Button().render({
                    name: "button-all-letter",
                    title: "Все письма",
                    svg: "/public/assets/svg/AllMail.svg",
                    count: 1,
                    onClick: (event) => {
                        event.preventDefault();
                    },
                });

                const ExtraButtonContainer = sidebar.querySelector(".extra-button-container");
                ExtraButtonContainer.innerHTML = "";

                if (this.state == 1) {
                    this.state = 0;
                    ExtraButtonContainer.appendChild(buttonArchive);
                    ExtraButtonContainer.appendChild(buttonSpam);
                    ExtraButtonContainer.appendChild(buttonTrash);
                    ExtraButtonContainer.appendChild(buttonAllLetter);
                } else {
                    this.state = 1;
                    ExtraButtonContainer.innerHTML = "";
                }
            },
        });

        const DropDownContainer = sidebar.querySelector(".drop-down");
        DropDownContainer.appendChild(buttonDropDown);

        return sidebar;
    }
}
