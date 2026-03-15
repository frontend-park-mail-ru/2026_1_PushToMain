import Death13 from "@react/stands";
import LoginPage from "./pages/LoginPage/LoginPage";
import "../public/index.css"

class App {
    private routes: Record<string, any>;
    constructor() {
        this.routes = {
            "/login": <LoginPage/>,
        };
        this.handleRoute(location.pathname);
    }

    handleRoute(path: string) {
        history.pushState({}, "", path);
        const route = this.routes[path] || "/";

        const root = document.getElementById("root");
        if (!root) return;

        root.innerHTML = "";

        Death13.render(route, root)
    }
}

export const app = new App();
