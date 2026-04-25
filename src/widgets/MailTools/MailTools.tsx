import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import "./MailTools.scss";

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

    render() {
        return (
            <div className="tools-container">
                <div className="tools-left">
                    <Button
                        name="favorites"
                        help="Избранное"
                        onClick={(event: any) => {
                            event.preventDefault();
                        }}
                    />{" "}
                    <Button
                        name="spam"
                        help="Спам"
                        onClick={(event: any) => {
                            event.preventDefault();
                        }}
                    />{" "}
                    <Button name="trash" help="Корзина" onClick={this.handleDeleteClick} />{" "}
                </div>
                <div className="tools-right">
                    <Button
                        name="answer"
                        help="Ответить"
                        title="Ответить"
                        onClick={this.handleReplyClick}
                    />{" "}
                    <Button
                        name="reply"
                        title="Переслать"
                        help="Переслать"
                        onClick={this.handleForwardClick}
                    />{" "}
                </div>
            </div>
        );
    }
}

export default MailTools;
