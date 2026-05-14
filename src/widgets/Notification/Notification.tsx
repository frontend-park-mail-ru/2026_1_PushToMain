import Death13 from "@react/stands";
import { AppStorage } from "../../App";
import "./Notification.scss";

class Notification extends Death13.Component {
  private timer: any = null;

  constructor(props: any) {
    super(props);
  }

  handleClose = () => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.props.onClose();
  };

  t(key: string): string {
    return AppStorage.t(key);
  }

  render() {
    const { isOpen } = this.props;

    const popupLength = window.innerWidth < 769 ? 2000 : 4000;

    if (!isOpen) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      return null;
    }

    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.timer = null;
        this.props.onClose();
      }, popupLength);
    }

    const { isStatus, message, index } = this.props;

    const bottomOffset = 40 + index * 60;

    return (
      <div
        className={`confirmation-modal ${isStatus ? "access" : "error"}`}
        onClick={this.handleClose}
        style={{ bottom: `${bottomOffset}px` }}
      >
        <div className="__title">
          {isStatus
            ? this.t(message || "saved_successfully")
            : this.t(message || "server_error")}
        </div>
      </div>
    );
  }
}

export default Notification;
