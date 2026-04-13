import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import "./Sidebar.scss";
import { AppStorage } from "../../App";

class Sidebar extends Death13.Component {
  state: any = {
    isVisible: false,
    name: AppStorage.name,
    surname: AppStorage.surname,
    email: AppStorage.email,
    avatarUrl: AppStorage.getAvatarUrl(),
  };

  private unsubscribe: (() => void) | null = null;

  componentDidMount() {
    this.unsubscribe = AppStorage.subscribe(() => {
      console.log("Profile data updated, updating sidebar...");
      this.setState({
        name: AppStorage.name,
        surname: AppStorage.surname,
        email: AppStorage.email,
        avatarUrl: AppStorage.getAvatarUrl(),
      });
    });
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  render() {
    const { isVisible, name, surname, email, avatarUrl } = this.state;
    const {
      isProfile = 0,
      backToMail,
      changeProfile,
      changePassword,
      newMail,
      updateMail,
    } = this.props;

    return (
      <div className="sidebar-widget">
        <div
          className="logo-container"
          onClick={(event: any) => {
            event.preventDefault();
            if (this.props.updateMail) {
              updateMail();
            }
            backToMail();
          }}
        >
          <img src="../../assets/svg/Logo.svg" />
          <h1 className="logo__title">SMail</h1>
        </div>
        {isProfile !== 1 && (
          <div className="sidebar-content">
            <div className="main-button">
              <Button
                title="Новое письмо"
                name="button-new-letter"
                svg="../../assets/svg/Compose.svg"
                onClick={(event: any) => {
                  event.preventDefault();
                  newMail();
                }}
              />
            </div>
            <div className="main-button-container">
              <Button
                name="button-inbox"
                title="Входящие"
                isSelect={this.props.isPress === 0}
                svg="../../assets/svg/Inbox.svg"
                count={AppStorage.unReadCount}
                onClick={(event: any) => {
                  event.preventDefault();
                  if (this.props.updateMail) {
                    updateMail();
                  }
                  backToMail();
                }}
              />
              <Button
                name="button-drafs"
                title="Черновики"
                svg="../../assets/svg/Draft.svg"
                onClick={(event: any) => {
                  event.preventDefault();
                }}
              />
              <Button
                name="button-sends"
                title="Отправленные"
                isSelect={this.props.isPress === 1}
                svg="../../assets/svg/Sent.svg"
                onClick={(event: any) => {
                  event.preventDefault();
                  window.app.handleRoute("/sent");
                }}
              />
              <Button
                name="button-favorites"
                title="Избранные"
                svg="../../assets/svg/SidebarFavorites.svg"
                onClick={(event: any) => {
                  event.preventDefault();
                }}
              />
            </div>
            <div className="drop-down">
              <Button
                name="button-drop-down"
                title={isVisible ? "Скрыть" : "Ещё"}
                svg="../../assets/svg/DropdownArrow.svg"
                onClick={(event: any) => {
                  event.preventDefault();
                  this.setState({ isVisible: !isVisible });
                  const button = event.currentTarget;
                  button.classList.toggle("active");
                }}
              />
              {isVisible && (
                <div className="extra-button-container">
                  <Button
                    name="button-spam"
                    title="Спам"
                    svg="../../assets/svg/Spam.svg"
                    onClick={(event: any) => {
                      event.preventDefault();
                    }}
                  />
                  <Button
                    name="button-trash"
                    title="Корзина"
                    svg="../../assets/svg/Trash.svg"
                    onClick={(event: any) => {
                      event.preventDefault();
                    }}
                  />
                  <Button
                    name="button-all-letter"
                    title="Все письма"
                    svg="../../assets/svg/AllMail.svg"
                    onClick={(event: any) => {
                      event.preventDefault();
                      backToMail();
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}{" "}
        {isProfile === 1 && (
          <div className="sidebar-content">
            <div className="sidebar-profile">
              <img src={avatarUrl}></img>
              <span>
                {name} {surname}
              </span>
              <p>{email}</p>
            </div>
            <div className="main-button-profile">
              <Button
                title="Почтовый ящик"
                name="button-new-letter"
                onClick={(event: any) => {
                  event.preventDefault();
                  backToMail();
                }}
              />
            </div>
            <div className="main-button-container">
              <Button
                name="button-profile"
                title="Личные данные"
                onClick={(event: any) => {
                  event.preventDefault();
                  changeProfile();
                }}
              />
              <Button
                name="button-security"
                title="Безопасность"
                onClick={(event: any) => {
                  event.preventDefault();
                  changePassword();
                }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Sidebar;
