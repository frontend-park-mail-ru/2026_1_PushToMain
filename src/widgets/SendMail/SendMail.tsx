import Death13 from "@react/stands";
import "./SendMail.scss";
import InputEmail from "../../components/InputEmail/InputEmail";
import Input from "../../components/Input/Input";
import Textarea from "../../components/Textarea/Textarea";
import Button from "../../components/Button/Button";

class SendMail extends Death13.Component {
    render() {
        return (
            <div className="send-mail">
                <form action="" className="send-form">
                    <div className="send-inputs">
                        <InputEmail input_title="Кому:" />
                        <Input type="text" placeholder="Введите тему" input_title="Тема:" name="theme" onInput={() => {}} />
                    </div>
                    <Textarea readonly={false} />
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
                            event.preventDefault();
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default SendMail;
