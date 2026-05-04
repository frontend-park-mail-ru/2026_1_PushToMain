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
import TrashPage from "./pages/TrashPage/TrashPage";
import FavoritePage from "./pages/FavoritePage/FavoritePage";
import SpamPage from "./pages/SpamPage/SpamPage";
import DraftsPage from "./pages/DraftsPage/DraftsPage";
import FolderPage from "./pages/FolderPage/FolderPage";

export const AppStorage = {
    sidebarDropdownVisible: false as boolean,
    currentView: "inbox" as string,
    draftData: null as any,
    folderChangeInstance: null as any,
    currentFolderId: null as any,
    _subscribers: [] as Array<() => void>,
    _lastUpdate: 0,
    unReadCount: 0,
    name: "",
    surname: "",
    email: "",
    is_male: true,
    birthDay: "",
    birthMonth: "",
    birthYear: "",
    image_path: "",
    folders: [] as Array<{
        id: number;
        name: string;
        emails: any[];
        createdAt: string;
        order: number;
    }>,
    openSettingsOnProfile: false,
    replyData: null as any,
    forwardData: null as any,
    theme: "light" as "light" | "dark",
    language: "ru" as "ru" | "en",

    translations: {
        ru: {
            //LoginPage
            //RegPage
            name: "Имя",
            surname: "Фамилия",
            email: "Почта",
            save: "Сохранить",
            change_avatar: "Сменить аватар",
            auth_title: "Авторизация",
            auth_title2: "Регистрация",
            auth_subtitle: "Твоя главная студенческая почта",
            enter: "Войти",
            register: "Зарегистрироваться",
            password: "Пароль",
            enter_email: "Введите почту",
            enter_password: "Введите пароль",
            enter_name: "Введите имя",
            enter_surname: "Введите фамилию",
            continue: "Продолжить",

            //MainPage
            back: "Назад",
            profile: "Профиль",
            exit: "Выйти",
            hello: "Здравствуйте",
            search: "Поиск в почте",
            of: "из",
            mark_as_read: "Сделать прочитанным",
            mark_as_unread: "Сделать непрочитанным",
            move_to_inbox: "Переместить во входящие",
            refresh: "Обновить",

            //ReadPage
            //SendPage
            reply: "Ответить",
            send: "Отправить",
            answer: "Переслать",
            subject: "Тема:",
            enter_subject: "Введите тему",
            to: "Кому:",

            //Error
            email_required: "Поле почты обязательно",
            email_invalid_format: "Почта должна быть вида *@smail.ru",
            email_max_length: "Почта должна быть не более 40 символов",
            password_required: "Поле пароля обязательно",
            password_min_length: "Пароль должен быть не менее 8 символов",
            name_required: "Поле имя обязательно",
            name_only_letters: "Имя должно состоять только из букв",
            surname_required: "Поле фамилия обязательно",
            surname_only_letters: "Фамилия должно состоять только из букв",

            // ProfilePage
            theme: "Тема",
            light_theme: "Светлая",
            dark_theme: "Темная",
            interface_language: "Язык интерфейса",
            english: "Английский",
            russian: "Русский",
            oldpassword: "Старый пароль",
            newpassword: "Старый пароль",
            gender: "Пол",
            male: "Мужской",
            female: "Женский",
            date_of_birth: "Дата рождения",
            day: "День",
            month: "Месяц",
            year: "Год",
            saved_successfully: "Успешно сохранено!",
            server_error: "Ошибка сервера!",
            add_a_folder: "Добавить папку...",

            //Sidebar
            new_letter: "Новое письмо",
            inbox: "Входящие",
            starred: "Избранные",
            sent: "Отправленные",
            drafts: "Черновики",
            spam: "Спам",
            trash: "Корзина",
            yet: "Ещё",
            hide: "Скрыть",
            all_letter: "Все письма",
            mailbox: "Почтовый ящик",
            settings: "Настройки",
            personal_information: "Личные данные",
            security: "Безопасность",
            interface: "Интерфейс",
            folder: "Папки",

            //Navigation
            back_to_settings: "Настройки",
            back_to_mail: "К почте",
        },
        en: {
            //LoginPage
            //RegPage
            name: "Name",
            surname: "Surname",
            email: "Email",
            save: "Save",
            change_avatar: "Change avatar",
            auth_title: "Authorization",
            auth_title2: "Registration",
            auth_subtitle: "Your best student mail",
            enter: "Login",
            register: "Register",
            password: "Password",
            enter_email: "Enter email",
            enter_password: "Enter password",
            enter_name: "Enter name",
            enter_surname: "Enter surname",
            continue: "Continue",

            //MainPage
            back: "Back",
            profile: "Profile",
            exit: "Exit",
            hello: "Hello",
            search: "Search in mail",
            of: "of",
            mark_as_read: "Mark as read",
            mark_as_unread: "Mark as unread",
            refresh: "Refresh",
            move_to_inbox: "Move to inbox",

            //ReadPage
            //SendPage
            reply: "Reply",
            send: "Send",
            answer: "Forward",
            subject: "Subject:",
            enter_subject: "Enter subject",
            to: "To:",

            //Error
            email_required: "Email field is required",
            email_invalid_format: "Email must be in format *@smail.ru",
            email_max_length: "Email must be no more than 40 characters",
            password_required: "Password field is required",
            password_min_length: "Password must be at least 8 characters",
            name_required: "Name field is required",
            name_only_letters: "Name must contain only letters",
            surname_required: "Surname field is required",
            surname_only_letters: "Surname must contain only letters",

            // ProfilePage
            theme: "Theme",
            light_theme: "Light",
            dark_theme: "Dark",
            interface_language: "Interface language",
            english: "English",
            russian: "Russian",
            oldpassword: "Old password",
            newpassword: "New password",
            gender: "Gender",
            male: "Male",
            female: "Female",
            date_of_birth: "Date of birth",
            day: "Day",
            month: "Month",
            year: "Year",
            saved_successfully: "Saved successfully!",
            server_error: "Server error!",
            add_a_folder: "Add a folder...",

            //Sidebar
            new_letter: "New mail",
            inbox: "Inbox",
            starred: "Starred",
            sent: "Sent",
            drafts: "Drafts",
            spam: "Spam",
            trash: "Trash",
            yet: "More",
            hide: "Less",
            all_letter: "All emails",
            mailbox: "Mailbox",
            settings: "Settings",
            personal_information: "Personal info",
            security: "Security",
            interface: "Interface",
            folder: "Folder",

            //Navigation
            back_to_settings: "Settings",
            back_to_mail: "To mail",
        },
    },

    init() {
        try {
            const saved = localStorage.getItem("userProfile");
            if (saved) {
                const data = JSON.parse(saved);
                this.name = data.name || "";
                this.surname = data.surname || "";
                this.email = data.email || "";
                this.image_path = data.image_path || "";
                this.is_male = data.is_male ?? true;
                this._lastUpdate = data._lastUpdate || Date.now();
            }

            const savedCount = localStorage.getItem("unReadCount");
            if (savedCount !== null) {
                this.unReadCount = parseInt(savedCount, 10) || 0;
            }

            const savedFolders = localStorage.getItem("folders");
            if (savedFolders) {
                try {
                    this.folders = JSON.parse(savedFolders);
                } catch {
                    this.folders = [];
                }
            } else {
                this.folders = [];
            }

            const savedTheme = localStorage.getItem("theme") as "light" | "dark";
            if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
                this.theme = savedTheme;
            } else {
                const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                this.theme = prefersDark ? "dark" : "light";
            }

            const savedLanguage = localStorage.getItem("language") as "ru" | "en";
            if ((savedLanguage && savedLanguage === "ru") || savedLanguage === "en") {
                this.language = savedLanguage;
            } else {
                const browserLang = navigator.language;
                if (browserLang === "en") this.language = "en";
                else this.language = "ru";
            }

            document.documentElement.setAttribute("data-theme", this.theme);
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

    t(key: string): string {
        const translation = this.translations[this.language]?.[key as keyof typeof this.translations.ru];
        return translation || key;
    },

    setProfileData(
        data: {
            name: string;
            surname: string;
            email: string;
            image_path: string;
            is_male: boolean;
            birthDay: string;
            birthMonth: string;
            birthYear: string;
        } | null,
    ) {
        if (!data) {
            console.warn("setProfileData called with null/undefined data");
            return;
        }

        this.name = data.name || "";
        this.surname = data.surname || "";
        this.email = data.email || "";
        this.is_male = data.is_male ?? true;
        this.image_path = data.image_path || "";
        this.birthDay = data.birthDay;
        this.birthMonth = data.birthMonth;
        this.birthYear = data.birthYear;
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
                    is_male: this.is_male,
                    image_path: this.image_path,
                    birthDay: this.birthDay,
                    birthMonth: this.birthMonth,
                    birthYear: this.birthYear,
                    _lastUpdate: this._lastUpdate,
                }),
            );
            localStorage.setItem("folders", JSON.stringify(this.folders));
            localStorage.setItem("language", this.language);
            localStorage.setItem("unReadCount", this.unReadCount.toString());
            localStorage.setItem("theme", this.theme);
        } catch {}
    },

    setImagePath(path: string) {
        this.image_path = path;
        this._lastUpdate = Date.now();
        this._saveToStorage();
        this._notify();
    },

    setFolders(folders: any[]) {
        this.folders = folders;
        localStorage.setItem("folders", JSON.stringify(folders));
        this._notify();
    },

    setCurrentFolderId(folderId: number | null) {
        AppStorage.currentFolderId = folderId;
    },

    getCurrentFolderId(): number | null {
        return AppStorage.currentFolderId;
    },

    setUnReadCount(count: number) {
        this.unReadCount = count;
        this._saveToStorage();
        this._notify();
    },

    setCurrentView(view: string) {
        AppStorage.currentView = view;
    },

    getCurrentView(): string {
        const view = AppStorage.currentView;
        AppStorage.currentView = "inbox";
        return view;
    },

    setDraftData(data: any) {
        AppStorage.draftData = data;
    },

    getDraftData(): any {
        const data = AppStorage.draftData;
        AppStorage.draftData = null;
        return data;
    },

    learDraftData() {
        AppStorage.draftData = null;
    },

    setLanguage(lang: "ru" | "en") {
        this.language = lang;
        localStorage.setItem("language", lang);
        this._notify();
    },

    toggleTheme() {
        this.theme = this.theme === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", this.theme);
        this._saveToStorage();
        this._notify();
    },

    setTheme(theme: "light" | "dark") {
        if (this.theme !== theme) {
            this.theme = theme;
            document.documentElement.setAttribute("data-theme", theme);
            this._saveToStorage();
            this._notify();
        }
    },

    getTheme() {
        return this.theme;
    },

    setOpenSettingsOnProfile(value: boolean) {
        this.openSettingsOnProfile = value;
        this._notify();
    },

    getOpenSettingsOnProfile() {
        const value = this.openSettingsOnProfile;
        this.openSettingsOnProfile = false;
        return value;
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

    setSidebarDropdownVisible(visible: boolean) {
        AppStorage.sidebarDropdownVisible = visible;
        AppStorage._notify();
    },

    getSidebarDropdownVisible(): boolean {
        return AppStorage.sidebarDropdownVisible;
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
    private dynamicRoutes: Array<{
        pattern: RegExp;
        component: any;
        paramName: string;
    }>;

    private setPath!: (path: string) => void;
    public previousPath: string = "";
    private currentPath: string = window.location.pathname;

    constructor() {
        this.routes = {
            "/login": LoginPage,
            "/register": RegPage,
            "/profile": ProfilePage,
            "/send": SendEmailPage,
            "/sent": SentPage,
            "/": MainPage,
            "/trash": TrashPage,
            "/drafts": DraftsPage,
            "/spam": SpamPage,
            "/favorite": FavoritePage,
            "/folder": FolderPage
        };

        this.dynamicRoutes = [
            {
                pattern: /^\/read\/(\d+)$/,
                component: ReadEmailPage,
                paramName: "id",
            },
            {
                pattern: /^\/folder\/(\d+)$/,
                component: FolderPage,
                paramName: "folderId",
            },
        ];

        window.addEventListener("popstate", () => {
            this.handleRoute(window.location.pathname, false);
        });
    }

    handleRoute(path: string, push: boolean = true) {
        if (this.currentPath === path) return;

        if (push) {
            history.pushState({}, "", path);
        }

        this.previousPath = this.currentPath;
        this.currentPath = path;

        this.setPath(this.currentPath);
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
        const [path, setPath] = Death13.useState(this.currentPath);

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
