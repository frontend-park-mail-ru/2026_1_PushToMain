import Death13 from "@react/stands";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegPage from "./pages/RegPage/RegPage";
import "../public/index.scss";
import MainPage from "./pages/MainPage/MainPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import SentPage from "./pages/SentPage/SentPage";
import SendEmailPage from "./pages/SendEmailPage/SendEmailPage";
import { URLMINIO } from "./api/config";
import ReadEmailPage from "./pages/ReadEmailPage/ReadEmailPage";

export const AppStorage = {
    _subscribers: [] as Array<() => void>,
    _lastUpdate: 0,
    unReadCount: 0,
    name: "",
    surname: "",
    email: "",
    image_path: "",
    replyData: null as any,
    forwardData: null as any,

    init() {
        try {
            const saved = localStorage.getItem("userProfile");
            if (saved) {
                const data = JSON.parse(saved);
                this.name = data.name || "";
                this.surname = data.surname || "";
                this.email = data.email || "";
                this.image_path = data.image_path || "";
                this._lastUpdate = data._lastUpdate || Date.now();
            }
        } catch (e) {
            console.warn("Failed to load profile from localStorage", e);
        }
        this._notify();
    },

    subscribe(callback: () => void) {
        this._subscribers.push(callback);
        return () => {
            this._subscribers = this._subscribers.filter((cb) => cb !== callback);
        };
    },

    _notify() {
        this._subscribers.forEach((cb) => cb());
    },

    setProfileData(data: { name: string; surname: string; email: string; image_path: string } | null) {
        if (!data) {
            console.warn("setProfileData called with null/undefined data");
            return;
        }

        this.name = data.name || "";
        this.surname = data.surname || "";
        this.email = data.email || "";
        this.image_path = data.image_path || "";
        this._lastUpdate = Date.now();

        this._saveToStorage();
        this._notify();
    },

    _saveToStorage() {
        try {
            localStorage.setItem(
                "userProfile",
                JSON.stringify({
                    name: this.name,
                    surname: this.surname,
                    email: this.email,
                    image_path: this.image_path,
                    _lastUpdate: this._lastUpdate,
                }),
            );
        } catch {}
    },

    setImagePath(path: string) {
        this.image_path = path;
        this._lastUpdate = Date.now();
        this._saveToStorage();
        this._notify();
    },

    setUnReadCount(count: number) {
        this.unReadCount = count;
    },

    setReplyData(data: any) {
        this.replyData = data;
        this.forwardData = null;
    },

    getReplyData() {
        return this.replyData;
    },

    setForwardData(data: any) {
        this.forwardData = data;
        this.replyData = null;
    },

    getForwardData() {
        return this.forwardData;
    },

    clearMailActionData() {
        this.replyData = null;
        this.forwardData = null;
    },

    getAvatarUrl() {
        if (this.image_path) {
            return `${URLMINIO}/${this.image_path}?t=${this._lastUpdate || Date.now()}`;
        }
        return "/assets/svg/Avatar.svg";
    },

    getMailActionData() {
        return this.replyData || this.forwardData;
    },
};

class App {
    private routes: Record<string, any>;
    private dynamicRoutes: Array<{ pattern: RegExp; component: any; paramName: string }>;

    constructor() {
        this.routes = {
            "/login": LoginPage,
            "/register": RegPage,
            "/profile": ProfilePage,
            "/send": SendEmailPage,
            "/sent": SentPage,
            "/read/": ReadEmailPage,
            "/": MainPage,
        };

        this.dynamicRoutes = [{ pattern: /^\/read\/(\d+)$/, component: ReadEmailPage, paramName: "id" }];

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
        let Component = this.routes[path];
        if (!Component) {
            for (const route of this.dynamicRoutes) {
                const match = path.match(route.pattern);
                if (match) {
                    Component = route.component;
                    break;
                }
            }
        }

        if (!Component) {
            Component = this.routes["/"];
        }

        const root = document.getElementById("root");

        if (!root) {
            console.error("Root element not found");
            return;
        }

        root.innerHTML = "";
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

AppStorage.init();
window.AppStorage = AppStorage;
window.app = new App();
