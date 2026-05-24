import Death13 from "@react/stands";
import "./SendMail.scss";
import InputEmail from "../../components/InputEmail/InputEmail";
import Input from "../../components/Input/Input";
import Textarea from "../../components/Textarea/Textarea";
import Button from "../../components/Button/Button";
import NotificationManager from "../NotificationManager/NotificationManager";
import { sendEmail } from "../../api/ApiEmail";
import { uploadAttachment } from "../../api/ApiAttachments";
import { AppStorage } from "../../App";
import { createDraft, sendDraft, updateDraft } from "../../api/ApiDraft";
import { formatFileSize } from "../../utils/files";

class SendMail extends Death13.Component {
  state: any = {
    header: "",
    body: "",
    receivers: [],
    invalidReceivers: [],
    buttonBlock: true,
    files: [],
    draftId: null,
    emailId: null,
    uploadingFiles: false,
  };

  fileInputRef: HTMLInputElement | null = null;

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
    );
    newState.buttonBlock = !isValid;

    this.state = newState;
  }

  isFormValid = (
    body: string,
    receivers: string[],
    invalidReceivers: string[],
  ): boolean => {
    return (
      body.trim().length > 0 &&
      receivers.length > 0 &&
      (invalidReceivers || []).length === 0
    );
  };

  updateButtonState = () => {
    const { body, receivers, invalidReceivers } = this.state;
    const isValid = this.isFormValid(body, receivers, invalidReceivers);
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

  async handleSubmit(e: any) {
    const { header, body, receivers, draftId, files } = this.state;
    e.preventDefault();

    this.setState({ buttonBlock: true });

    let responseSend;

    if (draftId) {
      await updateDraft(
        {
          header: header.trim(),
          body: body.trim(),
          receivers: receivers,
        },
        draftId,
      );
      responseSend = await sendDraft(
        {
          header: header.trim(),
          body: body.trim(),
          receivers: receivers,
        },
        draftId,
      );
    } else {
      responseSend = await sendEmail({
        header: header.trim(),
        body: body.trim(),
        receivers: receivers,
        files: files.map((f: any) => f.file),
      });
    }

    if (!responseSend.error) {
      window.AppStorage.clearMailActionData();
      this.props.backToMail();
    } else {
      this.setState({ buttonBlock: false });
      if (responseSend.error.includes("recipient not found")) {
        NotificationManager.show(false, "recipient_not_found");
      } else {
        NotificationManager.show(false, "email_send_error");
      }
    }
  }

  handleCancel = () => {
    window.AppStorage.clearMailActionData();
    this.props.backToMail();
  };

  handleSaveDraft = async (event: any) => {
    const { header, body, receivers, draftId, files } = this.state;

    event.preventDefault();

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
    }));

    this.setState({
      files: [...this.state.files, ...processedFiles],
    });
  };

  handleFileButtonClick = () => {
    if (this.fileInputRef) {
      this.fileInputRef.click();
    }
  };

  removeFile = (fileId: number) => {
    this.setState({
      files: this.state.files.filter((file: any) => file.id !== fileId),
    });
  };

  uploadFiles = async (emailId: number) => {
    const { files } = this.state;

    if (files.length === 0) return true;

    this.setState({ uploadingFiles: true });

    try {
      const uploadPromises = files.map((fileItem: any) =>
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
      this.setState({ uploadingFiles: false });
    }
  };

  t(key: string): string {
    return AppStorage.t(key);
  }

  render() {
    const { body, header, receivers, buttonBlock, files, uploadingFiles } =
      this.state;
    const isMobile = window.innerWidth < 769;

    return (
      <div className="send-mail">
        {isMobile ? (
          <div className="send-mail-mobile-buttons">
            <div className="close-button" onClick={this.handleSaveDraft}></div>
            <div
              className="send-button"
              block={buttonBlock}
              onClick={(event: any) => {
                this.handleSubmit(event);
              }}
            ></div>
          </div>
        ) : null}
        <div className="send-mail-header">
          <span className="send-mail-header__text">{this.t("new_letter")}</span>
        </div>
        <form action="" className="send-form">
          <div className="send-inputs">
            <InputEmail
              input_title={this.t("to")}
              placeholder={this.t("enter_email")}
              emails={receivers}
              onChange={this.handleReceiversChange.bind(this)}
            />
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
            <div className="files-list">
              {files.map((fileItem: any) => (
                <div key={fileItem.id} className="file-item">
                  <div className="file-icon" />
                  <div className="file-info">
                    <span className="file-name">{fileItem.name}</span>
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
            </div>
          ) : null}
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
            />
            <div
              className="upload-attachments-button"
              onClick={this.handleFileButtonClick}
              block={uploadingFiles}
            />
          </div>
          {!isMobile ? (
            <div className="send-actions">
              <Button
                title={this.t("save")}
                name="save-mail"
                onClick={this.handleSaveDraft}
              />
              <Button
                title={this.t("send")}
                name="send-mail"
                block={buttonBlock}
                onClick={(event: any) => {
                  this.handleSubmit(event);
                }}
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}

export default SendMail;
