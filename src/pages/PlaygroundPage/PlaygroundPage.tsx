import Death13 from "@react/stands";
import MailBox from "../../widgets/MailBox/MailBox";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import "./PlaygroundPage.scss";

class PlaygroundPage extends Death13.Component {
  state = {
    selectedMail: null,
    selectedMails: [],
    viewMode: "all", // 'all', 'mobile', 'desktop'
  };

  mockEmails = [
    {
      id: "1",
      header: "Иван Петров",
      subject: "Встреча завтра в 15:00",
      body: "Привет! Давай встретимся завтра в 15:00 в офисе...",
      created_at: new Date().toISOString(),
      is_read: false,
      sender_name: "Иван Петров",
      sender_avatar: "/assets/svg/Avatar.svg",
      has_attachment: true,
      preview:
        "Привет! Давай встретимся завтра в 15:00 в офисе. Обсудим планы на следующий квартал...",
    },
    {
      id: "2",
      header: "GitHub",
      subject: "[GitHub] New notification from your repository",
      body: "You have a new notification in repository death13/mail-client",
      created_at: new Date(Date.now() - 86400000).toISOString(),
      is_read: true,
      sender_name: "GitHub",
      sender_avatar: "/assets/svg/Avatar.svg",
      has_attachment: false,
      preview:
        "You have a new notification in repository death13/mail-client. Someone commented on your pull request.",
    },
    {
      id: "3",
      header: "Анна Смирнова",
      subject: "Документы для подписания",
      body: "Добрый день! Отправляю документы для подписания...",
      created_at: new Date(Date.now() - 172800000).toISOString(),
      is_read: false,
      sender_name: "Анна Смирнова",
      sender_avatar: "/assets/svg/Avatar.svg",
      has_attachment: true,
      preview:
        "Добрый день! Отправляю документы для подписания. Пожалуйста, ознакомьтесь и подпишите до пятницы.",
    },
  ];

  formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  handleSelectMail = (id: string, selected: boolean) => {
    const selectedMails = selected
      ? [...this.state.selectedMails, id]
      : this.state.selectedMails.filter((mailId: string) => mailId !== id);

    this.setState({ selectedMails });
  };

  handleMailClick = (email: any) => {
    console.log("Mail clicked:", email);
    this.setState({ selectedMail: email });
  };

  setViewMode = (mode: string) => {
    this.setState({ viewMode: mode });
  };

  render() {
    const { viewMode, selectedMail, selectedMails } = this.state;

    return (
      <div className="playground-page">
        <div className="playground-header">
          <h1>🎮 Component Playground</h1>
          <div className="view-controls">
            <Button
              text="Все размеры"
              onClick={() => this.setViewMode("all")}
              className={viewMode === "all" ? "active" : ""}
            />
            <Button
              text="📱 Только мобильный"
              onClick={() => this.setViewMode("mobile")}
              className={viewMode === "mobile" ? "active" : ""}
            />
            <Button
              text="💻 Только десктоп"
              onClick={() => this.setViewMode("desktop")}
              className={viewMode === "desktop" ? "active" : ""}
            />
          </div>
        </div>

        {/* Mobile frame preview */}
        {(viewMode === "all" || viewMode === "mobile") && (
          <div className="preview-section mobile-preview">
            <div className="preview-header">
              <h2>📱 Mobile View (320px - 767px)</h2>
              <span className="dimensions">375x667 (iPhone SE)</span>
            </div>
            <div className="device-frame iphone-se">
              <div className="device-screen">
                <div className="mail-list-mobile">
                  {this.mockEmails.map((email, index) => (
                    <MailBox
                      key={index}
                      id={email.id}
                      theme={email.header}
                      title={email.subject}
                      date={this.formatTime(email.created_at)}
                      isSelected={selectedMails.includes(email.id)}
                      onSelect={this.handleSelectMail}
                      isRead={email.is_read}
                      onClick={() => this.handleMailClick(email)}
                      sender={email.sender_name}
                      avatar={email.sender_avatar}
                      hasAttachment={email.has_attachment}
                      preview={email.preview}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop frame preview */}
        {(viewMode === "all" || viewMode === "desktop") && (
          <div className="preview-section desktop-preview">
            <div className="preview-header">
              <h2>💻 Desktop View (768px+)</h2>
              <span className="dimensions">1200x800</span>
            </div>
            <div className="device-frame desktop">
              <div className="device-screen">
                <div className="mail-list-desktop">
                  <div className="mail-header-row">
                    <div className="mail-checkbox-header">
                      <img src="/assets/svg/CheckboxOff.svg" alt="select all" />
                    </div>
                    <div className="mail-theme-header">Отправитель</div>
                    <div className="mail-title-header">Тема</div>
                    <div className="mail-date-header">Время</div>
                  </div>
                  {this.mockEmails.map((email, index) => (
                    <MailBox
                      key={index}
                      id={email.id}
                      theme={email.header}
                      title={email.subject}
                      date={this.formatTime(email.created_at)}
                      isSelected={selectedMails.includes(email.id)}
                      onSelect={this.handleSelectMail}
                      isRead={email.is_read}
                      onClick={() => this.handleMailClick(email)}
                      sender={email.sender_name}
                      avatar={email.sender_avatar}
                      hasAttachment={email.has_attachment}
                      preview={email.preview}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Selected mail info */}
        {selectedMail && (
          <div className="selected-info">
            <h3>Selected Mail:</h3>
            <pre>{JSON.stringify(selectedMail, null, 2)}</pre>
          </div>
        )}

        {/* Component variants */}
        <div className="component-variants">
          <h2>🎨 MailBox Variants</h2>
          <div className="variant-grid">
            <div className="variant-item">
              <h3>Unread</h3>
              <MailBox
                id="v1"
                theme="Unread Mail"
                title="This is an unread message"
                date="10:30"
                isSelected={false}
                onSelect={() => {}}
                isRead={false}
                onClick={() => {}}
              />
            </div>
            <div className="variant-item">
              <h3>Read</h3>
              <MailBox
                id="v2"
                theme="Read Mail"
                title="This message has been read"
                date="Вчера"
                isSelected={false}
                onSelect={() => {}}
                isRead={true}
                onClick={() => {}}
              />
            </div>
            <div className="variant-item">
              <h3>Selected</h3>
              <MailBox
                id="v3"
                theme="Selected Mail"
                title="This message is selected"
                date="12:45"
                isSelected={true}
                onSelect={() => {}}
                isRead={false}
                onClick={() => {}}
              />
            </div>
            <div className="variant-item">
              <h3>With Preview</h3>
              <MailBox
                id="v4"
                theme="Newsletter"
                title="Weekly Digest: Top stories"
                date="Пн"
                isSelected={false}
                onSelect={() => {}}
                isRead={false}
                onClick={() => {}}
                sender="The Newsletter"
                preview="Here's what happened this week in tech..."
                hasAttachment={true}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PlaygroundPage;
