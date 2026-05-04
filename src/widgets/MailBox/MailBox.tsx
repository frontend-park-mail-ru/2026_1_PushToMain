import Death13 from "@react/stands";
import "./MailBox.scss";

class MailBox extends Death13.Component {
  state: any = {
    isFavorite: false,
  };

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
    this.setState({ isFavorite: e.target.checked });
  };

  render() {
    const {
      theme,
      sender_name,
      sender_surname,
      sender_email,
      title,
      date,
      onClick,
      isSelected = false,
      pageMain,
      isRead,
      currentView, // Добавляем currentView из props
    } = this.props;
    const { isFavorite } = this.state;

    // Определяем, нужно ли показывать информацию об отправителе
    const isSentView = currentView === "sent";
    const showSenderInfo = !isSentView && (sender_name || sender_email);

    return (
      <div
        className={`mail ${isSelected ? "selected" : ""} ${isRead ? "read" : ""}`}
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
          <input
            type="checkbox"
            name="favorites-checkbox"
            checked={isFavorite}
            onChange={this.handleFavorite}
            onClick={(e: any) => e.stopPropagation()}
          />
        </div>
        <div className="mail-content">
          <div className="mail-content__left-part">
            <span className="mail-sender">
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
              {showSenderInfo
                ? sender_name 
                  ? `${sender_name} ${sender_surname || ""}`.trim()
                  : sender_email
                : ""}
            </span>
            <div className="mail-text-content">
              <span className="mail-theme">{theme}</span>
              <span className="mail-title">{title}</span>
              <span className="mail-date">{date}</span>
            </div>
          </div>
          <div className="mail-content__right-part-mobile">
            <span className="mail-date-mobile">{date}</span>
            <input
              className="favorites-checkbox-mobile"
              type="checkbox"
              name="favorites-checkbox"
              checked={isFavorite}
              onChange={this.handleFavorite}
              onClick={(e: any) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default MailBox;