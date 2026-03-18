import Death13 from "@react/stands";
import "./Button.css";

class Button extends Death13.Component {
    render() {
        return (
            <button
                type="button"
                name={this.props.name}
                title={this.props.help || ""}
                onclick={(event: any) => {
                    this.props.onClick(event);
                }}>
                {this.props.svg && <img src={this.props.svg} alt="" />}
                {this.props.title || ""}
            </button>
        );
    }
}

export default Button;
