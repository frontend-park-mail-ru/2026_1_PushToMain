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

        console.log("1", header, "2", body, "3", receivers);

        const response = await sendEmail({
            header: header.trim(),
            body: body.trim(),
            receivers: receivers,
        });
    }

    render() {
        const { header, body, receivers } = this.state;

        return (
            <div className="send-mail">
                <form action="" className="send-form">
                    <div className="send-inputs">
                        <InputEmail input_title="Кому:" placeholder="Введите почту" onChange={this.handleReceiversChange.bind(this)} />
                        <Input
                            type="text"
                            placeholder="Введите тему"
                            input_title="Тема:"
                            name="theme"
                            maxLength="255"
                            onInput={this.handleHeaderChange.bind(this)}
                        />
                    </div>
                    <Textarea readonly={false} value={body} onChange={this.handleBodyChange.bind(this)} />
                </form>
                <div className="send-actions">
                    <Button
                        title="Сохранить"
                        name="save-mail"
                        onClick={(event: any) => {
                            event.preventDefault();
                        }}
                    />{" "}
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
