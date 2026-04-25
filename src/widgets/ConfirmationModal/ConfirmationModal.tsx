import Death13 from "@react/stands";
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
                <div className="__title">{this.props.isStatus ? "Успешно изменено!" : "Ошибка сервера!"}</div>
            </div>
        );
    }
}

export default ConfirmationModal;
