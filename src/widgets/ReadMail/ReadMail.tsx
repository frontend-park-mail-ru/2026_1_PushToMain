import Death13 from "@react/stands";
import "./ReadMail.scss";
import Input from "../../components/Input/Input";
import InputEmail from "../../components/InputEmail/InputEmail";
import Textarea from "../../components/Textarea/Textarea";
import MailTools from "../MailTools/MailTools";

class ReadMail extends Death13.Component {
    render() {
        const { email } = this.props;

        return (
            <div className="read-mail">
                <form action="" className="read-form">
                    <div className="read-inputs">
                        <InputEmail input_title="Кому:" />
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
                <MailTools />
            </div>
        );
    }
}

export default ReadMail;
