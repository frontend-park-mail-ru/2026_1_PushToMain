import Death13 from "@react/stands";
import "./Textarea.scss";

class Textarea extends Death13.Component {
    handleInput = (e: any) => {
        if (this.props.onInput) {
            this.props.onInput(e);
        }
    };

    render() {
        return <textarea readOnly={this.props.readonly} value={this.props.value || ""} onInput={this.handleInput} />;
    }
}

export default Textarea;
