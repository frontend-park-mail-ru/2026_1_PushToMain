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
    console.log("Updated profile data, notifying subscribers...");
    this._subscribers.forEach((cb) => cb());
  },

  setProfileData(data: {
    name: string;
    surname: string;
    email: string;
    image_path: string;
  }) {
    this.name = data.name || "";
    this.surname = data.surname || "";
    this.email = data.email || "";
    this.image_path = data.image_path || "";
    this._lastUpdate = Date.now();
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
    } catch (e) {
      console.warn("Failed to save profile to localStorage", e);
    }

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
    } catch (e) {}
  },

  setImagePath(path: string) {
    this.image_path = path;
    this._lastUpdate = Date.now();
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
    return "../../assets/svg/Avatar.svg";
  },

  getMailActionData() {
    return this.replyData || this.forwardData;
  },
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
