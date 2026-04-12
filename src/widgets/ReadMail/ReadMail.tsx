import Death13 from "@react/stands";
import "./ReadMail.scss";
import Input from "../../components/Input/Input";
import InputEmail from "../../components/InputEmail/InputEmail";
import Textarea from "../../components/Textarea/Textarea";
import MailTools from "../MailTools/MailTools";
import { deleteEmailByID } from "../../api/ApiEmail";
import { AppStorage } from "../../App";

class ReadMail extends Death13.Component {
    handleDeleteEmail = async () => {
        const { email, reloadMail, backToMail } = this.props;

        await deleteEmailByID(email.id);
        reloadMail();
        backToMail();
    };

    handleReply = () => {
        const { email } = this.props;

        AppStorage.setReplyData({
            type: "reply",
            to: email.sender_email || "",
            subject: `Re: ${email.header}`,
            body: `\n\n--- Оригинальное сообщение ---\nОт кого: ${email.sender_email || ""}\nДата: ${email.created_at}\n\n${email.body}`,
            originalEmail: email,
        });

        window.app.handleRoute("/send");
    };

    handleForward = () => {
        const { email } = this.props;

        window.AppStorage.setForwardData({
            type: "forward",
            subject: `Fwd: ${email.header || "Без темы"}`,
            body: `\n\n--- Пересылаемое сообщение ---\nОт: \nДата: ${email.created_at ? new Date(email.created_at).toLocaleString("ru-RU") : "Неизвестно"}\nТема: ${email.header || "Без темы"}\nКому: \n\n${email.body || ""}`,
            originalEmail: email,
        });

        window.app.handleRoute("/send");
    };

    render() {
        const { email } = this.props;
        return (
            <div className="read-mail">
                <form action="" className="read-form">
                    <div className="read-inputs">
                        <InputEmail input_title="Кому:" emails={email.receivers_emails} isReading={true} />
                        <Input
                            type="text"
                            placeholder="Введите тему"
                            input_title="Тема:"
                            name="theme"
                            readonly={true}
                            value={email.header}
                            onInput={() => {}}
                        />
                    </div>
                    <Textarea readonly={true} value={email.body} />
                </form>
                <MailTools
                    deleteEmail={this.handleDeleteEmail}
                    backToMail={this.props.backToMail}
                    reloadEMail={this.props.reloadMail}
                    onReply={this.handleReply}
                    onForward={this.handleForward}
                />
            </div>
        );
    }
}

export default ReadMail;
