export class Router {

    constructor(routes) {
        this.routes = routes;
        this.init();
    }

    init() {
        window.addEventListener('hashchange', () => {
            this.handleRoute();
        });
    }

    handleRoute() {
        const path = window.location.hash.slice(1) || '/';
        const route = this.routes[path];

        const root = document.getElementById('root');
        root.innerHTML = '';

        const page = new route().render();
        root.appendChild(page);
    }

    navigate(path) {
        window.location.hash = path;
    }
}