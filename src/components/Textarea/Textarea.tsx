import Death13 from "@react/stands";
import "./Textarea.scss";

class Textarea extends Death13.Component {
    handleChange = (e: any) => {
        if (this.props.onChange) {
            this.props.onChange(e);
        }
    };

    render() {
        return <textarea readonly={this.props.readonly} value={this.props.value || ""} onChange={this.handleChange} />;
    }
}

export default Textarea;
