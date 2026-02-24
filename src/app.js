import { LoginPage } from "./pages/LoginPage/LoginPage.js"
import { RegPage } from "./pages/RegPage/RegPage.js";
import { Router } from "./routes.js";


class App {

    constructor() {
        this.initRouter();
    }

    initRouter() {
        const routes = {
            '/': LoginPage,
            '/login': LoginPage,
            '/register': RegPage
        };

        this.router = new Router(routes)
    }
}

new App();
