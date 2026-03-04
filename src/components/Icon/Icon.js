import { BaseComponent } from "../BaseComponent.js";

export class Icon extends BaseComponent {
    render(props) {
        const template = window.Handlebars.templates["Icon.hbs"];
        return new DOMParser().parseFromString(template(props), "text/html").body.firstElementChild;
    }
}
