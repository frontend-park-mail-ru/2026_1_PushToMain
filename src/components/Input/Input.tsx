import Death13 from "@react/stands";
import "./Input.css";

class Input extends Death13.Component {
    render() {
        return (
            <div className="input-container" data-input-name={this.props.name}>
                <span className="input__title">{this.props.input_title}</span>
                <div className="input-form">
                    <input type={this.props.type} name={this.props.name} placeholder={this.props.placeholder} maxlength="100"></input>
                </div>
                <div className="auth-input__error" name={this.props.name}></div>
            </div>
        );
    }
}

export default Input;
