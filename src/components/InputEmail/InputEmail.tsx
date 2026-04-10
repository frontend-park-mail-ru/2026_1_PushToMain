import Death13 from "@react/stands";
import "./InputEmail.scss";

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
        emails: [],
        currentInput: "",
        error: "",
    };

    validateEmail(email: string) {
        const emailRegex = /^[a-zA-Z0-9._-]+@smail.ru/gm;
        return emailRegex.test(email);
    }

    addEmail(email: string) {
        const trimmedEmail = email.trim();

        if (!trimmedEmail) return;

        const valid = this.validateEmail(trimmedEmail);

        if (!valid) {
            return;
        }

        if (this.state.emails.includes(trimmedEmail)) {
            this.setState({ error: "Такой email уже добавлен" });
            return;
        }

        const newEmails = [...this.state.emails, trimmedEmail];

        this.setState({
            emails: newEmails,
            currentInput: "",
            error: "",
        });

        if (this.props.onChange) {
            this.props.onChange(newEmails);
        }
    }

    handleInput(e: any) {
        const value = e.target.value;
        this.setState({ currentInput: value, error: "" });
    }

    handleKeyDown(e: any) {
        if (e.key === "Enter") {
            e.preventDefault();
            this.addEmail(this.state.currentInput);
        }
    }

    removeEmail(index: number) {
        const newEmails = [...this.state.emails];
        newEmails.splice(index, 1);

        this.setState({ emails: newEmails });

        if (this.props.onChange) {
            this.props.onChange(newEmails);
        }
    }

    handleOnBlur() {
        this.addEmail(this.state.currentInput);
    }

    handleUpdateEmail(event: any) {
        event.preventDefault();

    }

    render() {
        const { emails, currentInput } = this.state;
        return (
            <div className="input-container">
                <span className="input__title">{this.props.input_title}</span>
                <div className="input-form">
                    {emails.map((email: string, index: number) => (
                        <span
                            key={index}
                            className="email-tag"
                            onClick={(event: any) => {
                                this.handleUpdateEmail(event);
                            }}>
                            <span>{email}</span>
                            <button type="button" className="remove-email" onClick={() => this.removeEmail(index)}>
                                ×
                            </button>
                        </span>
                    ))}
                    <input
                        type="text"
                        value={currentInput}
                        onInput={this.handleInput}
                        onblur={this.handleOnBlur}
                        onKeyDown={this.handleKeyDown}
                        placeholder={this.props.placeholder}
                        className="email-input"
                    />{" "}
                </div>
            </div>
        );
    }
}

export default InputEmail;
