import "../styles/OfflineBanner.scss";

class OfflineManager {
  private banner: HTMLDivElement | null = null;

  constructor() {
    this.init();
  }

  private init() {
    if (!navigator.onLine) {
      this.showBanner();
    }

    window.addEventListener("online", () => {
      this.hideBanner();
    });

    window.addEventListener("offline", () => {
      this.showBanner();
    });
  }

  private showBanner() {
    if (this.banner) return;

    this.banner = document.createElement("div");
    this.banner.className = "offline-banner";
    this.banner.textContent = "Кажется, пропало соединение с интернетом...";
    document.body.insertBefore(this.banner, document.body.firstChild);
  }

  private hideBanner() {
    if (!this.banner) return;

    this.banner.remove();
    this.banner = null;
  }
}

new OfflineManager();
