import Death13 from "@react/stands";
import "./Button.scss";

class Button extends Death13.Component {
  render() {
    const {
      svg,
      className,
      size = "20",
      title,
      count,
      block,
      isSelect,
      active,
      type,
      name,
      help,
      onClick,
    } = this.props;
    return (
      <button
        className={className}
        disabled={block}
        data-is-select={isSelect}
        data-active={active ? "true" : "false"}
        type={type || "button"}
        name={name}
        title={help || ""}
        onClick={(event: any) => {
          onClick(event);
        }}
      >
        {svg && <img src={svg} width={size} height={size} alt="" />}
        <span>{title || ""}</span>
        {count !== 0 && <span className="button-count">{count}</span>}
      </button>
    );
  }
}

export default Button;
