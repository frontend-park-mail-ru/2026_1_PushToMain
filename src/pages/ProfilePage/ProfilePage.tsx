import Death13 from "@react/stands";
import "./ProfilePage.scss";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import UploadAvatar from "../../components/UploadAvatar/UploadAvatar";
import Textarea from "../../components/Textarea/Textarea";
import { validation } from "../../utils/validation";
import { changePassword, getProfile, changeProfile } from "../../api/ApiAuth";
import { getMyTickets, getMessages, answerTicket } from "../../api/ApiSupport";
import { AppStorage } from "../../App";
import ProfileModal from "../../widgets/ProfileModal/ProfileModal";
import SelectDate from "../../components/SelectDate/SelectDate";
import FolderChange from "../../widgets/FolderChange/FolderChange";
import NotificationManager from "../../widgets/NotificationManager/NotificationManager";
import SupportModal from "../../widgets/SupportModal/SupportModal";
import { requestNotificationPermission } from "../../utils/emailNotifications";

class ProfilePage extends Death13.Component {
  private unsubscribe: (() => void) | null = null;
  pollingInterval: any = null;

  constructor(props: any) {
    super(props);

    this.unsubscribe = AppStorage.subscribe(() => {
      this.setState({ language: AppStorage.language });
    });

    this.loadProfile();
    this.syncTabFromUrl();

    const shouldOpenSettings = AppStorage.getOpenSettingsOnProfile();

    this.state = {
      errors: {},
      modals: [],
      touched: {},
      name: AppStorage.name,
      surname: AppStorage.surname,
      email: AppStorage.email,
      is_male: AppStorage.is_male,
      folders: AppStorage.folders,
      oldPassword: "",
      newPassword: "",
      profileState: shouldOpenSettings ? 2 : 0,
      avatarKey: 0,
      avatarUrl: AppStorage.getAvatarUrl(),
      isModalOpen: false,
      isConfirm: false,
      isStatus: false,
      language: AppStorage.language,
      birthDay: AppStorage.birthDay,
      birthMonth: AppStorage.birthMonth,
      birthYear: AppStorage.birthYear,
      isFolderEditMode: false,
      message: null,
      supportTickets: [],
      selectedTicketId: null,
      chatMessages: [],
      chatInputText: "",
      showNewTicketForm: false,
      newTicketSubject: "",
      newTicketMessage: "",
      mobileChatOpen: false,
    };

    this.syncTabFromUrl();
  }

  componentDidMount() {
    window.addEventListener("popstate", this.syncTabFromUrl);
  }

  componentWillUnmount() {
    window.removeEventListener("popstate", this.syncTabFromUrl);
    this.stopPolling();
  }

  syncTabFromUrl = () => {
    const match = window.location.pathname.match(/\/profile\/(.+)$/);
    if (match) {
      const tab = match[1];
      switch (tab) {
        case "personal":
          this.setState({ profileState: 0 });
          break;
        case "password":
          this.setState({ profileState: 1 });
          break;
        case "interface":
          this.setState({ profileState: 2 });
          break;
        case "folders":
          this.setState({ profileState: 3 });
          break;
        default:
          this.setState({ profileState: 0 });
      }
    } else if (window.location.pathname === "/profile") {
      this.setState({ profileState: 0 });
    }
  };

  loadProfile = async () => {
    const data = await getProfile();
    if (data === null) {
      window.app.handleRoute("/login");
    } else {
      let birthDay = "";
      let birthMonth = "";
      let birthYear = "";
      if (data.birthdate && typeof data.birthdate === "string") {
        const parts = data.birthdate.split("T")[0].split("-");
        birthYear = parts[0];
        birthMonth = String(parseInt(parts[1]));
        birthDay = String(parseInt(parts[2]));
      }

      AppStorage.setProfileData({
        is_male: data.is_male ?? true,
        name: data.name || "",
        surname: data.surname || "",
        email: data.email || "",
        image_path: data.image_path || "",
        birthDay: birthDay,
        birthMonth: birthMonth,
        birthYear: birthYear,
        anonymousEnabled: data.accept_anonymous,
      });
      this.setState({
        name: data.name || "",
        surname: data.surname || "",
        email: data.email || "",
        is_male: data.is_male ?? true,
        avatarUrl: AppStorage.getAvatarUrl(),
        isStatus: false,
        birthDay: birthDay,
        birthMonth: birthMonth,
        birthYear: birthYear,
      });
    }
  };

  validateField = (field: string, value: string) => {
    const data: any = {
      email: field === "email" ? value : this.state.email,
      newPassword: field === "newPassword" ? value : this.state.newPassword,
      oldPassword: field === "oldPassword" ? value : this.state.oldPassword,
      name: field === "name" ? value : this.state.name,
      surname: field === "surname" ? value : this.state.surname,
    };

    const result = validation(data, this.t);

    if (!result.isValid) {
      const fieldError = result.errors.find((err: any) => err.field === field);
      if (fieldError) {
        return fieldError.message;
      }
    }
    return undefined;
  };

  handleAvatarUpdate = () => {
    this.setState({
      avatarKey: this.state.avatarKey + 1,
      avatarUrl: AppStorage.getAvatarUrl(),
    });
    NotificationManager.show(true);
  };

  async handleChangePassword(event: any) {
    event.preventDefault();
    try {
      const response = await changePassword({
        old_password: this.state.oldPassword,
        new_password: this.state.newPassword,
      });

      if (response) {
        this.setState({
          oldPassword: "",
          newPassword: "",
        });
        NotificationManager.show(true);
      } else {
        NotificationManager.show(false, "passwords_dont_match");
      }
    } catch {
      NotificationManager.show(false);
    }
  }

  async handleChangeProfileData(event: any) {
    const { birthDay, birthMonth, birthYear } = this.state;

    let birthDate = null;

    if (
      birthYear?.length > 0 &&
      birthMonth?.length > 0 &&
      birthDay?.length > 0
    ) {
      const month = birthMonth.padStart(2, "0");
      const day = birthDay.padStart(2, "0");
      birthDate = `${birthYear}-${month}-${day}T00:00:00Z`;
    }

    event.preventDefault();
    try {
      const payload: any = {
        name: this.state.name,
        surname: this.state.surname,
        is_male: this.state.is_male,
        email: this.state.email,
      };

      if (birthDate) {
        payload.birthdate = birthDate;
      }
      const response = await changeProfile(payload);
      if (response) {
        const currentImagePath = AppStorage.image_path;
        AppStorage.setProfileData({
          name: this.state.name,
          surname: this.state.surname,
          email: this.state.email,
          is_male: this.state.is_male,
          image_path: currentImagePath,
          birthDay: birthDay,
          birthMonth: birthMonth,
          birthYear: birthYear,
          anonymousEnabled: AppStorage.anonymousEnabled,
        });
        this.setState({
          is_male: this.state.is_male,
          name: this.state.name,
          surname: this.state.surname,
          birthDay: birthDay,
          birthMonth: birthMonth,
          birthYear: birthYear,
        });
        NotificationManager.show(true);
      } else {
        NotificationManager.show(false);
      }
    } catch (error) {
      console.error("Ошибка изменения профиля:", error);
      this.setState({ isConfirm: true, isStatus: false });
    }
  }

  handleInputChange = (field: string, value: string) => {
    const error = this.validateField(field, value);

    this.setState({
      [field]: value,
      touched: {
        ...this.state.touched,
        [field]: true,
      },
      errors: {
        ...this.state.errors,
        [field]: error,
      },
    });
  };

  shouldShowSuccess = (field: string): boolean => {
    const value = this.state[field];
    const error = this.state.errors[field];
    const isTouched = this.state.touched[field];

    return isTouched && value && !error;
  };

  handleGenderChange = (value: boolean) => {
    this.setState({ is_male: value });
  };

  handleLogout = async (event: Event) => {
    event.preventDefault();
    this.setState({ isModalOpen: false, isConfirm: false });
    window.app.handleRoute("/login");
  };

  handleBackToMail = () => {
    this.setState({ isModalOpen: false, isConfirm: false });
    window.app.handleRoute("/");
  };

  handleAvatar = (event: Event) => {
    event.stopPropagation();
    event.preventDefault();
    this.setState({ isModalOpen: true });
  };

  handleCloseModal = () => {
    this.setState({ isModalOpen: false });
  };

  handleCloseAlert = () => {
    this.setState({ isConfirm: false, message: null });
  };

  handleProfileClick = () => {
    this.setState({ isModalOpen: false, isConfirm: false, profileState: 0 });
    window.app.handleRoute("/profile/personal");
  };

  handleSettingsClick = () => {
    this.setState({ isModalOpen: false, isConfirm: false, profileState: 2 });
    window.app.handleRoute("/profile/interface");
  };

  handleChangeProfile = () => {
    this.setState({ profileState: 0 });
    this.stopPolling();
    window.app.handleRoute("/profile/personal", true);
  };

  handleChangePasswordState = () => {
    this.setState({ profileState: 1 });
    this.stopPolling();
    window.app.handleRoute("/profile/password", true);
  };

  handleSetting = () => {
    this.setState({ profileState: 2 });
    this.stopPolling();
    window.app.handleRoute("/profile/interface", true);
  };

  handleFolder = () => {
    this.setState({ profileState: 3 });
    this.stopPolling();
    window.app.handleRoute("/profile/folders", true);
  };

  handleToggleFolderEditMode = async () => {
    if (this.state.isFolderEditMode) {
      if (AppStorage.folderChangeInstance) {
        await AppStorage.folderChangeInstance.saveAllPendingChanges();
      }
    }
    this.setState({ isFolderEditMode: !this.state.isFolderEditMode });
  };

  handleDateChange = (date: { day: string; month: string; year: string }) => {
    this.setState({
      birthDay: date.day,
      birthMonth: date.month,
      birthYear: date.year,
    });
  };

  handleBackToSettings = () => {
    const sidebar = document.querySelector(".sidebar");
    if (sidebar) {
      sidebar.classList.toggle("open");
    }
  };

  handleEnableNotifs = () => {
    AppStorage.setNotificationsEnabled(true);
    requestNotificationPermission();
    NotificationManager.show(true, "notifications_enabled");
  };

  handleDisableNotifs = () => {
    AppStorage.setNotificationsEnabled(false);
    NotificationManager.show(true, "notifications_disabled");
  };

  handleEnableAnons = async () => {
    await changeProfile({
      name: this.state.name,
      surname: this.state.surname,
      is_male: this.state.is_male,
      accept_anonymous: true,
    });
    AppStorage.setAnonymousEnabled(true);
    NotificationManager.show(true, "anonymous_enabled");
  };

  handleDisableAnons = async () => {
    await changeProfile({
      name: this.state.name,
      surname: this.state.surname,
      is_male: this.state.is_male,
      accept_anonymous: false,
    });
    AppStorage.setAnonymousEnabled(false);
    NotificationManager.show(true, "anonymous_disabled");
  };

  handleSupport = () => {
    this.startPolling();
    this.setState({ profileState: 4 });
    window.app.handleRoute("/profile/support", true);
  };

  handleNewTicket = () => {
    const supportModal = document.querySelector(".support-modal");
    if (supportModal) {
      supportModal.classList.toggle("show");
    }
  };

  startPolling = () => {
    this.fetchSupportTickets();
    this.pollingInterval = setInterval(() => {
      this.fetchSupportTickets();
      if (this.state.selectedTicketId) {
        this.fetchTicketMessages(this.state.selectedTicketId);
      }
    }, 10000);
  };

  stopPolling = () => {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  };

  fetchSupportTickets = async () => {
    const tickets = await getMyTickets();
    this.setState({ supportTickets: tickets });
  };

  fetchTicketMessages = async (ticketId: number) => {
    const messages = await getMessages(ticketId);
    this.setState({ chatMessages: messages });
  };

  handleSelectTicket = (ticketId: number) => {
    this.setState({ selectedTicketId: ticketId, mobileChatOpen: true });
    this.fetchTicketMessages(ticketId);
  };

  handleBackToTicketList = () => {
    this.setState({ selectedTicketId: null, mobileChatOpen: false });
  };

  handleChatInputChange = (e: any) => {
    this.setState({ chatInputText: e.target.value });
  };

  handleSendMessage = async () => {
    const { chatInputText, selectedTicketId, chatMessages } = this.state;
    const resp = await answerTicket(selectedTicketId, chatInputText);
    if (resp) {
      this.setState({
        chatInputText: "",
        chatMessages: [...chatMessages, resp],
      });
    }
  };

  handleCreateTicket = () => {
    const { newTicketSubject, newTicketMessage, supportTickets } = this.state;
    if (!newTicketSubject.trim() || !newTicketMessage.trim()) return;

    const newTicket = {
      id: Date.now(),
      subject: newTicketSubject,
      status: "open",
      lastMessagePreview:
        newTicketMessage.slice(0, 50) +
        (newTicketMessage.length > 50 ? "..." : ""),
    };
    const initialMsg = {
      id: Date.now(),
      text: newTicketMessage,
      timestamp: new Date().toISOString(),
      is_admin: false,
    };

    this.setState({
      supportTickets: [...supportTickets, newTicket],
      showNewTicketForm: false,
      newTicketSubject: "",
      newTicketMessage: "",
      selectedTicketId: newTicket.id,
      chatMessages: [initialMsg],
    });
  };

  getTicketStatus = (ticket: any) => {
    const status = ticket.status;
    if (status === "open") return "открыт";
    if (status === "in_progress") return "в обработке";
    if (status === "closed") return "закрыт";
    return status;
  };

  t(key: string): string {
    return AppStorage.t(key);
  }

  render() {
    const {
      errors,
      oldPassword,
      newPassword,
      name,
      surname,
      profileState,
      avatarKey,
      avatarUrl,
      isModalOpen,
      is_male,
      supportTickets,
      selectedTicketId,
      chatMessages,
      chatInputText,
      showNewTicketForm,
      newTicketSubject,
      newTicketMessage,
      mobileChatOpen,
    } = this.state;

    const isMobile = window.innerWidth < 769;

    return (
      <div className="profile-page" onClick={() => this.handleCloseModal()}>
        <SupportModal />
        <aside className={`sidebar ${isMobile ? "open" : ""}`}>
          <Sidebar
            isProfile={1}
            isPressProfile={profileState}
            avatarUrl={AppStorage.getAvatarUrl()}
            name={AppStorage.name}
            surname={AppStorage.surname}
            email={AppStorage.email}
            backToMail={this.handleBackToMail}
            changeProfile={this.handleChangeProfile}
            changePassword={this.handleChangePasswordState}
            handleSetting={this.handleSetting}
            handleFolder={this.handleFolder}
            handleSupport={this.handleSupport}
            newMail={() => {}}
          />
        </aside>

        <div className="right-part">
          {!isMobile ? (
            <div className="top-bar">
              <div className="search-bar"></div>
              <div className="top-right-menu">
                <Button
                  svg={AppStorage.getAvatarUrl()}
                  name="avatar"
                  help="Аккаунт"
                  onClick={this.handleAvatar}
                />
              </div>
            </div>
          ) : null}
          <div className="profile-content-area">
            {profileState === 0 && (
              <div className="profile-container">
                {isMobile ? (
                  <div
                    className="settings-back-to-menu-button-mobile"
                    onClick={this.handleBackToSettings}
                  >
                    {" "}
                    <div className="arrow-left-icon" />
                    <span>{this.t("profile")}</span>
                  </div>
                ) : null}
                <h1>{this.t("personal_information")}</h1>
                <div className="profile-content">
                  <div className="profile-avatar">
                    <UploadAvatar
                      image={avatarUrl}
                      onAvatarUpdate={this.handleAvatarUpdate}
                      key={avatarKey}
                    />
                  </div>
                  <form action="" className="profile-form">
                    <Input
                      type="text"
                      placeholder={this.t("enter_name")}
                      input_title={this.t("name")}
                      name="name"
                      value={name}
                      success={this.shouldShowSuccess("name")}
                      error={errors.name}
                      onInput={(e: any) => {
                        this.handleInputChange("name", e.target.value);
                      }}
                    />
                    <Input
                      type="text"
                      placeholder={this.t("enter_surname")}
                      input_title={this.t("surname")}
                      name="surname"
                      value={surname}
                      success={this.shouldShowSuccess("surname")}
                      error={errors.surname}
                      onInput={(e: any) => {
                        this.handleInputChange("surname", e.target.value);
                      }}
                    />
                    <SelectDate
                      onChange={this.handleDateChange}
                      birthDay={this.state.birthDay}
                      birthMonth={this.state.birthMonth}
                      birthYear={this.state.birthYear}
                    />
                    <div className="profile__checkbox">
                      <span>{this.t("gender")}</span>
                      <div className="checkbox-actions">
                        <div className="checkbox-form">
                          <Input
                            id="male"
                            type="radio"
                            name="radio-gender"
                            checked={is_male === true}
                            onInput={() => this.handleGenderChange(true)}
                          />
                          <label for="male">{this.t("male")}</label>
                        </div>

                        <div className="checkbox-form">
                          <Input
                            id="female"
                            type="radio"
                            name="radio-gender"
                            checked={is_male !== true}
                            onInput={() => this.handleGenderChange(false)}
                          />
                          <label for="female">{this.t("female")}</label>
                        </div>
                      </div>
                    </div>

                    <div className="profile-actions">
                      <Button
                        title={this.t("save")}
                        name="change-profile"
                        onClick={(event: any) => {
                          event.preventDefault();
                          this.handleChangeProfileData(event);
                        }}
                      />
                      {!isMobile ? (
                        <Button
                          title={this.t("back")}
                          name="back-to-mail"
                          onClick={(event: any) => {
                            event.preventDefault();
                            this.handleBackToMail();
                          }}
                        />
                      ) : null}
                    </div>
                  </form>
                </div>
              </div>
            )}

            {profileState === 1 && (
              <div className="profile-security">
                {isMobile ? (
                  <div
                    className="settings-back-to-menu-button-mobile"
                    onClick={this.handleBackToSettings}
                  >
                    {" "}
                    <div className="arrow-left-icon" />
                    <span>{this.t("profile")}</span>
                  </div>
                ) : null}
                <h1>{this.t("security")}</h1>
                <div className="profile-content">
                  <form action="" className="profile-form">
                    <Input
                      type="password"
                      placeholder={this.t("enter_password")}
                      input_title={this.t("oldpassword")}
                      name="oldPassword"
                      error={errors.oldPassword}
                      value={oldPassword}
                      onInput={(e: any) => {
                        this.handleInputChange("oldPassword", e.target.value);
                      }}
                    />
                    <Input
                      type="password"
                      placeholder={this.t("enter_password")}
                      input_title={this.t("newpassword")}
                      name="newPassword"
                      error={errors.newPassword}
                      value={newPassword}
                      onInput={(e: any) => {
                        this.handleInputChange("newPassword", e.target.value);
                      }}
                    />
                    <div className="profile-actions">
                      <Button
                        title={this.t("save")}
                        name="change-password"
                        onClick={(event: any) => {
                          this.handleChangePassword(event);
                        }}
                      />
                      {!isMobile ? (
                        <Button
                          title={this.t("back")}
                          name="back-to-mail"
                          onClick={(event: any) => {
                            event.preventDefault();
                            this.handleBackToMail();
                          }}
                        />
                      ) : null}
                    </div>
                  </form>
                </div>
              </div>
            )}
            {profileState === 2 && (
              <div className="profile-security">
                {isMobile ? (
                  <div
                    className="settings-back-to-menu-button-mobile"
                    onClick={this.handleBackToSettings}
                  >
                    {" "}
                    <div className="arrow-left-icon" />
                    <span>{this.t("profile")}</span>
                  </div>
                ) : null}
                <h1>{this.t("settings")}</h1>
                <div className="profile-content">
                  <form action="" className="profile-form">
                    <div className="profile__checkbox">
                      <span>{this.t("theme")}</span>
                      <div className="checkbox-actions">
                        <div className="checkbox-form">
                          <Input
                            id="dark"
                            type="radio"
                            name="radio-theme"
                            checked={AppStorage.theme === "dark"}
                            onChange={() => AppStorage.setTheme("dark")}
                          />
                          <label for="dark">{this.t("dark_theme")}</label>
                        </div>
                        <div className="checkbox-form">
                          <Input
                            id="light"
                            type="radio"
                            name="radio-theme"
                            checked={AppStorage.theme === "light"}
                            onChange={() => AppStorage.setTheme("light")}
                          />
                          <label for="light">{this.t("light_theme")}</label>
                        </div>
                      </div>
                    </div>
                    <div className="profile__checkbox">
                      <span>{this.t("interface_language")}</span>
                      <div className="checkbox-actions">
                        <div className="checkbox-form">
                          <Input
                            id="ru"
                            type="radio"
                            name="radio-language"
                            checked={AppStorage.language === "ru"}
                            onChange={() => AppStorage.setLanguage("ru")}
                          />
                          <label for="ru">{this.t("russian")}</label>
                        </div>
                        <div className="checkbox-form">
                          <Input
                            id="en"
                            type="radio"
                            name="radio-language"
                            checked={AppStorage.language === "en"}
                            onChange={() => AppStorage.setLanguage("en")}
                          />
                          <label for="en">{this.t("english")}</label>
                        </div>
                      </div>
                    </div>
                    <div className="profile__checkbox">
                      <span>{this.t("notifications")}</span>
                      <div className="checkbox-actions">
                        <div className="checkbox-form">
                          <Input
                            id="notif-on"
                            type="radio"
                            name="radio-notifications"
                            checked={AppStorage.notificationsEnabled === true}
                            onChange={() => this.handleEnableNotifs()}
                          />
                          <label for="notif-on">{this.t("on")}</label>
                        </div>
                        <div className="checkbox-form">
                          <Input
                            id="notif-off"
                            type="radio"
                            name="radio-notifications"
                            checked={AppStorage.notificationsEnabled === false}
                            onChange={() => this.handleDisableNotifs()}
                          />
                          <label for="notif-off">{this.t("off")}</label>
                        </div>
                      </div>
                    </div>
                    <div className="profile__checkbox">
                      <span>{this.t("enable_anonymous")}</span>
                      <div className="checkbox-actions">
                        <div className="checkbox-form">
                          <Input
                            id="anon-on"
                            type="radio"
                            name="radio-anonymous"
                            checked={AppStorage.anonymousEnabled === true}
                            onChange={() => this.handleEnableAnons()}
                          />
                          <label for="anon-on">{this.t("allow")}</label>
                        </div>
                        <div className="checkbox-form">
                          <Input
                            id="anon-off"
                            type="radio"
                            name="radio-anonymous"
                            checked={AppStorage.anonymousEnabled === false}
                            onChange={() => this.handleDisableAnons()}
                          />
                          <label for="anon-off">{this.t("not_allow")}</label>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {profileState === 3 && (
              <div className="profile-folder">
                {isMobile ? (
                  <div
                    className="settings-back-to-menu-button-mobile"
                    onClick={this.handleBackToSettings}
                  >
                    <div className="arrow-left-icon" />
                    <span>{this.t("profile")}</span>
                  </div>
                ) : null}
                <h1>{this.t("folder")}</h1>

                <div className="profile-content">
                  <form action="" className="profile-form">
                    <FolderChange
                      isEditMode={this.state.isFolderEditMode}
                      showConfirmationModal={NotificationManager.show}
                    />
                  </form>
                </div>
              </div>
            )}
            {profileState === 4 && (
              <div className="profile-support">
                {/* Mobile back button – same as other panels */}
                {isMobile ? (
                  <div
                    className="settings-back-to-menu-button-mobile"
                    onClick={this.handleBackToSettings}
                  >
                    <div className="arrow-left-icon" />
                    <span>{this.t("profile")}</span>
                  </div>
                ) : null}

                <div
                  className={`support-wrapper ${isMobile ? "mobile" : ""} ${mobileChatOpen ? "chat-open" : ""}`}
                >
                  <div className="support-container">
                    {/* ---------- TICKETS PANEL ---------- */}
                    <div className="support-tickets-panel">
                      <div className="support-tickets-header">
                        <h2>Поддержка</h2>
                        <Button
                          svg="../../assets/svg/Compose.svg"
                          className="small-text"
                          name="new-ticket"
                          onClick={this.handleNewTicket}
                        />
                      </div>
                      {/* new ticket form (unchanged) */}
                      {showNewTicketForm && (
                        <div className="new-ticket-form">
                          <Input
                            type="text"
                            placeholder="Subject"
                            value={newTicketSubject}
                            onInput={(e: any) =>
                              this.setState({
                                newTicketSubject: e.target.value,
                              })
                            }
                          />
                          <textarea
                            placeholder="Describe your issue..."
                            value={newTicketMessage}
                            onChange={(e: any) =>
                              this.setState({
                                newTicketMessage: e.target.value,
                              })
                            }
                            rows={4}
                          />
                          <div className="form-actions">
                            <Button
                              title="Create"
                              name="create-ticket"
                              onClick={this.handleCreateTicket}
                            />
                            <Button
                              title="Cancel"
                              name="cancel-ticket"
                              onClick={() =>
                                this.setState({
                                  showNewTicketForm: false,
                                  newTicketSubject: "",
                                  newTicketMessage: "",
                                })
                              }
                            />
                          </div>
                        </div>
                      )}

                      <ul className="tickets-list">
                        {supportTickets.map((ticket: any) => (
                          <li
                            key={ticket.id}
                            className={`ticket-item ${selectedTicketId === ticket.ticket_id ? "active" : ""}`}
                            onClick={() =>
                              this.handleSelectTicket(ticket.ticket_id)
                            }
                          >
                            <div className="ticket-subject">
                              {ticket.header}
                            </div>
                            <div
                              className="ticket-status"
                              data-status={this.getTicketStatus(ticket)}
                            >
                              {this.getTicketStatus(ticket)}
                            </div>
                            <div className="ticket-preview">
                              {ticket.lastMessagePreview}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* ---------- CHAT PANEL ---------- */}
                    <div className="support-chat-panel">
                      {/* Mobile back arrow */}
                      {isMobile && selectedTicketId && (
                        <div
                          className="chat-mobile-back"
                          onClick={this.handleBackToTicketList}
                        >
                          <div className="arrow-left-icon" />
                          <span>Back to tickets</span>
                        </div>
                      )}

                      {!selectedTicketId ? (
                        <div className="chat-empty">
                          Выберите тикет для просмотра
                        </div>
                      ) : (
                        <>
                          <div className="chat-messages">
                            {chatMessages.map((msg: any) => (
                              <div
                                key={msg.id}
                                className={`message ${msg.is_admin ? "admin" : "user"}`}
                              >
                                <div className="message-bubble">
                                  <div className="message-text">{msg.text}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="chat-input-area">
                            <Textarea
                              type="text"
                              className="chat-input"
                              placeholder="Введите сообщение..."
                              value={chatInputText}
                              onInput={this.handleChatInputChange}
                            />
                            <Button
                              title="Send"
                              name="send-message"
                              onClick={this.handleSendMessage}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <ProfileModal
            isOpen={isModalOpen}
            onClose={this.handleCloseModal}
            onProfileClick={this.handleProfileClick}
            onSettingsClick={this.handleSettingsClick}
            onLogout={this.handleLogout}
          />
        </div>
      </div>
    );
  }
}

export default ProfilePage;
