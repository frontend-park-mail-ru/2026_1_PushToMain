import { BaseComponent } from "../../components/BaseComponent.js";
import { Button } from "../../components/Button/Button.js";

export class Sidebar extends BaseComponent {
    /**
     * Создает экземпляр боковой панели
     * @constructor
     */
    constructor() {
        super();
        this.state = 1;
    }
    /**
     * Рендерит боковую панель с заданными свойствами
     * @returns {HTMLElement} Возвращает DOM-элемент боковую панель
     */
    render() {
        const sidebar = this.renderComponent("Sidebar", {});

        const buttonNewLetter = new Button().render({
            name: "button-new-letter",
            title: "Новое письмо",
            svg: "/public/assets/svg/Compose.svg",
            onClick: (event) => {
                event.preventDefault();
            },
        });

        const mainButton = sidebar.querySelector(".main-button");
        mainButton.appendChild(buttonNewLetter);

        const buttonInbox = new Button().render({
            name: "button-inbox",
            title: "Входящие",
            svg: "/public/assets/svg/Inbox.svg",
            onClick: (event) => {
                event.preventDefault();
            },
        });

        const buttonDrafs = new Button().render({
            name: "button-drafs",
            title: "Черновики",
            svg: "/public/assets/svg/Draft.svg",
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

        const mainButtonContainer = sidebar.querySelector(".main-button-container");
        mainButtonContainer.appendChild(buttonInbox);
        mainButtonContainer.appendChild(buttonDrafs);
        mainButtonContainer.appendChild(buttonSends);
        mainButtonContainer.appendChild(buttonFavorites);

        const buttonDropDown = new Button().render({
            name: "button-drop-down",
            title: "Ещё",
            svg: "/public/assets/svg/DropdownArrow.svg",
            onClick: (event) => {
                event.preventDefault();

                const button = event.currentTarget;
                const buttonText = button.querySelector(".button__text");
                button.classList.toggle("active");

                if (button.classList.contains("active")) {
                    buttonText.innerText = "Скрыть";
                } else {
                    buttonText.innerText = "Ещё";
                }

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
                    onClick: (event) => {
                        event.preventDefault();
                    },
                });

                const extraButtonContainer = sidebar.querySelector(".extra-button-container");
                extraButtonContainer.innerHTML = "";

                if (this.state == 1) {
                    this.state = 0;
                    extraButtonContainer.appendChild(buttonArchive);
                    extraButtonContainer.appendChild(buttonSpam);
                    extraButtonContainer.appendChild(buttonTrash);
                    extraButtonContainer.appendChild(buttonAllLetter);
                } else {
                    this.state = 1;
                    extraButtonContainer.innerHTML = "";
                }
            },
        });

        const dropDownContainer = sidebar.querySelector(".drop-down");
        dropDownContainer.appendChild(buttonDropDown);

        return sidebar;
    }
}
