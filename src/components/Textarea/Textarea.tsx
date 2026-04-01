import Death13 from "@react/stands";
import "./Textarea.scss";

class Textarea extends Death13.Component {
    render() {
        return <textarea readonly={this.props.readonly}>{this.props.value || ""}</textarea>;
    }
}

export default Textarea;
