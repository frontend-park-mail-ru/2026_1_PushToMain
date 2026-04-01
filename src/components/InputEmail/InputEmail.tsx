import Death13 from "@react/stands";
import "./InputEmail.scss";

class InputEmail extends Death13.Component {
    render() {
        return (
            <div className="input-container">
                <span className="input__title">{this.props.input_title}</span>
                <div className="input-form">
                    <input></input>
                </div>
            </div>
        );
    }
}

export default InputEmail;
