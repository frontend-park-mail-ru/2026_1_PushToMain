import Death13 from "@react/stands";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegPage from "./pages/RegPage/RegPage";
import "../public/index.scss";
import MainPage from "./pages/MainPage/MainPage";
import "./utils/OfflineManager";

class App {
  private routes: Record<string, any>;

  constructor() {
    this.routes = {
      "/login": <LoginPage />,
      "/register": <RegPage />,
      "/": <MainPage />,
    };

    this.handleRoute(location.pathname);
    this.registerServiceWorker();
  }

  handleRoute(path: string) {
    const route = this.routes[path] || this.routes["/"];

    const root = document.getElementById("root");
    if (!root) return;

    root.innerHTML = "";

    Death13.render(route, root);

    history.pushState({}, "", path);
  }

  private registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          for (let registration of registrations) {
            registration.unregister();
          }
        })
        .then(() => {
          navigator.serviceWorker
            .register("/sw.js")
            .then((registration) => {
              console.log("ServiceWorker registered:", registration);
            })
            .catch((error) => {
              console.log("ServiceWorker registration failed:", error);
            });
        });
    }
  }
}

declare global {
  interface Window {
    app: App;
  }
}

window.app = new App();
