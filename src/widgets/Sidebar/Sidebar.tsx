import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import "./Sidebar.scss";
import { AppStorage } from "../../App";
import SidebarProfile from "../../components/SidebarProfile/SidebarProfile";

class Sidebar extends Death13.Component {
  state: any = {
    isVisible: AppStorage.getSidebarDropdownVisible() || false,
    language: AppStorage.language,
    unReadCount: AppStorage.unReadCount,
    currentView: AppStorage.currentView || "inbox",
  };

  private unsubscribe: (() => void) | null = null;

  toggleDropdown = (event: any) => {
    event.preventDefault();
    const newState = !this.state.isVisible;
    this.setState({ isVisible: newState });
    AppStorage.setSidebarDropdownVisible(newState);

    const button = event.currentTarget;
    button.classList.toggle("active");
  };

  toggleSidebar = () => {
    const sidebar = document.querySelector(".sidebar");
    const sidebarOverlay = document.querySelector(".sidebar-overlay");
    if (sidebar) {
      sidebar.classList.toggle("open");
    }
    if (sidebarOverlay) {
      sidebarOverlay.classList.toggle("open");
    }
  };

  handleFolderClick = (folderId: number) => {
    AppStorage.setCurrentFolderId(folderId);
    AppStorage.setCurrentView("folder");
    window.app.handleRoute(`/folder/${folderId}`);
    this.toggleSidebar();
  };

  handleInboxClick = (event: any) => {
    event.preventDefault();
    AppStorage.setCurrentView("inbox");
    AppStorage.setCurrentFolderId(null);
    window.app.handleRoute("/");
    this.toggleSidebar();
  };

  handleDraftsClick = (event: any) => {
    event.preventDefault();
    AppStorage.setCurrentView("drafts");
    window.app.handleRoute("/drafts");
    this.toggleSidebar();
  };

  handleSentClick = (event: any) => {
    event.preventDefault();
    AppStorage.setCurrentView("sent");
    window.app.handleRoute("/sent");
    this.toggleSidebar();
  };

  handleFavoriteClick = (event: any) => {
    event.preventDefault();
    AppStorage.setCurrentView("favorite");
    window.app.handleRoute("/favorite");
    this.toggleSidebar();
  };

  handleSpamClick = (event: any) => {
    event.preventDefault();
    AppStorage.setCurrentView("spam");
    window.app.handleRoute("/spam");
    this.toggleSidebar();
  };

  handleTrashClick = (event: any) => {
    event.preventDefault();
    AppStorage.setCurrentView("trash");
    window.app.handleRoute("/trash");
    this.toggleSidebar();
  };

  handleAllMailClick = (event: any) => {
    event.preventDefault();
    AppStorage.setCurrentView("all-emails");
    AppStorage.setCurrentFolderId(null);
    window.app.handleRoute("/all-emails");
    this.toggleSidebar();
  };

  t(key: string): string {
    return AppStorage.t(key);
  }

  render() {
    const { isVisible, unReadCount, currentView } = this.state;
    const {
      isProfile = 0,
      backToMail,
      changeProfile,
      changePassword,
      newMail,
      name,
      surname,
      email,
      avatarUrl,
      handleSetting,
      handleFolder,
      handleSupport,
      selectedFolderId,
    } = this.props;

    const isMobile = window.innerWidth < 769;

    return (
      <div className="sidebar-widget">
        {isMobile && isProfile === 1 ? (
          <div
            className="sidebar-settings-back-button-mobile"
            onClick={backToMail}
          >
            {" "}
            <div className="arrow-left-icon" />
            <span>{this.t("back_to_mail")}</span>
          </div>
        ) : null}
        <div
          className="logo-container"
          onClick={(event: any) => {
            event.preventDefault();
            this.handleInboxClick(event);
          }}
        >
          <img src="../../assets/svg/Logo.svg" />
          <h1 className="logo__title">SMail</h1>
        </div>
        {isProfile !== 1 && (
          <div className="sidebar-content">
            <div className="main-button">
              <Button
                title={this.t("new_letter")}
                name="button-new-letter"
                onClick={(event: any) => {
                  event.preventDefault();
                  newMail();
                }}
              />
            </div>
            <div className="main-button-container">
              <Button
                name="button-inbox"
                title={this.t("inbox")}
                isSelect={currentView === "inbox" && !selectedFolderId}
                count={unReadCount}
                onClick={this.handleInboxClick}
              />

              <Button
                name="button-drafs"
                title={this.t("drafts")}
                isSelect={currentView === "drafts"}
                onClick={this.handleDraftsClick}
              />

              <Button
                name="button-sends"
                title={this.t("sent")}
                isSelect={currentView === "sent"}
                onClick={this.handleSentClick}
              />

              <Button
                name="button-favorites"
                title={this.t("starred")}
                isSelect={currentView === "favorite"}
                onClick={this.handleFavoriteClick}
              />
            </div>

            <div className="drop-down">
              <Button
                name="button-drop-down"
                title={isVisible ? this.t("hide") : this.t("yet")}
                onClick={this.toggleDropdown}
              />
              {isVisible && (
                <div className="extra-button-container">
                  <Button
                    name="button-spam"
                    title={this.t("spam")}
                    isSelect={currentView === "spam"}
                    onClick={this.handleSpamClick}
                  />
                  <Button
                    name="button-trash"
                    title={this.t("trash")}
                    isSelect={currentView === "trash"}
                    onClick={this.handleTrashClick}
                  />
                  {/*
                  <Button
                    name="button-all-letter"
                    title={this.t("all_letter")}
                    isSelect={currentView === "all-emails"}
                    onClick={this.handleAllMailClick}
                  />
                  */}
                  {AppStorage.folders &&
                    AppStorage.folders.map((folder: any) => (
                      <div key={folder.id} className="folder-item">
                        <Button
                          name="button-folder"
                          title={folder.name}
                          isSelect={selectedFolderId === folder.id}
                          onClick={(event: any) => {
                            event.preventDefault();
                            this.handleFolderClick(folder.id);
                          }}
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        )}
        {isProfile === 1 && (
          <div className="sidebar-content">
            <SidebarProfile
              name={name}
              surname={surname}
              email={email}
              avatarUrl={avatarUrl}
            />
            <div className="main-button-profile">
              <Button
                title={this.t("mailbox")}
                name="button-back-letter"
                onClick={(event: any) => {
                  event.preventDefault();
                  backToMail();
                }}
              />
            </div>
            <div
              className={`main-button-container ${isMobile ? "mobile-tiles" : ""}`}
            >
              <Button
                name="button-profile"
                title={this.t("personal_information")}
                isSelect={this.props.isPressProfile === 0}
                onClick={(event: any) => {
                  event.preventDefault();
                  changeProfile();
                  this.toggleSidebar();
                }}
              />
              <Button
                name="button-security"
                title={this.t("security")}
                isSelect={this.props.isPressProfile === 1}
                onClick={(event: any) => {
                  event.preventDefault();
                  changePassword();
                  this.toggleSidebar();
                }}
              />
              <Button
                name="button-settings"
                title={this.t("settings")}
                isSelect={this.props.isPressProfile === 2}
                onClick={(event: any) => {
                  event.preventDefault();
                  handleSetting();
                  this.toggleSidebar();
                }}
              />
              <Button
                name="button-folder"
                title={this.t("folder")}
                isSelect={this.props.isPressProfile === 3}
                onClick={(event: any) => {
                  event.preventDefault();
                  handleFolder();
                  this.toggleSidebar();
                }}
              />
              <Button
                name="button-support"
                title={this.t("support")}
                isSelect={this.props.isPressProfile === 4}
                onClick={(event: any) => {
                  event.preventDefault();
                  handleSupport();
                  this.toggleSidebar();
                }}
              />
            </div>
          </div>
        )}
        {isProfile === 0 ? (
          <SidebarProfile
            name={name}
            surname={surname}
            email={email}
            avatarUrl={avatarUrl}
            variant="mobile"
            textAlign="text-left"
          />
        ) : null}
      </div>
    );
  }
}

export default Sidebar;
