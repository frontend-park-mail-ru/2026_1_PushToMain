import Death13 from "@react/stands";
import { AppStorage } from "../../App";
import "./SidebarProfile.scss";
import Button from "../Button/Button";
import { logOut } from "../../api/ApiAuth";

class SidebarProfile extends Death13.Component {
  state = {
    name: AppStorage.name,
    surname: AppStorage.surname,
    email: AppStorage.email,
    avatarUrl: AppStorage.image_path,
    variant: "",
    textAlign: "",
  };

  constructor(props: any) {
    super(props);
    this.state.variant = props.variant;
    this.state.textAlign = props.textAlign;
  }

  handleAvatar = () => {
    window.app.handleRoute("/profile");
  };

  handleExit = async () => {
    await logOut();

    AppStorage.setUnReadCount(0);

    window.app.handleRoute("/login");
  };

  render() {
    const { variant = "", textAlign = "" } = this.state;
    const { name, surname, email, avatarUrl } = this.props;
    return (
      <div className={`sidebar-profile ${variant}`}>
        {variant === "mobile" ? (
          <Button
            className="sidebar-profile__profile-btn"
            svg={AppStorage.getAvatarUrl()}
            name="avatar"
            help="Аккаунт"
            onClick={this.handleAvatar}
          />
        ) : (
          <img src={avatarUrl || "../../assets/svg/Avatar.svg"}></img>
        )}
        <div
          className={`sidebar-profile__text ${textAlign}`}
          onClick={variant === "mobile" ? this.handleAvatar : () => {}}
        >
          <span className="sidebar-profile__name">
            {name} {surname}
          </span>
          <p className="sidebar-profile__email">{email}</p>
        </div>
        {variant === "mobile" ? (
          <div
            className="sidebar-profile__logout-btn"
            onClick={this.handleExit}
          />
        ) : null}
      </div>
    );
  }
}

export default SidebarProfile;
