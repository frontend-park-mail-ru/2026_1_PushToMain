import Death13 from "@react/stands";
import "./SendMail.scss";
import InputEmail from "../../components/InputEmail/InputEmail";
import Input from "../../components/Input/Input";
import Textarea from "../../components/Textarea/Textarea";
import Button from "../../components/Button/Button";
import { sendEmail } from "../../api/ApiEmail";

class SendMail extends Death13.Component {
    state: any = {
        header: "",
        body: "",
        receivers: [],
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

    handleHeaderChange = (e: any) => {
        this.setState({ header: e.target.value });
    };

    handleBodyChange = (e: any) => {
        this.setState({ body: e.target.value });
    };

    handleReceiversChange = (emails: string[]) => {
        this.setState({ receivers: emails });
    };

    async handleSubmit(e: any) {
        const { header, body, receivers } = this.state;

        e.preventDefault();

        if (!header.trim()) {
            return;
        }

        if (!body.trim()) {
            return;
        }

        if (!receivers || receivers.length === 0) {
            return;
        }

        const response = await sendEmail({
            header: header.trim(),
            body: body.trim(),
            receivers: receivers,
        });

        if (response) {
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

    render() {
        const { body, header, receivers } = this.state;

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
                    <Textarea readonly={false} value={body} onChange={this.handleBodyChange.bind(this)} />
                </form>
                <div className="send-actions">
                    <Button title="Сохранить" name="save-mail" onClick={this.handleSaveDraft} />{" "}
                    <Button
                        title="Отправить"
                        name="send-mail"
                        onClick={(event: any) => {
                            this.handleSubmit(event);
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default SendMail;
