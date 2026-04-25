import Death13 from "@react/stands";
import { AppStorage } from "../../App";
import "./ConfirmationModal.scss";

class ConfirmationModal extends Death13.Component {
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
            }, 2000);
        }

        return (
            <div className={`confirmation-modal ${this.props.isStatus ? "access" : "error"}`}>
                <div className="__title">{this.props.isStatus ? this.t("saved_successfully") : this.t("server_error")}</div>
            </div>
        );
    }
}

export default ConfirmationModal;
