import Death13 from "@react/stands";
import "./Input.scss";

class Input extends Death13.Component {
    state: any = {
        showPassword: false,
    };

    togglePasswordVisibility = () => {
        this.setState({ showPassword: !this.state.showPassword });
    };

    render() {
        const hasError = this.props.error;
        const hasValue = this.props.value;
        const isValid = hasValue && !hasError;
        const isPassword = this.props.type === "password";
        const isCheckbox = this.props.type === "checkbox";
        const inputType = isPassword && this.state.showPassword ? "text" : this.props.type;
        
        return (
            <div className="input-container" data-input-name={this.props.name}>
                <span className="input__title">{this.props.input_title}</span>
                <div className={`input-form ${hasError ? "error" : ""} ${isValid ? "success" : ""}`}>
                    {this.props.svg && <img src={this.props.svg} alt="" />}
                    <input
                        type={inputType}
                        id={this.props.id}
                        name={this.props.name}
                        placeholder={this.props.placeholder}
                        onInput={!isCheckbox ? (event: any) => {
                            this.props.onInput(event);
                        } : undefined}
                        onChange={isCheckbox ? (event: any) => {
                            this.props.onInput(event);
                        } : undefined}
                        checked={isCheckbox ? this.props.checked : undefined}
                        readOnly={this.props.readonly || false}
                        maxLength={this.props.maxLength || 100}
                        value={!isCheckbox ? (this.props.value || "") : undefined}
                    />
                    {isPassword && (
                        <div
                            className={`password-toggle ${!this.state.showPassword ? "off" : ""}`}
                            onClick={this.togglePasswordVisibility}
                        />
                    )}
                </div>

                <div className="auth-input__error" name={this.props.name}>
                    {this.props.error}
                </div>
            </div>
        );
    }
}

export default Input;