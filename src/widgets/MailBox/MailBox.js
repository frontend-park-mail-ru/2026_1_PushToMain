import { BaseComponent } from "../../components/BaseComponent.js";

export class MailBox extends BaseComponent {
    render(props) {

        const widget = this.renderComponent("MailBox", {
            theme: props.theme,
            title: props.title,
            date: props.date,
        });

        return widget;
    }
}