import Death13 from "@react/stands";
import "./SendMail.scss";
import InputEmail from "../../components/InputEmail/InputEmail";
import Input from "../../components/Input/Input";
import Textarea from "../../components/Textarea/Textarea";
import Button from "../../components/Button/Button";
import { sendEmail, uploadFile } from "../../api/ApiEmail";

class SendMail extends Death13.Component {
    state: any = {
        header: "",
        body: "",
        receivers: [],
        invalidReceivers: [],
        buttonBlock: true,
        files: [],
    };

    constructor(props: any) {
        super(props);
        this.initializeFromActionData();
    }

    initializeFromActionData = () => {
        const { actionData } = this.props;

        if (actionData) {
            if (actionData.type === "reply") {
                this.state = {
                    header: actionData.subject || "",
                    body: actionData.body || "",
                    receivers: actionData.to ? [actionData.to] : [],
                };
            } else if (actionData.type === "forward") {
                this.state = {
                    header: actionData.subject || "",
                    body: actionData.body || "",
                    receivers: [],
                };
            }
        }
    };

    isFormValid = (header: string, body: string, receivers: string[], invalidReceivers: string[]): boolean => {
        return header.trim().length > 0 && body.trim().length > 0 && receivers.length > 0 && (invalidReceivers || []).length === 0;
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
        const { header, body, receivers } = this.state;
        e.preventDefault();

        this.setState({ buttonBlock: true });

        const responseSend = await sendEmail({
            header: header.trim(),
            body: body.trim(),
            receivers: receivers,
        });

        const file = this.state.files;

        const responseFile = await uploadFile(file, responseSend.emailId);

        if (responseSend && responseFile) {
            window.AppStorage.clearMailActionData();
            this.props.backToMail();
        }
    }

    handleCancel = () => {
        window.AppStorage.clearMailActionData();
        this.props.backToMail();
    };

    handleSaveDraft = (event: any) => {
        event.preventDefault();
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

    render() {
        const { body, header, receivers, buttonBlock } = this.state;

        return (
            <div className="send-mail">
                <div className="send-mail-header"></div>
                <form action="" className="send-form">
                    <div className="send-inputs">
                        <InputEmail
                            input_title="Кому:"
                            placeholder="Введите почту"
                            emails={receivers}
                            onChange={this.handleReceiversChange.bind(this)}
                        />
                        <Input
                            type="text"
                            placeholder="Введите тему"
                            input_title="Тема:"
                            name="theme"
                            maxLength="255"
                            value={header}
                            onInput={this.handleHeaderChange.bind(this)}
                        />
                    </div>
                    <Textarea readonly={false} value={body} onInput={this.handleBodyChange} />{" "}
                    <div className="files-list">
                        {this.state.files.map((fileItem: any) => (
                            <div key={fileItem.id} className="file-item">
                                <span>{fileItem.name}</span>
                                <button onClick={() => this.removeFile(fileItem.id)}>✕</button>
                            </div>
                        ))}
                    </div>
                </form>
                <div className="send-down">
                    <div className="send-tools">
                        <input type="file" name="file" id="input-file" hidden multiple onChange={this.handleFileChange} />
                        <label for="input-file" name="button-file"></label>
                    </div>
                    <div className="send-actions">
                        <Button title="Сохранить" name="save-mail" onClick={this.handleSaveDraft} />{" "}
                        <Button
                            title="Отправить"
                            name="send-mail"
                            block={buttonBlock}
                            onClick={(event: any) => {
                                this.handleSubmit(event);
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default SendMail;
