import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import "./MailTools.scss";
import { AppStorage } from "../../App";
import { sendSpam } from "../../api/ApiSpam";

class MailTools extends Death13.Component {
    handleDeleteClick = async (event: any) => {
        event.preventDefault();
        const { deleteEmail } = this.props;
        await deleteEmail();
    };

    handleReplyClick = (event: any) => {
        event.preventDefault();
        const { onReply } = this.props;
        if (onReply) {
            onReply();
        }
    };

    handleForwardClick = (event: any) => {
        event.preventDefault();
        const { onForward } = this.props;
        if (onForward) {
            onForward();
        }
    };

    handleSpamClick = async (event: any) => {
        event.preventDefault();
        const { email } = this.props;
        if (email) {
            await sendSpam([email.id])
            this.props.backToMail?.();
        }
    };

    handleFavoriteClick = async (event: any) => {
        event.preventDefault();
        const { email } = this.props;
        if (email) {
        }
    };

    t(key: string): string {
        return AppStorage.t(key);
    }

    render() {
        return (
            <div className="tools-container">
                <div className="tools-left">
                    <Button
                        name="favorites"
                        help={this.t("starred")}
                        onClick={this.handleFavoriteClick}
                    />
                    <Button
                        name="spam"
                        help={this.t("spam")}
                        onClick={this.handleSpamClick}
                    />
                    <Button name="trash" help={this.t("trash")} onClick={this.handleDeleteClick} />
                </div>
                <div className="tools-right">
                    <Button name="answer" help={this.t("answer")} title={this.t("answer")} onClick={this.handleReplyClick} />
                    <Button name="reply" title={this.t("reply")} help={this.t("reply")} onClick={this.handleForwardClick} />
                </div>
            </div>
        );
    }
}

export default MailTools;