import { LoginPage } from "./pages/LoginPage/LoginPage.js"
import { RegPage } from "./pages/RegPage/RegPage.js";

class App {
    constructor() {
        this.routes = {
            '/': LoginPage,
            '/login': LoginPage,
            '/register': RegPage
        };
        this.handleRoute()
    }


    handleRoute() {
        const path = window.location.pathname || '/';
        const route = this.routes[path] || this.routes['/'];

        const root = document.getElementById('root');
        root.innerHTML = '';

        const page = new route().render();
        root.appendChild(page);
    }

}

window.app = new App();

