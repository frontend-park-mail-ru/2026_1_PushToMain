import Death13 from "@react/stands";
import "./Input.css";

class Input extends Death13.Component {
    render() {
        return (
            <div className="input-container" data-input-name={this.props.name}>
                <span className="input__title">{this.props.input_title}</span>
                <div className="input-form">
                    {this.props.svg && <img src={this.props.svg} alt="" />}
                    <input
                        type={this.props.type}
                        name={this.props.name}
                        placeholder={this.props.placeholder}
                        oninput={(event: any) => {
                            this.props.onInput(event);
                        }}
                        maxlength="100"
                        value={this.props.value || ''}
                    />
                </div>
                <div className="auth-input__error" name={this.props.name}></div>
            </div>
        );
    }

    setStatusInput(valid: { errors: Array<{ field: string; message: string }> }, page: HTMLElement) {
        page.querySelectorAll(".input-form").forEach((inputForm) => {
            inputForm.classList.remove("error", "success");
        });
        valid.errors.forEach((err) => {
            const inputForm = page.querySelector(`input[name="${err.field}"]`)?.closest(".input-form");
            if (inputForm) {
                inputForm.classList.add("error");
            }
        });

        const fields = ["name", "surname", "password", "email"];
        fields.forEach((field) => {
            if (!valid.errors.some((err) => err.field === field)) {
                const inputForm = page.querySelector(`input[name="${field}"]`)?.closest(".input-form");
                if (inputForm) {
                    inputForm.classList.add("success");
                }
            }
        });
    }
}

export default Input;
