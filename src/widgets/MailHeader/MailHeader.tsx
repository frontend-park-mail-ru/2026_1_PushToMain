import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import "./MailHeader.scss";
import { getEmailAll } from "../../api/ApiEmail";

class MailHeader extends Death13.Component {
    state: any = {
        isSelectedAll: false,
        countEmail: "",
        offset: 0,
    };

    handleSelectAll = (e: any) => {
        const isChecked = e.target.checked;
        this.props.onSelectAll(isChecked);
    };

    handlePrevPage(event: any) {
        event.preventDefault();
        const { offset } = this.state;
        const newOffset = Math.max(0, offset - 50);
        this.setState({ offset: newOffset });
        this.props.loadEmail(newOffset);
    }

    handleNextPage(event: any) {
        event.preventDefault();
        const { offset } = this.state;
        const { total } = this.props;
        const newOffset = offset + 50;
        if (newOffset < total) {
            this.setState({ offset: newOffset });
        }
        this.props.loadEmail(newOffset);
    }

    render() {
        const { isSelectedAll, offset } = this.state;
        const { total } = this.props;
        const startItem = total > 0 ? offset + 1 : 0;
        const endItem = Math.min(offset + 50, total);
        return (
            <div className="mail-header">
                <div className="mail-header__left-container">
                    <div className="left-container__select-all">
                        <Input type="checkbox" name="checkbox-all" help="Выбрать" checked={isSelectedAll} onInput={this.handleSelectAll} />
                        <Button
                            name="arrow-down"
                            help="Выбрать"
                            onClick={(event: any) => {
                                event.preventDefault();
                            }}
                        />
                    </div>
                    {/*
                    <Button
                        svg="../../assets/svg/ThreeDotsVertical.svg"
                        name="ect"
                        help="Ещё"
                        onClick={(event: any) => {
                            event.preventDefault();
                        }}
                    />
                    */}
                    <Button
                        svg="../../assets/svg/Refresh.svg"
                        name="refresh"
                        help="Обновить"
                        onClick={(event: any) => {
                            event.preventDefault();
                            this.props.reloadMail();
                        }}
                    />
                    
                </div>
                <div className="mail-header__right-container">
                    <div className="count-email">
                        {startItem} - {endItem} из {total}
                    </div>
                    <Button name="left" help="Пред." block={offset === 0} onClick={(event: any) => this.handlePrevPage(event)} />
                    <Button name="right" help="След." block={offset + 50 >= total} onClick={(event: any) => this.handleNextPage(event)} />
                </div>
            </div>
        );
    }
}

export default MailHeader;
