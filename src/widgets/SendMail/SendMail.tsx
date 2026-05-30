import Death13 from "@react/stands";
import "./SendMail.scss";
import InputEmail from "../../components/InputEmail/InputEmail";
import Input from "../../components/Input/Input";
import Textarea from "../../components/Textarea/Textarea";
import Button from "../../components/Button/Button";
import NotificationManager from "../NotificationManager/NotificationManager";
import ConfirmationDialog from "../../widgets/ConfirmationDialog/ConfirmationDialog";
import HorizontalScroller from "../../components/HorizontalScroller/HorizontalScroller";
import { sendEmail, replyToEmail } from "../../api/ApiEmail";
import {
  uploadAttachment,
  getAttachments,
  deleteAttachments,
} from "../../api/ApiAttachments";
import { AppStorage } from "../../App";
import { createDraft, sendDraft, updateDraft } from "../../api/ApiDraft";
import {
  formatFileSize,
  getIconByContentType,
  trimFileName,
} from "../../utils/files";

class SendMail extends Death13.Component {
  fileInputRef: HTMLInputElement | null = null;
  filesListRef: HTMLDivElement | null = null;
  private targetScroll = 0;
  private currentScroll = 0;
  private velocity = 0;
  private rafId: number | null = null;

  state: any = {
    header: "",
    body: "",
    receivers: [],
    invalidReceivers: [],
    buttonBlock: true,
    files: [],
    draftId: null,
    emailId: AppStorage.emailReplyingId || null,
    uploadingFiles: false,
    sending: false,
    isAnonymous: false,
    replyingToAnonymous: AppStorage.replyingToAnonymous,
  };

  constructor(props: any) {
    super(props);

    const actionData = props.actionData;
    const draftData = AppStorage.getDraftData();

    const newState: any = {
      ...this.state,
    };

    if (actionData) {
      if (actionData.type === "reply") {
        newState.header = actionData.subject || "";
        newState.body = actionData.body || "";
        newState.receivers = actionData.to ? [actionData.to] : [];
      } else if (actionData.type === "forward") {
        newState.header = actionData.subject || "";
        newState.body = actionData.body || "";
        newState.receivers = [];
      }
    } else if (draftData) {
      newState.header = draftData.header || "";
      newState.body = draftData.body || "";
      newState.receivers = draftData.receivers || [];
      newState.draftId = draftData.id || null;
    }

    const isValid = this.isFormValid(
      newState.body,
      newState.receivers,
      newState.invalidReceivers,
      newState.replyingToAnonymous,
    );
    newState.buttonBlock = !isValid;

    this.state = newState;

    this.handleWheel = this.handleWheel.bind(this);
  }

  private startScrollLoop = () => {
    if (this.rafId !== null) return;

    const step = () => {
      const el = this.filesListRef;
      if (!el) return;

      const diff = this.targetScroll - this.currentScroll;

      if (Math.abs(diff) < 0.3 && Math.abs(this.velocity) < 0.1) {
        this.currentScroll = this.targetScroll;
        el.scrollLeft = this.currentScroll;
        this.rafId = null;
        return;
      }

      this.currentScroll += diff * 0.3;
      this.velocity *= 0.52;
      this.currentScroll += this.velocity;

      const max = el.scrollWidth - el.clientWidth;
      this.currentScroll = Math.max(0, Math.min(max, this.currentScroll));
      this.targetScroll = this.currentScroll;

      el.scrollLeft = this.currentScroll;
      this.rafId = requestAnimationFrame(step);
    };

    this.rafId = requestAnimationFrame(step);
  };

  private addScrollDelta = (delta: number) => {
    const el = this.filesListRef;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    this.targetScroll += delta;
    this.targetScroll = Math.max(0, Math.min(max, this.targetScroll));
    this.velocity += delta * 0.08;

    if (this.rafId === null) {
      this.startScrollLoop();
    }
  };

  touchStartX = 0;

  handleTouchStart = (e: TouchEvent) => {
    this.touchStartX = e.touches[0].clientX;
    this.velocity = 0;
  };

  handleTouchMove = (e: TouchEvent) => {
    e.preventDefault();
    const dx = this.touchStartX - e.touches[0].clientX;
    this.touchStartX = e.touches[0].clientX;
    this.addScrollDelta(dx);
  };

  handleTouchEnd = () => {};

  handleWheel = (event: WheelEvent) => {
    event.preventDefault();

    const isMouseWheel = event.deltaMode === 1;

    let rawDelta = event.deltaY + event.deltaX;

    if (isMouseWheel) {
      rawDelta *= 16;
    }
    this.addScrollDelta(rawDelta * 2);
  };

  componentDidMount() {
    if (this.state.draftId) {
      this.fetchDraftAttachments();
    }
  }

  componentWillUnmount() {
    if (this.filesListRef) {
      this.filesListRef.removeEventListener("wheel", this.handleWheel);
      this.filesListRef.removeEventListener(
        "touchstart",
        this.handleTouchStart,
      );
      this.filesListRef.removeEventListener("touchmove", this.handleTouchMove);
      this.filesListRef.removeEventListener("touchend", this.handleTouchEnd);
    }
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
    }
  }

  isFormValid = (
    body: string,
    receivers: string[],
    invalidReceivers: string[],
    replyingToAnonymous: boolean,
  ): boolean => {
    return (
      body.trim().length > 0 &&
      (receivers.length > 0 || replyingToAnonymous) &&
      (invalidReceivers || []).length === 0
    );
  };

  updateButtonState = () => {
    const { body, receivers, invalidReceivers, replyingToAnonymous } =
      this.state;
    const isValid = this.isFormValid(
      body,
      receivers,
      invalidReceivers,
      replyingToAnonymous,
    );
    this.setState({ buttonBlock: !isValid });
  };

  handleHeaderChange = (e: any) => {
    this.setState({ header: e.target.value });
    this.updateButtonState();
  };

  handleBodyChange = (e: any) => {
    this.setState({ body: e.target.value });
    this.updateButtonState();
  };

  handleReceiversChange = (emails: string[], invalidEmails: string[]) => {
    this.setState({ receivers: emails, invalidReceivers: invalidEmails });
    this.updateButtonState();
  };

  fetchDraftAttachments = async () => {
    const { draftId } = this.state;
    if (!draftId) return;

    try {
      const data = await getAttachments(draftId);

      if (!data) return;

      let attachmentsArray = [];
      if (Array.isArray(data)) {
        attachmentsArray = data;
      } else if (data && Array.isArray(data.attachments)) {
        attachmentsArray = data.attachments;
      } else if (data && Array.isArray(data.data)) {
        attachmentsArray = data.data;
      } else if (data && typeof data === "object") {
        attachmentsArray = [data];
      }

      const draftFiles = attachmentsArray.map((att: any) => ({
        id: att.id || Math.random(),
        name: att.file_name || att.fileName,
        size: att.size_bytes || att.sizeBytes,
        type: att.content_type || att.contentType || "application/octet-stream",
        attachmentId: att.id,
        uploaded: true,
        file: null,
      }));

      this.setState({ files: [...this.state.files, ...draftFiles] });
    } catch (err) {
      console.error("Failed to fetch draft attachments", err);
    }
  };

  async handleSubmit(e: any) {
    const {
      emailId,
      header,
      body,
      receivers,
      draftId,
      files,
      isAnonymous,
      replyingToAnonymous,
    } = this.state;
    e.preventDefault();

    this.setState({ buttonBlock: true, sending: true });

    let responseSend;

    if (replyingToAnonymous) {
      responseSend = await replyToEmail(emailId, {
        header: header.trim(),
        body: body.trim(),
        files: files.map((f: any) => f.file),
        is_anonymous: isAnonymous,
      });
    } else if (draftId) {
      await updateDraft(
        {
          header: header.trim(),
          body: body.trim(),
          receivers: receivers,
        },
        draftId,
      );

      this.uploadFiles(draftId);
      responseSend = await sendDraft(
        {
          header: header.trim(),
          body: body.trim(),
          receivers: receivers,
          is_anonymous: isAnonymous || replyingToAnonymous,
        },
        draftId,
      );
    } else {
      responseSend = await sendEmail({
        header: header.trim(),
        body: body.trim(),
        receivers: receivers,
        files: files.map((f: any) => f.file),
        is_anonymous: isAnonymous,
      });
    }

    if (!responseSend.error) {
      window.AppStorage.clearMailActionData();
      this.props.backToMail();
      NotificationManager.show(true, "message_sent");
    } else {
      this.setState({ buttonBlock: false, sending: false });
      if (responseSend.error.includes("recipient not found")) {
        NotificationManager.show(false, "recipient_not_found");
      } else if (
        responseSend.error.includes(
          "some recipients do not accept anonymous emails",
        )
      ) {
        NotificationManager.show(false, "anonymous_forbidden");
      } else {
        NotificationManager.show(false, "email_send_error");
      }
    }
  }

  handleCancel = () => {
    window.AppStorage.clearMailActionData();
    this.setState({ showDraftConfirm: false });
    this.props.backToMail();
  };

  handleSaveDraft = async () => {
    const { header, body, receivers, draftId, files } = this.state;

    let savedDraftId: number | null = null;

    if (draftId) {
      const response = await updateDraft(
        {
          header: header.trim(),
          body: body.trim(),
          receivers: receivers,
        },
        draftId,
      );

      if (response) {
        savedDraftId = draftId;
      }
    } else {
      if (
        header === "" &&
        body === "" &&
        receivers.length === 0 &&
        files.length === 0
      ) {
        this.props.backToMail();
        return;
      }
      const response = await createDraft({
        header: header.trim(),
        body: body.trim(),
        receivers: receivers,
      });

      if (response) {
        savedDraftId = response.id;
      }
    }

    if (savedDraftId && files.length > 0) {
      await this.uploadFiles(savedDraftId);
    }

    if (savedDraftId) {
      window.AppStorage.clearMailActionData();
      this.props.backToMail();
      NotificationManager.show(true, "draft_saved");
    }

    this.setState({ showDraftConfirm: false });
  };

  handleFileChange = (e: any) => {
    const newFiles: File[] = Array.from(e.target.files || []);

    if (this.fileInputRef) {
      this.fileInputRef.value = "";
    }

    if (newFiles.length === 0) return;

    const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
    const validFiles = newFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        NotificationManager.show(false, "file_too_large");
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const processedFiles = validFiles.map((file: File) => ({
      file: file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploaded: false,
    }));

    this.setState({
      files: [...processedFiles, ...this.state.files],
    });
  };

  handleFileButtonClick = () => {
    if (this.fileInputRef) {
      this.fileInputRef.click();
    }
  };

  removeFile = async (fileId: number) => {
    const { files } = this.state;
    const fileItem = files.find((f: any) => f.id === fileId);
    if (!fileItem) return;

    if (fileItem.uploaded && fileItem.attachmentId && this.state.draftId) {
      try {
        await deleteAttachments(this.state.draftId, [fileItem.attachmentId]);
      } catch (err) {
        console.error("Failed to delete attachment", err);
      }
    }

    this.setState({
      files: this.state.files.filter((file: any) => file.id !== fileId),
    });
  };

  uploadFiles = async (emailId: number) => {
    const { files } = this.state;

    const newFiles = files.filter((f: any) => !f.uploaded);

    if (newFiles.length === 0) return true;

    this.setState({ uploadingFiles: true, sending: true });

    try {
      const uploadPromises = newFiles.map((fileItem: any) =>
        uploadAttachment(emailId, fileItem.file),
      );

      const results = await Promise.all(uploadPromises);

      const allSuccessful = results.every((result) => result !== null);

      if (!allSuccessful) {
        NotificationManager.show(false, "file_upload_error");
        return false;
      }

      return true;
    } catch {
      NotificationManager.show(false, "file_upload_error");
      return false;
    } finally {
      this.setState({ uploadingFiles: false, sending: false });
    }
  };

  handleMobileCloseButton = () => {
    const { header, body, receivers, files } = this.state;
    if (
      header === "" &&
      body === "" &&
      receivers.length === 0 &&
      files.length === 0
    ) {
      this.handleCancel();
      return;
    }

    this.setState({ showDraftConfirm: true });
  };

  handleSetAnonymous = () => {
    this.setState({ isAnonymous: !this.state.isAnonymous });
  };

  t(key: string): string {
    return AppStorage.t(key);
  }

  render() {
    try {
      const {
        body,
        header,
        receivers,
        buttonBlock,
        files,
        uploadingFiles,
        sending,
        replyingToAnonymous,
      } = this.state;
      const isMobile = window.innerWidth < 769;

      return (
        <div className="send-mail">
          {isMobile ? (
            sending ? (
              <div className="send-mail-mobile-buttons">
                <div className="close-button" disabled></div>
                <div className="sending-loader">
                  <div className="spinner" />
                </div>
              </div>
            ) : (
              <div className="send-mail-mobile-buttons">
                <div
                  className="close-button"
                  onClick={this.handleMobileCloseButton}
                ></div>
                <div
                  className="send-button"
                  block={buttonBlock}
                  onClick={(event: any) => {
                    this.handleSubmit(event);
                  }}
                ></div>
              </div>
            )
          ) : null}
          <div className="send-mail-header">
            <span className="send-mail-header__text">
              {this.t("new_letter")}
            </span>
          </div>
          <form action="" className="send-form">
            <div className="send-inputs">
              {replyingToAnonymous ? (
                <span className="input-container" name="anonymous">
                  {this.t("to")}
                  {"\t"}
                  {this.t("anonymous")}
                </span>
              ) : (
                <InputEmail
                  input_title={this.t("to")}
                  placeholder={this.t("enter_email")}
                  emails={receivers}
                  onChange={this.handleReceiversChange.bind(this)}
                />
              )}
              <Input
                type="text"
                placeholder={this.t("enter_subject")}
                input_title={this.t("subject")}
                name="theme"
                maxLength="255"
                value={header}
                onInput={this.handleHeaderChange.bind(this)}
              />
            </div>
            {files.length > 0 ? (
              <HorizontalScroller className="files-list">
                {files.map((fileItem: any) => (
                  <div key={fileItem.id} className="file-item">
                    <div
                      className={`file-icon ${getIconByContentType(fileItem.type)}`}
                    />
                    <div className="file-info">
                      <span className="file-name">
                        {trimFileName(fileItem.name)}
                      </span>
                      <span className="file-size">
                        {formatFileSize(fileItem.size)}
                      </span>
                    </div>
                    <div
                      className="file-remove-btn"
                      onClick={() => this.removeFile(fileItem.id)}
                      disabled={uploadingFiles}
                    />
                  </div>
                ))}
              </HorizontalScroller>
            ) : null}
            {isMobile && (
              <div className="anonymous-radio">
                <input
                  id="anon-toggle"
                  type="checkbox"
                  name="radio-anonymous"
                  checked={this.state.isAnonymous}
                  onChange={this.handleSetAnonymous}
                />
                <label htmlFor="anon-toggle">{this.t("toggle_anon")}</label>
              </div>
            )}
            <Textarea
              readonly={false}
              value={body}
              onInput={this.handleBodyChange}
            />
          </form>
          <div className="send-down">
            <div className="send-tools">
              <input
                type="file"
                ref={(ref: any) => (this.fileInputRef = ref)}
                hidden
                multiple
                onChange={this.handleFileChange}
                accept="*/*"
                disabled={uploadingFiles}
                title={this.t("add_attachment")}
              />
              <div
                className="upload-attachments-button"
                onClick={this.handleFileButtonClick}
                block={uploadingFiles}
              />
            </div>
            {!isMobile ? (
              sending ? (
                <div className="send-actions">
                  <div className="sending-loader">
                    <div className="spinner" />
                    <span>{this.t("sending")}...</span>
                  </div>
                </div>
              ) : (
                <div className="send-actions">
                  <div className="anonymous-radio">
                    <input
                      id="anon-toggle"
                      type="checkbox"
                      name="radio-anonymous"
                      checked={this.state.isAnonymous}
                      onChange={this.handleSetAnonymous}
                    />
                    <label htmlFor="anon-toggle">{this.t("toggle_anon")}</label>
                  </div>
                  <Button
                    title={this.t("save")}
                    name="save-mail"
                    onClick={this.handleSaveDraft}
                    block={sending}
                  />
                  <Button
                    title={this.t("send")}
                    name="send-mail"
                    block={buttonBlock || sending}
                    onClick={(event: any) => {
                      this.handleSubmit(event);
                    }}
                  />
                </div>
              )
            ) : null}
          </div>
          {this.state.showDraftConfirm && (
            <ConfirmationDialog
              text={this.t("confirm_save_draft")}
              cancelButtonTitle={this.t("delete_draft")}
              confirmButtonTitle={this.t("save_draft")}
              callbackCancel={this.handleCancel}
              callbackConfirm={this.handleSaveDraft}
              highlightCancel={false}
            />
          )}
        </div>
      );
    } catch (e) {
      console.error("SendMail render crashed", e);
      return <div>Something went wrong</div>;
    }
  }
}

export default SendMail;
