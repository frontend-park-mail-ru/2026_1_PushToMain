import Death13 from "@react/stands";
import "./Input.scss";

class Input extends Death13.Component {
  state: any = {
    showPassword: false,
  };

  componentDidUpdate(prevProps: any) {
    if (prevProps.value !== this.props.value) {
      this.setState({});
    }
  }

  togglePasswordVisibility = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render() {
    const hasError = this.props.error;
    const hasSuccess = this.props.success;
    const isPassword = this.props.type === "password";
    const isCheckbox = this.props.type === "checkbox";
    const isRadio = this.props.type === "radio";
    const inputType =
      isPassword && this.state.showPassword ? "text" : this.props.type;

    return (
      <div className="input-container" data-input-name={this.props.name}>
        <span className="input__title">{this.props.input_title}</span>
        <div
          className={`input-form ${hasError ? "error" : ""} ${hasSuccess ? "success" : ""} ${
            this.props.suffix ? "has-suffix" : ""
          }`}
        >
          {this.props.svg && <img src={this.props.svg} alt="" />}
          <input
            type={inputType}
            className={this.props.className}
            id={this.props.id}
            name={this.props.name}
            placeholder={this.props.placeholder}
            onInput={!isCheckbox && !isRadio ? this.props.onInput : undefined}
            onChange={isCheckbox || isRadio ? this.props.onChange : undefined}
            checked={isCheckbox || isRadio ? this.props.checked : undefined}
            readOnly={this.props.readonly || false}
            maxLength={this.props.maxLength || 100}
            value={!isCheckbox && !isRadio ? this.props.value || "" : undefined}
          />
          {isPassword && (
            <div
              className={`password-toggle ${!this.state.showPassword ? "off" : ""}`}
              onClick={this.togglePasswordVisibility}
            />
          )}
          {this.props.suffix && (
            <span className="input-suffix" aria-hidden="true">
              {this.props.suffix}
            </span>
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
