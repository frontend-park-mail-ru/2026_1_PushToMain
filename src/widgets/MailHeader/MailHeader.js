import { BaseComponent } from "../../components/BaseComponent.js";
import { Button } from "../../components/Button/Button.js";
import { Input } from "../../components/Input/Input.js";

export class MailHeader extends BaseComponent {
    render(props) {
        const widget = this.renderComponent("MailHeader", {});

        const ArrowLeft = new Button().render({
            svg: "/public/assets/svg/ArrowLeft.svg",
            help: "Пред.",
            onclick: (event) => {
                event.preventDefault();
            },
        });

        const ArrowRight = new Button().render({
            svg: "/public/assets/svg/ArrowRight.svg",
            help: "След.",
            onclick: (event) => {
                event.preventDefault();
            },
        });

        const ThreeDotsVertical = new Button().render({
            svg: "/public/assets/svg/ThreeDotsVertical.svg",
            help: "Ещё",
            onclick: (event) => {
                event.preventDefault();
            },
        });

        const Refresh = new Button().render({
            svg: "/public/assets/svg/Refresh.svg",
            help: "Обновить",
            onclick: (event) => {
                event.preventDefault();
            },
        });

        const CheckBoxAll = new Input().render({
            type: "checkbox",
            name: "checkbox-all",
            help: "Выбрать",
            input: (event) => {
                const CheckBoxMail = document.querySelectorAll('input[name="select-checkbox"]');

                CheckBoxMail.forEach((element) => {
                    if (!element.checked) {
                        element.checked = true;
                    } else {
                        element.checked = false;
                    }
                });
            },
        });

        const ArrowDonwAll = new Button().render({
            svg: "/public/assets/svg/ArrowDown.svg",
            help: "Выбрать",
            onclick: (event) => {
                event.preventDefault();
            },
        });

        const MailHeaderLeftContainer = widget.querySelector(".mail-header__left-container");
        const LeftContainerSelectAll = MailHeaderLeftContainer.querySelector(".left-container__select-all");
        const MailHeaderRightContainer = widget.querySelector(".mail-header__right-container");

        LeftContainerSelectAll.appendChild(CheckBoxAll);
        LeftContainerSelectAll.appendChild(ArrowDonwAll);
        MailHeaderLeftContainer.appendChild(Refresh);
        MailHeaderLeftContainer.appendChild(ThreeDotsVertical);
        MailHeaderRightContainer.appendChild(ArrowLeft);
        MailHeaderRightContainer.appendChild(ArrowRight);

        return widget;
    }
}
