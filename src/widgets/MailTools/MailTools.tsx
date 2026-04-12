import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import "./MailTools.scss";

class MailTools extends Death13.Component {
    
    handleDeleteClick = async (event: any) => {
        event.preventDefault();
        const { deleteEmail } = this.props;
        await deleteEmail();
    };

    render() {
        return (
            <div className="tools-container">
                <div className="tools-left">
                    <Button
                        svg="../../assets/svg/SidebarFavorites.svg"
                        name="favorites"
                        help="Избранное"
                        onClick={(event: any) => {
                            event.preventDefault();
                        }}
                    />{" "}
                    <Button
                        svg="../../assets/svg/Spam.svg"
                        name="spam"
                        help="Спам"
                        onClick={(event: any) => {
                            event.preventDefault();
                        }}
                    />{" "}
                    <Button svg="../../assets/svg/Trash.svg" name="trash" help="Корзина" onClick={this.handleDeleteClick} />{" "}
                </div>
                <div className="tools-right">
                    <Button
                        svg="../../assets/svg/Answer.svg"
                        name="answer"
                        help="Ответить"
                        title="Ответить"
                        onClick={(event: any) => {
                            event.preventDefault();
                        }}
                    />{" "}
                    <Button
                        svg="../../assets/svg/Reply.svg"
                        name="reply"
                        title="Переслать"
                        help="Переслать"
                        onClick={(event: any) => {
                            event.preventDefault();
                        }}
                    />{" "}
                </div>
            </div>
        );
    }
}

export default MailTools;
