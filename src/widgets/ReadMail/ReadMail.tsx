import Death13 from "@react/stands";
import "./ReadMail.scss";
import Input from "../../components/Input/Input";
import Textarea from "../../components/Textarea/Textarea";
import HorizontalScroller from "../../components/HorizontalScroller/HorizontalScroller";
import MailTools from "../MailTools/MailTools";
import { AppStorage } from "../../App";
import { URLMINIO } from "../../api/config";
import { deleteEmailsFromFolder } from "../../api/ApiFolder";
import { sendSpam } from "../../api/ApiSpam";
import { trash } from "../../api/ApiTrash";
import { formatTime } from "../../utils/date";
import { getAttachments, downloadAttachment } from "../../api/ApiAttachments";
import {
  formatFileSize,
  getIconByContentType,
  trimFileName,
} from "../../utils/files";

class ReadMail extends Death13.Component {
  state = {
    attachments: [],
    attachmentsLoading: false,
  };

  componentDidMount() {
    this.fetchAttachments();
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.email?.id !== this.props.email?.id) {
      this.fetchAttachments();
    }
  }

  fetchAttachments = async () => {
    const { email } = this.props;
    if (!email?.id) return;

    this.setState({ attachmentsLoading: true });
    try {
      const data = await getAttachments(email.id);

      let attachmentsArray = [];
      if (Array.isArray(data)) {
        attachmentsArray = data;
      } else if (data && Array.isArray(data.attachments)) {
        attachmentsArray = data.attachments;
      } else if (data && typeof data === "object") {
        attachmentsArray = [data];
      }

      this.setState({
        attachments: attachmentsArray,
        attachmentsLoading: false,
      });
    } catch {
      this.setState({ attachments: [], attachmentsLoading: false });
    }
  };

  handleDownload = async (attachmentId: number, fileName: string) => {
    const { email } = this.props;
    if (!email?.id) return;

    try {
      const blob = await downloadAttachment(email.id, attachmentId);
      if (!blob) return;

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {}
  };

  handleCloseEmail = () => {
    window.app.handleRoute("/");
  };

  handleDeleteEmail = async () => {
    const { email, backToMail, backToSent, selectedFolderId } = this.props;

    if (selectedFolderId) {
      const ids = [email.id];
      await deleteEmailsFromFolder(selectedFolderId, ids);
      backToMail();
    } else if (window.app.previousPath === "/sent") {
      await trash([email.id]);
      backToSent();
    } else {
      await trash([email.id]);
      backToMail();
    }
  };

  handleReply = () => {
    const { email } = this.props;

    AppStorage.setReplyData({
      type: "reply",
      to: email.senderEmail || "",
      subject: `Re: ${email.header}`,
      body: `\n\n${this.t("original_email")}\n${this.t("from")} ${email.is_anonymous ? this.t("anonymous") : email.senderEmail || ""}\n${this.t("date")} ${email.createdAt ? new Date(email.createdAt).toLocaleString("ru-RU") : this.t("unknown")} \n\n${email.body}`,
      originalEmail: email,
    });

    AppStorage.replyingToAnonymous = email.is_anonymous;
    AppStorage.emailReplyingId = email.id;

    window.app.handleRoute("/send");
  };

  handleForward = () => {
    const { email } = this.props;

    window.AppStorage.setForwardData({
      type: "forward",
      subject: `Fwd: ${email.header || "Без темы"}`,
      body: `\n\n${this.t("forwarded_email")}\n${this.t("from")} ${email.senderEmail}\n${this.t("date")} ${email.createdAt ? new Date(email.createdAt).toLocaleString("ru-RU") : this.t("unknown")}\n${this.t("subject")} ${email.header || this.t("empty_subject")}\n${this.t("to")} ${email.receiverList}\n\n${email.body || ""}`,
      originalEmail: email,
    });

    window.app.handleRoute("/send");
  };

  handleMarkAsSpam = async (event: any) => {
    event.preventDefault();
    if (this.props.selectedEmails && this.props.selectedEmails.length > 0) {
      await sendSpam(this.props.selectedEmails);
      this.props.reloadMail?.();
    }
  };

  handleMarkAsFavorite = async (event: any) => {
    event.preventDefault();
    if (this.props.selectedEmails && this.props.selectedEmails.length > 0) {
    }
  };

  t(key: string): string {
    return AppStorage.t(key);
  }

  render() {
    const { email } = this.props;
    const { attachments } = this.state;
    const isMobile = window.innerWidth < 769;
    const hasAttachments = attachments.length > 0;

    return (
      <div className="read-mail">
        {isMobile ? (
          <div className="read-mail__header-mobile">
            <div className="back-button" onClick={this.props.backToMail}></div>

            <MailTools
              deleteEmail={this.handleDeleteEmail}
              onReply={this.handleReply}
              onForward={this.handleForward}
              email={email}
              reloadMail={this.props.reloadMail}
              backToMail={this.props.backToMail}
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
                <div className="sender__email">
                  <span>
                    {email.is_anonymous
                      ? this.t("anonymous")
                      : email.senderEmail}
                  </span>
                  {isMobile ? (
                    <div className="email-send-time">
                      {formatTime(email.createdAt)}
                    </div>
                  ) : null}
                </div>
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
              {!isMobile ? (
                <div className="top-right-bar">
                  <span className="email-send-time">
                    {formatTime(email.createdAt)}
                  </span>
                  <div
                    className="close-button"
                    onClick={this.handleCloseEmail}
                  />
                </div>
              ) : null}
            </div>
            <Input
              type="text"
              placeholder={this.t("empty_subject")}
              input_title={this.t("subject")}
              name="theme"
              readonly={true}
              value={email.header}
              onInput={() => {}}
            />
          </div>
          <div
            className={`attachments-section${hasAttachments ? "" : " hidden"}`}
          >
            <HorizontalScroller className="attachments-list">
              {attachments.map((att: any) => (
                <div className="attachment-item">
                  <div
                    className={`attachment-icon ${getIconByContentType(att.content_type)}`}
                  />
                  <div className="attachment-info">
                    <span className="attachment-name">
                      {trimFileName(att.file_name)}
                    </span>
                    <span className="attachment-size">
                      {formatFileSize(att.size_bytes)}
                    </span>
                  </div>
                  <div
                    className="attachment-download-btn"
                    onClick={(e: any) => {
                      e.preventDefault();
                      this.handleDownload(att.id, att.file_name);
                    }}
                  ></div>
                </div>
              ))}
            </HorizontalScroller>
          </div>
          <Textarea readonly={true} value={email.body} />
        </form>
        {!isMobile ? (
          <MailTools
            deleteEmail={this.handleDeleteEmail}
            onReply={this.handleReply}
            onForward={this.handleForward}
            email={email}
            reloadMail={this.props.reloadMail}
            backToMail={this.props.backToMail}
            onFavoriteToggled={this.props.onFavoriteToggled}
            isFavorite={email.is_favorite}
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
