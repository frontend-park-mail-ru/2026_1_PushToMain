import Death13 from "@react/stands";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegPage from "./pages/RegPage/RegPage";
import "../public/index.scss";
import MainPage from "./pages/MainPage/MainPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import SentPage from "./pages/SentPage/SentPage";
import SendEmailPage from "./pages/SendEmailPage/SendEmailPage";
import { URLMINIO } from "./api/config";

export const AppStorage = {
    unReadCount: 0,
    name: "",
    surname: "",
    email: "",
    image_path: "",
    replyData: null as any,
    forwardData: null as any,

    setProfileData(data: { name: string; surname: string; email: string; image_path: string }) {
        this.name = data.name || "";
        this.surname = data.surname || "";
        this.email = data.email || "";
        this.image_path = `${URLMINIO}/${data.image_path}` || "";
    },

    setUnReadCount(count: number) {
        this.unReadCount = count;
    },

    setReplyData(data: any) {
        this.replyData = data;
        this.forwardData = null; // Очищаем forward при установке reply
    },

    getReplyData() {
        return this.replyData;
    },

    setForwardData(data: any) {
        this.forwardData = data;
        this.replyData = null; // Очищаем reply при установке forward
    },

    getForwardData() {
        return this.forwardData;
    },

    clearMailActionData() {
        this.replyData = null;
        this.forwardData = null;
    },

    getMailActionData() {
        return this.replyData || this.forwardData;
    }
};

class App {
    private routes: Record<string, any>;

    constructor() {
        this.routes = {
            "/login": LoginPage,
            "/register": RegPage,
            "/profile": ProfilePage,
            "/send": SendEmailPage,
            "/sent": SentPage,
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
        AppStorage: typeof AppStorage;
    }
}

window.AppStorage = AppStorage;
window.app = new App();
