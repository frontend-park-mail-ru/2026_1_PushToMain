import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import "./MailHeader.scss";

class MailHeader extends Death13.Component {
    state: any = {
        isSelectedAll: false,
    };
    handleSelectAll = (e: any) => {
        const isChecked = e.target.checked;
        this.props.onSelectAll(isChecked);
    };

    render() {
        const { isSelectedAll } = this.state;
        return (
            <div className="mail-header">
                <div className="mail-header__left-container">
                    <div className="left-container__select-all">
                        <Input type="checkbox" name="checkbox-all" help="Выбрать" checked={isSelectedAll} onInput={this.handleSelectAll} />
                        <Button
                            svg="../../assets/svg/ArrowDown.svg"
                            name="arrow-down"
                            help="Выбрать"
                            onClick={(event: any) => {
                                event.preventDefault();
                            }}
                        />
                    </div>
                    <Button
                        svg="../../assets/svg/ThreeDotsVertical.svg"
                        name="ect"
                        help="Ещё"
                        onClick={(event: any) => {
                            event.preventDefault();
                        }}
                    />
                    <Button
                        svg="../../assets/svg/Refresh.svg"
                        name="refresh"
                        help="Обновить"
                        onClick={(event: any) => {
                            event.preventDefault();
                        }}
                    />
                </div>
                <div className="mail-header__right-container"></div>
            </div>
        );
    }
}

export default MailHeader;
