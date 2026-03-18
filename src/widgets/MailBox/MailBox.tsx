import Death13 from "@react/stands";

class MailBox extends Death13.Component {
    render() {
        return (
            <div className="mail-tile">
                <div className="mail-list">
                    <div className="mail">
                        <div className="checkbox-container"></div>
                        <div className="mail-content">
                            <span className="mail-theme">{ this.props.theme }</span>
                            <span className="mail-title">{ this.props.title }</span>
                        </div>
                        <span className="mail-date">{ this.props.date }</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default MailBox