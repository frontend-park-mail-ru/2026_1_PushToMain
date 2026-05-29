import Death13 from "@react/stands";
import { AppStorage } from "../../App";
import "./MailBox.scss";

class MailBox extends Death13.Component {
  handleSelect = (e: any) => {
    e.stopPropagation();
    const { id, onSelect } = this.props;
    const isChecked = e.target.checked;

    if (onSelect) {
      onSelect(id, isChecked);
    }
  };

  handleToggleRead = (e: any) => {
    e.stopPropagation();
    const { id, isRead, onToggleRead } = this.props;

    if (onToggleRead) {
      onToggleRead(id, !isRead);
    }
  };

  handleFavorite = (e: any) => {
    e.stopPropagation();
    this.props.onToggleFavorite?.(this.props.id, e.target.checked);
  };

  trimEmailAddress(email: string): string {
    return email.substring(0, email.lastIndexOf("@"));
  }

  t(key: string): string {
    return AppStorage.t(key);
  }

  render() {
    const {
      theme,
      sender_name,
      sender_surname,
      sender_email,
      receivers_emails,
      title,
      date,
      onClick,
      isSelected = false,
      pageMain,
      isRead,
      currentView,
      isFavorite,
      isAnonymous,
    } = this.props;

    const isMobile = window.innerWidth < 769;
    const isSentView = currentView === "sent";
    const isDraftsView = currentView === "drafts";
    const showSenderInfo = !isSentView && (sender_name || sender_email);
    const showFavoriteCheckbox = !isSentView && !isDraftsView;

    let sentToString = this.t("no_recipient");
    if (receivers_emails) {
      sentToString = "To: " + receivers_emails.join(", ");
    }

    return (
      <div
        className={`mail ${isSelected ? "selected" : ""} ${isRead ? "read" : ""} ${isFavorite ? "favorite" : ""}`}
        onClick={onClick}
      >
        <div className="checkbox-container">
          <input
            type="checkbox"
            className={`select-checkbox ${isSelected ? "selected" : ""}`}
            name="select-checkbox"
            checked={isSelected}
            onChange={this.handleSelect}
            onClick={(e: any) => e.stopPropagation()}
          />
          {showFavoriteCheckbox && (
            <input
              type="checkbox"
              className="favorites-checkbox"
              name="favorites-checkbox"
              checked={isFavorite}
              onChange={this.handleFavorite}
              onClick={(e: any) => e.stopPropagation()}
            />
          )}
        </div>
        <div className="mail-content">
          <div className="mail-content__left-part">
            <span
              className="mail-sender"
              title={this.t("from") + " " + sender_email}
            >
              {pageMain && (
                <input
                  type="checkbox"
                  name="read-checkbox"
                  className={`read-checkbox ${isRead ? "read" : ""}`}
                  checked={isRead}
                  onChange={this.handleToggleRead}
                  onClick={(e: any) => e.stopPropagation()}
                />
              )}
              {!pageMain && <div className="sent-checkbox"></div>}
              {isSentView || isDraftsView
                ? sentToString
                : showSenderInfo
                  ? sender_name
                    ? `${sender_name} ${sender_surname || ""}`.trim()
                    : this.trimEmailAddress(sender_email)
                  : isAnonymous
                    ? this.t("anonymous")
                    : this.t("no_recipient")}
            </span>
            {}
            {!isMobile ? (
              <div className="mail-text-content">
                <span className="mail-theme" data-mail-theme={this.props.id}>
                  {theme !== "" ? theme : this.t("empty_subject")}
                  <span className="mail-title"> - {title}</span>
                </span>
                <span className="mail-date">
                  <span className="mail-date__text">{date}</span>
                  <div className="mail-date__actions">
                    <div
                      className="action-btn action-btn--read"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        this.props.onToggleRead?.(
                          this.props.id,
                          !this.props.isRead,
                        );
                      }}
                      title={
                        this.props.isRead
                          ? this.t("mark_as_unread")
                          : this.t("mark_as_read")
                      }
                    />
                    <div
                      className="action-btn action-btn--trash"
                      onClick={(e: any) => {
                        e.stopPropagation();
                        this.props.onTrash?.(this.props.id);
                      }}
                      title={this.t("trash")}
                    />
                  </div>
                </span>
              </div>
            ) : (
              <div className="mail-text-content">
                <span className="mail-theme">
                  {theme !== "" ? theme : this.t("empty_subject")}
                </span>
                <span className="mail-title">{title}</span>
                <span className="mail-date">{date}</span>
              </div>
            )}
          </div>
          <div className="mail-content__right-part-mobile">
            <span className="mail-date-mobile">{date}</span>
            {showFavoriteCheckbox && (
              <input
                className="favorites-checkbox-mobile"
                type="checkbox"
                name="favorites-checkbox"
                checked={isFavorite}
                onChange={this.handleFavorite}
                onClick={(e: any) => e.stopPropagation()}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default MailBox;
