import Death13 from "@react/stands";
import "./ReadMail.scss";
import Input from "../../components/Input/Input";
import Textarea from "../../components/Textarea/Textarea";
import MailTools from "../MailTools/MailTools";
import { deleteEmailByID, deleteMyEmailByID } from "../../api/ApiEmail";
import { AppStorage } from "../../App";
import { URLMINIO } from "../../api/config";

class ReadMail extends Death13.Component {
    handleDeleteEmail = async () => {
        const { email, backToMail, backToSent } = this.props;
        if (window.app.previousPath === "/sent") {
            await deleteMyEmailByID(email.id);
            backToSent();
        } else {
            await deleteEmailByID(email.id);
            backToMail();
        }
    };

    handleReply = () => {
        const { email } = this.props;

        AppStorage.setReplyData({
            type: "reply",
            to: email.senderEmail || "",
            subject: `Re: ${email.header}`,
            body: `\n\n--- Оригинальное сообщение ---\nОт кого: ${email.senderEmail || ""}\nДата: ${email.createdAt ? new Date(email.createdAt).toLocaleString("ru-RU") : "Неизвестно"} \n\n${email.body}`,
            originalEmail: email,
        });

        window.app.handleRoute("/send");
    };

    handleForward = () => {
        const { email } = this.props;

        window.AppStorage.setForwardData({
            type: "forward",
            subject: `Fwd: ${email.header || "Без темы"}`,
            body: `\n\n--- Пересылаемое сообщение ---\nОт: ${email.senderEmail}\nДата: ${email.createdAt ? new Date(email.createdAt).toLocaleString("ru-RU") : "Неизвестно"}\nТема: ${email.header || "Без темы"}\nКому: ${email.receiverList}\n\n${email.body || ""}`,
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
                        <div className="read-header">
                            <div className="sender-avatar">
                                <img src={email.senderImage !== "" ? `${URLMINIO}/${email.senderImage}` : "/assets/svg/Avatar.svg"} />
                            </div>
                            <div className="sender-data">
                                <div className="sender__email">{email.senderEmail}</div>
                                <div className="recivers__emails">
                                    Кому:
                                    <div className="input-form">
                                        {email.receiverList.map((email: string, index: number) => (
                                            <span key={index} className="email-tag">
                                                <span>{email}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
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
