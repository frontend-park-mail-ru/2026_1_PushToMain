export class BaseComponent {
    constructor(events) {
        this.events = events;
    }
    renderComponent(name, props) {
        const template = window.Handlebars.templates[name + ".hbs"];
        return new DOMParser().parseFromString(template(props), "text/html").body.firstElementChild;
    }
    render(props) { }
    remove() { }
}