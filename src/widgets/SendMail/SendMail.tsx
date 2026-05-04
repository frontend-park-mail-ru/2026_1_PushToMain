import Death13 from "@react/stands";
import "./SendMail.scss";
import InputEmail from "../../components/InputEmail/InputEmail";
import Input from "../../components/Input/Input";
import Textarea from "../../components/Textarea/Textarea";
import Button from "../../components/Button/Button";
import { sendEmail } from "../../api/ApiEmail";
import { AppStorage } from "../../App";
import { createDraft, sendDraft } from "../../api/ApiDraft";

class SendMail extends Death13.Component {
  state: any = {
    header: "",
    body: "",
    receivers: [],
    invalidReceivers: [],
    buttonBlock: true,
    files: [],
    draftId: null,
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
      newState.header,
      newState.body,
      newState.receivers,
      newState.invalidReceivers,
    );
    newState.buttonBlock = !isValid;

    this.state = newState;
  }

  isFormValid = (
    header: string,
    body: string,
    receivers: string[],
    invalidReceivers: string[],
  ): boolean => {
    return (
      header.trim().length > 0 &&
      body.trim().length > 0 &&
      receivers.length > 0 &&
      (invalidReceivers || []).length === 0
    );
  };

  updateButtonState = () => {
    const { header, body, receivers, invalidReceivers } = this.state;
    const isValid = this.isFormValid(header, body, receivers, invalidReceivers);
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
    const { header, body, receivers, draftId } = this.state;
    e.preventDefault();

    this.setState({ buttonBlock: true });

    let responseSend;

    if (draftId) {
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
      });
    }

    if (responseSend) {
      window.AppStorage.clearMailActionData();
      this.props.backToMail();
    }
  }

  handleCancel = () => {
    window.AppStorage.clearMailActionData();
    this.props.backToMail();
  };

  handleSaveDraft = async (event: any) => {
    const { header, body, receivers } = this.state;

    event.preventDefault();

    const response = await createDraft({
      header: header.trim(),
      body: body.trim(),
      receivers: receivers,
    });

    if (response) {
      window.AppStorage.clearMailActionData();
      this.props.backToMail();
    }
  };

  handleFileChange = (e: any) => {
    const files: File[] = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const newFiles = files.map((file: File) => ({
      file: file,
      id: Date.now(),
      name: file.name,
      size: file.size,
      type: file.type,
    }));

    this.setState({
      files: [...this.state.files, ...newFiles],
    });

    files.forEach((file: File) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
    });
  };

  removeFile = (fileId: number) => {
    this.setState({
      files: this.state.files.filter((file: any) => file.id !== fileId),
    });
  };

  t(key: string): string {
    return AppStorage.t(key);
  }

  render() {
    const { body, header, receivers, buttonBlock, files } = this.state;
    const isMobile = window.innerWidth < 769;

    return (
      <div className="send-mail">
        {isMobile ? (
          <div className="send-mail-mobile-buttons">
            <img
              className="close-button"
              src="../../assets/svg/Close.svg"
              onClick={this.handleSaveDraft}
            ></img>
            <img
              className="send-button"
              src="../../assets/svg/Sent.svg"
              onClick={(event: any) => {
                this.handleSubmit(event);
              }}
            ></img>
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
          <Textarea
            readonly={false}
            value={body}
            onInput={this.handleBodyChange}
          />
          <div className="files-list">
            {files.map((fileItem: any) => (
              <div key={fileItem.id} className="file-item">
                <span>{fileItem.name}</span>
                <button onClick={() => this.removeFile(fileItem.id)}>✕</button>
              </div>
            ))}
          </div>
        </form>
        <div className="send-down">
          <div className="send-tools">
            {/* <input type="file" name="file" id="input-file" hidden multiple onChange={this.handleFileChange} />
                        <label htmlFor="input-file" name="button-file"></label>*/}
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
