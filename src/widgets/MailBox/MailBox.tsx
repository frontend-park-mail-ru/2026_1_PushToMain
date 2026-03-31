import Death13 from "@react/stands";
import "./MailBox.scss";

class MailBox extends Death13.Component {
    state: any = {
        isSelected: false,
        isFavorite: false,
    };

    handleSelect = (e: any) => {
        this.setState({ isSelected: e.target.checked });
    };

    handleFavorite = (e: any) => {
        this.setState({ isFavorite: e.target.checked });
    };

    render() {
        const { theme, title, date} = this.props;
        const { isSelected, isFavorite } = this.state;

        return (
            <div className={`mail-tile ${isSelected ? "selected" : ""}`}>
                <div className="mail-list">
                    <div className="mail">
                        <div className="checkbox-container">
                            <input
                                type="checkbox"
                                name="select-checkbox"
                                checked={isSelected}
                                onChange={this.handleSelect}
                            />
                            <input
                                type="checkbox"
                                name="favorites-checkbox"
                                checked={isFavorite}
                                onChange={this.handleFavorite}
                            />
                        </div>
                        <div className="mail-content">
                            <span className="mail-theme">{theme}</span>
                            <span className="mail-title">{title}</span>
                        </div>
                        <span className="mail-date">{date}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default MailBox;