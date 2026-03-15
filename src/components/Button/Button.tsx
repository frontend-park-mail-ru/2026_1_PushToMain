import Death13 from "@react/stands";
import "./Button.css"

class Button extends Death13.Component {

    render(props: any) {
        return <button type="button" name={this.props.name} onClick={(event: any) => props?.onClick?.(event)}>{this.props.title || "Кнопка"}</button>;
    }
}

export default Button;
