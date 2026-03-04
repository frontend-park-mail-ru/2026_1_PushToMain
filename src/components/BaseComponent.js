export class BaseComponent {
    constructor(events) {
        this.events = events;
    }
    /**
     * Рендерит компонент с заданными свойствами.
     * @param {string} name - Название компонента
     * @param {Object} props - Свойства компонента
     */
    renderComponent(name, props) {
        const template = window.Handlebars.templates[name + ".hbs"];
        return new DOMParser().parseFromString(template(props), "text/html").body.firstElementChild;
    }
    render(props) { }
    remove() { }
}
