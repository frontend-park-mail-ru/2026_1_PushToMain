import Death13 from "@react/stands";
import "./Button.scss";

class Button extends Death13.Component {
  render() {
    const iconSize = this.props.iconSize || 24;
    console.log(iconSize);
    return (
      <button
        disabled={this.props.block}
        data-is-select={this.props.isSelect}
        type={this.props.type || "button"}
        name={this.props.name}
        title={this.props.help || ""}
        onClick={(event: any) => {
          this.props.onClick(event);
        }}
      >
        {this.props.svg && (
          <img src={this.props.svg} width={iconSize} height={iconSize} alt="" />
        )}
        {this.props.title || ""}
        {this.props.count !== 0 && (
          <span className="button-count">{this.props.count}</span>
        )}
      </button>
    );
  }
}

export default Button;
