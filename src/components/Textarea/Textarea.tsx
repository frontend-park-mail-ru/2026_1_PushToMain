import Death13 from "@react/stands";
import "./Textarea.scss";

class Textarea extends Death13.Component {
    handleInput = (e: any) => {
        if (this.props.onInput) {
            this.props.onInput(e);
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
