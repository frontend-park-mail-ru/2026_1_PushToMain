import Death13 from "@react/stands";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegPage from "./pages/RegPage/RegPage";
import "../public/index.scss";
import MainPage from "./pages/MainPage/MainPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";

class App {
    private routes: Record<string, any>;

    constructor() {
        this.routes = {
            "/login": LoginPage,
            "/register": RegPage,
            "/profile": ProfilePage,
            "/": MainPage,
        };
        
        window.addEventListener("popstate", () => {
            this.renderRoute(location.pathname);
        });

        this.renderRoute(location.pathname);
    }

    handleRoute(path: string) {
        if (location.pathname === path) {
            return;
        }
        
        history.pushState({}, "", path);
        this.renderRoute(path);
    }

    renderRoute(path: string) {
        const Component = this.routes[path] || this.routes["/"];
        const root = document.getElementById("root");
        if (!root) return;

        const element = Death13.createElement(Component, {}, []);
        
        Death13.render(element, root);
    }
}

declare global {
    interface Window {
        app: App;
    }
}

window.app = new App();