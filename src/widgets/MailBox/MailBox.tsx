import Death13 from "@react/stands";
import "./MailBox.scss";
import { readEmail, unReadEmail } from "../../api/ApiEmail";
import { AppStorage } from "../../App";

class MailBox extends Death13.Component {
    state: any = {
        isFavorite: false,
        isRead: this.props.isRead || false,
    };

    handleSelect = (e: any) => {
        e.stopPropagation();
        const { id, onSelect } = this.props;
        if (onSelect) {
            onSelect(id, e.target.checked);
        }
    };

    handleToggleRead = async () => {
        const { id } = this.props;
        const newReadState = !this.state.isRead;

        this.setState({ isRead: newReadState });

        if (!newReadState) {
            await unReadEmail(id);
            AppStorage.setUnReadCount(AppStorage.unReadCount + 1);
        } else {
            await readEmail(id);
            AppStorage.setUnReadCount(AppStorage.unReadCount - 1);
        }
    };

    handleFavorite = (e: any) => {
        e.stopPropagation();
        this.setState({ isFavorite: e.target.checked });
    };

    render() {
        const { theme, title, date, onClick, isSelected = false, pageMain } = this.props;
        const { isFavorite, isRead } = this.state;

        return (
            <div className={`mail ${isSelected ? "selected" : ""} ${isRead ? "read" : ""}`} onClick={onClick}>
                <div className="checkbox-container">
                    <input
                        type="checkbox"
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
                    {pageMain && (
                        <input
                            type="checkbox"
                            name="read-checkbox"
                            checked={isRead}
                            onChange={this.handleToggleRead}
                            onClick={(e: any) => e.stopPropagation()}
                        />
                    )}
                    {!pageMain && <div className="sent-checkbox"></div>}
                </div>
                <div className="mail-content">
                    <span className="mail-theme">{theme}</span>
                    <span className="mail-title">{title}</span>
                    <span className="mail-date">{date}</span>
                </div>
            </div>
        );
    }
}

export default MailBox;
