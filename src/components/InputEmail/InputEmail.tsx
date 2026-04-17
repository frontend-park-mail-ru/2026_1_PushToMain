import Death13 from "@react/stands";
import "./InputEmail.scss";
import { AppStorage } from "../../App";

class InputEmail extends Death13.Component {
    constructor(props: any) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.addEmail = this.addEmail.bind(this);
        this.removeEmail = this.removeEmail.bind(this);
        this.handleOnBlur = this.handleOnBlur.bind(this);
    }

    state: any = {
        emails: this.props.emails || [AppStorage.email],
        invalidEmails: [],
        currentInput: "",
        error: "",
    };

    validateEmail(email: string) {
        const emailRegex = /^[a-zA-Z0-9._-]+@smail\.ru$/;
        return emailRegex.test(email);
    }

    addEmail(email: string) {
        const trimmedEmail = email.trim();

        if (!trimmedEmail) {
            return;
        }

        if (!this.validateEmail(trimmedEmail)) {
            const newEmails = [...this.state.emails, trimmedEmail];
            const invalidEmails = [...this.state.invalidEmails, trimmedEmail];

            this.setState({
                emails: newEmails,
                invalidEmails: invalidEmails,
                currentInput: "",
                error: "Некорректный email адрес",
            });

            if (this.props.onChange) {
                this.props.onChange(this.state.emails, this.state.invalidEmails);
            }
            return;
        }

        if (this.state.emails.includes(trimmedEmail)) {
            this.setState({
                error: "Такой email уже добавлен",
            });
            return;
        }

        const newEmails = [...this.state.emails, trimmedEmail];

        this.setState({
            emails: newEmails,
            currentInput: "",
            error: "",
        });

        if (this.props.onChange) {
            this.props.onChange(this.state.emails, this.state.invalidEmails);
        }
    }

    handleInput(e: any) {
        const value = e.target.value;
        this.setState({
            currentInput: value,
            error: "",
        });
    }

    handleKeyDown(e: any) {
        if (e.key === "Enter") {
            e.preventDefault();
            this.addEmail(this.state.currentInput);
        }
    }

    removeEmail(index: number) {
        const newEmails = [...this.state.emails];
        const removedEmail = newEmails[index];
        newEmails.splice(index, 1);

        const invalidEmails = this.state.invalidEmails.filter((email: string) => email !== removedEmail);

        this.setState({
            emails: newEmails,
            invalidEmails: invalidEmails,
            error: "",
        });

        if (this.props.onChange) {
            this.props.onChange(newEmails, this.state.invalidEmails);
        }
    }

    handleOnBlur() {
        if (this.state.currentInput.trim()) {
            this.addEmail(this.state.currentInput);
        }
    }

    render() {
        const { emails, currentInput, invalidEmails } = this.state;

        return (
            <div className="input-container">
                <span className="input__title">{this.props.input_title}</span>
                <div className="input-form">
                    {emails.map((email: string, index: number) => {
                        const isInvalid = invalidEmails.includes(email);
                        return (
                            <span key={index} className={isInvalid ? "email-tag__error" : "email-tag"}>
                                <span>{email}</span>
                                <button type="button" className="remove-email" onClick={() => this.removeEmail(index)}>
                                    ×
                                </button>
                            </span>
                        );
                    })}
                    <input
                        type="text"
                        value={currentInput}
                        onInput={this.handleInput}
                        onBlur={this.handleOnBlur}
                        onKeyDown={this.handleKeyDown}
                        placeholder={this.props.placeholder}
                        className="email-input"
                    />
                </div>
            </div>
        );
    }
}

export default InputEmail;
