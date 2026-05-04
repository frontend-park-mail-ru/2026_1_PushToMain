import Death13 from "@react/stands";
import "./ReadMail.scss";
import Input from "../../components/Input/Input";
import Textarea from "../../components/Textarea/Textarea";
import Button from "../../components/Button/Button";
import MailTools from "../MailTools/MailTools";
import {
  deleteEmailByID,
  deleteMyEmailByID,
  changeFolderV2,
} from "../../api/ApiEmail";
import { AppStorage } from "../../App";
import { URLMINIO } from "../../api/config";
import { deleteEmailsFromFolder } from "../../api/ApiFolder";

class ReadMail extends Death13.Component {
  handleDeleteEmail = async () => {
    const { email, backToMail, backToSent, selectedFolderId } = this.props;

    if (selectedFolderId) {
      const ids = [email.id];
      await deleteEmailsFromFolder(selectedFolderId, ids);
      backToMail();
    } else if (window.app.previousPath === "/sent") {
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

  handleMarkAsSpam = async (event: any) => {
    event.preventDefault();
    if (this.props.selectedEmails && this.props.selectedEmails.length > 0) {
      await changeFolderV2(this.props.selectedEmails, "spam");
      this.props.reloadMail?.();
    }
  };

  handleMarkAsFavorite = async (event: any) => {
    event.preventDefault();
    if (this.props.selectedEmails && this.props.selectedEmails.length > 0) {
      await changeFolderV2(this.props.selectedEmails, "favorite");
    }
  };

  t(key: string): string {
    return AppStorage.t(key);
  }

  render() {
    const { email } = this.props;
    const isMobile = window.innerWidth < 769;

    return (
      <div className="read-mail">
        {isMobile ? (
          <div className="read-mail__header-mobile">
            <div className="back-button" onClick={this.props.backToMail}></div>

            <MailTools
              deleteEmail={this.handleDeleteEmail}
              backToMail={this.props.backToMail}
              reloadEMail={this.props.reloadMail}
              onReply={this.handleReply}
              onForward={this.handleForward}
            />
          </div>
        ) : null}
        <form action="" className="read-form">
          <div className="read-inputs">
            <div className="read-header">
              <div className="sender-avatar">
                <img
                  src={
                    email.senderImage !== ""
                      ? `${URLMINIO}/${email.senderImage}`
                      : "/assets/svg/Avatar.svg"
                  }
                />
              </div>
              <div className="sender-data">
                <div className="sender__email">{email.senderEmail}</div>
                <div className="recivers__emails">
                  {this.t("to")}
                  <div className="input-form">
                    {(email.receiverList || []).map(
                      (email: string, index: number) => (
                        <span key={index} className="email-tag">
                          <span>{email}</span>
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Input
              type="text"
              placeholder="Введите тему"
              input_title={this.t("subject")}
              name="theme"
              readonly={true}
              value={email.header}
              onInput={() => {}}
            />
          </div>
          <Textarea readonly={true} value={email.body} />
        </form>
        {!isMobile ? (
          <MailTools
            deleteEmail={this.handleDeleteEmail}
            backToMail={this.props.backToMail}
            reloadEMail={this.props.reloadMail}
            onReply={this.handleReply}
            onForward={this.handleForward}
          />
        ) : (
          <div className="tools-bottom-mobile">
            <div
              svg="../../assets/svg/Reply.svg"
              className="reply"
              help="Переслать"
              onClick={this.handleForward}
            />
            <div
              svg="../../assets/svg/Answer.svg"
              className="answer"
              help="Ответить"
              onClick={this.handleReply}
            />
          </div>
        )}
      </div>
    );
  }
}

export default ReadMail;
