import Death13 from "@react/stands";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegPage from "./pages/RegPage/RegPage";
import "../public/index.scss";
import MainPage from "./pages/MainPage/MainPage";

class App {
    private routes: Record<string, any>;

    constructor() {
        this.routes = {
            "/login": <LoginPage />,
            "/register": <RegPage />,
            "/": <MainPage />,
        };
        this.handleRoute(location.pathname);
    }

    handleRoute(path: string) {
        const route = this.routes[path] || this.routes["/"];

        const root = document.getElementById("root");
        if (!root) return;

        root.innerHTML = "";

        Death13.render(route, root);

        history.pushState({}, "", path);
    }
}

declare global {
    interface Window {
        app: App;
    }
}

window.app = new App();
