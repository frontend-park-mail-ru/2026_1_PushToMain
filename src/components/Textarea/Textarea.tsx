import Death13 from "@react/stands";
import "./Textarea.scss";

class Textarea extends Death13.Component {
  handleChange = (e: any) => {
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  };

  render() {
    return (
      <div>
        <span className="input__title">{this.props.input_title}</span>
        <textarea
          className={this.props.className}
          readonly={this.props.readonly}
          value={this.props.value || ""}
          placeholder={this.props.placeholder}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

export default Textarea;
