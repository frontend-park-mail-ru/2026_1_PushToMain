import { BaseComponent } from "../../components/BaseComponent.js";
import { Button } from "../../components/Button/Button.js";

export class Sidebar extends BaseComponent {
    render(props) {

        const sidebar = this.renderComponent('Sidebar', {})

        const buttonInbox = new Button().render({
            name: 'button-inbox',
            title: 'Входящие',
            onClick: (event) => {
                event.preventDefault();
            }

        });

        const buttonDrafs = new Button().render({
            name: 'button-drafs',
            title: 'Черновики',
            onClick: (event) => {
                event.preventDefault();
            }

        });
        const buttonSends = new Button().render({
            name: 'button-sends',
            title: 'Отправленные',
            onClick: (event) => {
                event.preventDefault();
            }

        });
        const buttonFavorites = new Button().render({
            name: 'button-favorites',
            title: 'Избранные',
            onClick: (event) => {
                event.preventDefault();
            }

        });

        const buttonProject = new Button().render({
            name: 'button-project',
            title: 'VK проект',
            onClick: (event) => {
                event.preventDefault();
            }

        });

        const MainButtonContainer = sidebar.querySelector('.main-button-container')
        MainButtonContainer.appendChild(buttonInbox);
        MainButtonContainer.appendChild(buttonDrafs);
        MainButtonContainer.appendChild(buttonSends);
        MainButtonContainer.appendChild(buttonFavorites);
        MainButtonContainer.appendChild(buttonProject);


        const buttonDropDown = new Button().render({
            name: 'button-drop-down',
            title: 'Скрыть',
            onClick: (event) => {
                event.preventDefault();

                const buttonArchive = new Button().render({
                    name: 'button-archive',
                    title: 'Архив',
                    onClick: (event) => {
                        event.preventDefault();
                    }

                });
                const buttonSpam = new Button().render({
                    name: 'button-spam',
                    title: 'Спам',
                    onClick: (event) => {
                        event.preventDefault();
                    }

                });
                const buttonTrash = new Button().render({
                    name: 'button-trash',
                    title: 'Корзина',
                    onClick: (event) => {
                        event.preventDefault();
                    }

                });
                const buttonAllLetter = new Button().render({
                    name: 'button-all-letter',
                    title: 'Все письма',
                    onClick: (event) => {
                        event.preventDefault();
                    }

                });

                const ExtraButtonContainer = sidebar.querySelector('.extra-button-container');
                ExtraButtonContainer.innerHTML = '';

                ExtraButtonContainer.appendChild(buttonArchive);
                ExtraButtonContainer.appendChild(buttonSpam);
                ExtraButtonContainer.appendChild(buttonTrash);
                ExtraButtonContainer.appendChild(buttonAllLetter);

            }

        });

        const DropDownContainer = sidebar.querySelector('.drop-down');
        DropDownContainer.appendChild(buttonDropDown);

        return sidebar;
    }
}