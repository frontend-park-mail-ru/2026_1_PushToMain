import { BaseComponent } from "../../components/BaseComponent.js";
import { Button } from "../../components/Button/Button.js";
import { Input } from "../../components/Input/Input.js";

export class MailHeader extends BaseComponent {
    /**
     * Рендерит панель управления письмами с заданными свойствами
     * @returns {HTMLElement} Возвращает DOM-элемент панель управления письмами
     */
    render() {
        const widget = this.renderComponent("MailHeader", {});

        const arrowLeft = new Button().render({
            svg: "/public/assets/svg/ArrowLeft.svg",
            help: "Пред.",
            onclick: (event) => {
                event.preventDefault();
            },
        });

        const arrowRight = new Button().render({
            svg: "/public/assets/svg/ArrowRight.svg",
            help: "След.",
            onclick: (event) => {
                event.preventDefault();
            },
        });

        const threeDotsVertical = new Button().render({
            svg: "/public/assets/svg/ThreeDotsVertical.svg",
            help: "Ещё",
            onclick: (event) => {
                event.preventDefault();
            },
        });

        const refresh = new Button().render({
            svg: "/public/assets/svg/Refresh.svg",
            help: "Обновить",
            onclick: (event) => {
                event.preventDefault();
            },
        });

        const checkBoxAll = new Input().render({
            type: "checkbox",
            name: "checkbox-all",
            help: "Выбрать",
            input: () => {
                const checkBoxMail = document.querySelectorAll('input[name="select-checkbox"]');

                checkBoxMail.forEach((element) => {
                    if (!element.checked) {
                        element.checked = true;
                    } else {
                        element.checked = false;
                    }
                });
            },
        });

        const arrowDonwAll = new Button().render({
            svg: "/public/assets/svg/ArrowDown.svg",
            help: "Выбрать",
            onclick: (event) => {
                event.preventDefault();
            },
        });

        const mailHeaderLeftContainer = widget.querySelector(".mail-header__left-container");
        const leftContainerSelectAll = mailHeaderLeftContainer.querySelector(".left-container__select-all");
        const mailHeaderRightContainer = widget.querySelector(".mail-header__right-container");

        leftContainerSelectAll.appendChild(checkBoxAll);
        leftContainerSelectAll.appendChild(arrowDonwAll);
        mailHeaderLeftContainer.appendChild(refresh);
        mailHeaderLeftContainer.appendChild(threeDotsVertical);
        mailHeaderRightContainer.appendChild(arrowLeft);
        mailHeaderRightContainer.appendChild(arrowRight);

        return widget;
    }
}
