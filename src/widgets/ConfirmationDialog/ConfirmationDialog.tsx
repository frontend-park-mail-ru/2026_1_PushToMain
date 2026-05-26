import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import { AppStorage } from "../../App";
import "./ConfirmationDialog.scss";

class ConfirmationDialog extends Death13.Component {
  onConfirm = () => {
    this.props.callbackConfirm();
  };

  onCancel = () => {
    this.props.callbackCancel();
  };

  t(key: string): string {
    return AppStorage.t(key);
  }

  render() {
    const { text, cancelButtonTitle, confirmButtonTitle, highlightCancel } =
      this.props;
    return (
      <div className="confirmation-dialog">
        <div className="__overlay" />
        <div className="__content">
          <h2>{text}</h2>
          <div className="__buttons">
            <Button
              className={highlightCancel ? "primary" : "secondary"}
              title={this.t(cancelButtonTitle || "action_cancel")}
              onClick={this.onCancel}
            />
            <Button
              className={!highlightCancel ? "primary" : "secondary"}
              title={this.t(confirmButtonTitle || "action_confirm")}
              onClick={this.onConfirm}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ConfirmationDialog;
