import Death13 from "@react/stands";
import "./ReadMail.scss";
import Button from "../../components/Button/Button";
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
    const isMobile = window.innerWidth < 769;
    return (
      <div className="read-mail">
        {isMobile ? (
          <div className="read-mail__header-mobile">
            <img
              className="back-button"
              src="../../assets/svg/ArrowLeft.svg"
              onClick={this.props.backToMail}
            ></img>

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
              <div className="sender-info">
                <img src="../../assets/svg/Avatar.svg"></img>
                <div className="sender-info__text">
                  <div className="sender-name">
                    <div>
                      {email.sender_name} {email.sender_surname}
                    </div>
                    <div>
                      <small>({email.sender_email})</small>
                    </div>
                  </div>
                  <InputEmail
                    input_title="Кому:"
                    emails={email.receivers_emails}
                    isReading={true}
                  />
                </div>
              </div>
              {!isMobile ? (
                <img
                  src="../../assets/svg/Close.svg"
                  className="close-button"
                  onClick={this.props.backToMail}
                ></img>
              ) : null}
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
            <Button
              svg="../../assets/svg/Reply.svg"
              name="reply"
              help="Переслать"
              onClick={this.handleForward}
            />{" "}
            <Button
              svg="../../assets/svg/Answer.svg"
              name="answer"
              help="Ответить"
              onClick={this.handleReply}
            />{" "}
          </div>
        )}
      </div>
    );
  }
}

export default ReadMail;
