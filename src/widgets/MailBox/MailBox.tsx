import Death13 from "@react/stands";
import "./MailBox.scss";
import { deleteEmailByID } from "../../api/ApiEmail";

class MailBox extends Death13.Component {
    constructor(props: any) {
        super(props);
    }
    state: any = {
        isSelected: false,
        isFavorite: false,
    };

    handleSelect = (e: any) => {
        e.stopPropagation();
    };

    handleFavorite = (e: any) => {
        e.stopPropagation();
        this.setState({ isFavorite: e.target.checked });
    };

    render() {
        const { theme, title, date, onClick, isSelected = false, isRead } = this.props;
        const { isFavorite } = this.state;

        return (
            <div className={`mail ${isSelected ? "selected" : ""}`} isRead={isRead} onClick={() => onClick()}>
                <div className="checkbox-container">
                    <input
                        type="checkbox"
                        name="select-checkbox"
                        checked={isSelected}
                        onInput={this.handleSelect}
                        onClick={(e: any) => e.stopPropagation()}
                    />
                    <input
                        type="checkbox"
                        name="favorites-checkbox"
                        checked={isFavorite}
                        onInput={this.handleFavorite}
                        onClick={(e: any) => e.stopPropagation()}
                    />
                </div>
                <div className="mail-content">
                    <span className="mail-theme">{theme}</span>
                    <span className="mail-title">{title}</span>
                </div>
                <span className="mail-date">{date}</span>
            </div>
        );
    }
}

export default MailBox;
