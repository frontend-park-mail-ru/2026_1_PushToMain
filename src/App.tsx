import Death13 from "@react/stands";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegPage from "./pages/RegPage/RegPage"
import "../public/index.css"
import MainPage from "./pages/MainPage/MainPage";

class App {
    private routes: Record<string, any>;
    constructor() {
        this.routes = {
            "/login": <LoginPage/>,
            "/register": <RegPage/>,
            "/": <MainPage/>
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

declare global {
    interface Window {
        app: App;
    }
}

window.app = new App();