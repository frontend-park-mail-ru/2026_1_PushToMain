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
};

class App {
    private routes: Record<string, any>;
    private dynamicRoutes: Array<{ pattern: RegExp; component: any; paramName: string }>;
    private setPath!: (path: string) => void;

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
            if (this.setPath) {
                this.setPath(location.pathname);
            }
        });
    }

    handleRoute(path: string) {
        if (location.pathname === path) {
            return;
        }

        history.pushState({}, "", path);
        this.setPath(path);
    }

    getComponent(path: string) {
        let Component = this.routes[path];
        const props: any = {};

        if (!Component) {
            for (const route of this.dynamicRoutes) {
                const match = path.match(route.pattern);
                if (match) {
                    Component = route.component;
                    props[route.paramName] = match[1];
                    break;
                }
            }
        }

        if (!Component) {
            Component = this.routes["/"];
        }

        return { Component, props };
    }

    Router = () => {
        const [path, setPath] = Death13.useState(window.location.pathname);

        this.setPath = setPath;

        const { Component, props } = this.getComponent(path);

        return Death13.createElement(Component, props);
    };
}

declare global {
    interface Window {
        app: App;
        AppStorage: typeof AppStorage;
    }
}

const root = document.getElementById("root");

if (!root) {
    throw new Error("Root element not found");
}

AppStorage.init();
window.AppStorage = AppStorage;
window.app = new App();

Death13.render(Death13.createElement(window.app.Router, {}), root);
