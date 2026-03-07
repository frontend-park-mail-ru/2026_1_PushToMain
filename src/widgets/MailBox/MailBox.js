import { BaseComponent } from "../../components/BaseComponent.js";
import { Input } from "../../components/Input/Input.js";
import { Button } from "../../components/Button/Button.js";

export class MailBox extends BaseComponent {
    render(props) {

        const widget = this.renderComponent("MailBox", {
            theme: props.theme,
            title: props.title,
            date: props.date,
        });


        const ArrowLeft = new Button().render({
            svg: '/public/assets/svg/ArrowLeft.svg',
            onclick: (event) => {
                event.preventDefault()
            }
        })

        const ArrowRight = new Button().render({
            svg: '/public/assets/svg/ArrowRight.svg',
            onclick: (event) => {
                event.preventDefault()
            }
        })

        const ThreeDotsVertical = new Button().render({
            svg: '/public/assets/svg/ThreeDotsVertical.svg',
            onclick: (event) => {
                event.preventDefault()
            }
        })

        const Refresh = new Button().render({
            svg: '/public/assets/svg/Refresh.svg',
            onclick: (event) => {
                event.preventDefault()
            }
        })

        const MailHeaderLeftContainer = widget.querySelector('.mail-header__left-container');
        const MailHeaderRightContainer = widget.querySelector('.mail-header__right-container');

        MailHeaderLeftContainer.appendChild(Refresh);
        MailHeaderLeftContainer.appendChild(ThreeDotsVertical);
        MailHeaderRightContainer.appendChild(ArrowLeft);
        MailHeaderRightContainer.appendChild(ArrowRight);



        const SelectCheckBox = new Input().render({
            type: "checkbox",
            name: "select-checkbox",
        });

        const FavoritesCheckBox = new Input().render({
            type: "checkbox",
            name: "favorites-checkbox",
        });

        const CheckBoxContainer = widget.querySelector('.checkbox-container');
        CheckBoxContainer.appendChild(SelectCheckBox);
        CheckBoxContainer.appendChild(FavoritesCheckBox);


        return widget;
    }
}