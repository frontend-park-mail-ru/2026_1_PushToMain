import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import "./MailHeader.scss";
import { AppStorage } from "../../App";

class MailHeader extends Death13.Component {
    state: any = {
        showFolderList: false,
    };

    handleSelectAll = (e: any) => {
        const isChecked = e.target.checked;
        this.props.onSelectAll(isChecked);
    };

    handlePrevPage = (event: any) => {
        event.preventDefault();
        const { offset } = this.props;
        const newOffset = Math.max(0, offset - 50);
        this.props.loadEmail(newOffset);
    };

    handleNextPage = (event: any) => {
        event.preventDefault();
        const { offset, total } = this.props;
        const newOffset = offset + 50;
        if (newOffset < total) {
            this.props.loadEmail(newOffset);
        }
    };

    handleMoveToFolder = (event: any) => {
        event.preventDefault();
        event.stopPropagation();
        this.setState({ showFolderList: !this.state.showFolderList });
    };

    handleFolderSelect = (folderId: number, e: any) => {
        e.stopPropagation();
        this.setState({ showFolderList: false });
        if (this.props.onMoveToFolder) {
            this.props.onMoveToFolder(folderId);
        }
    };

    handleClickOutside = () => {
        this.setState({ showFolderList: false });
    };

    t(key: string): string {
        return AppStorage.t(key);
    }

    render() {
        const { isSelectAll, offset = 0, total = 0, hasUnreadSelected = false, mainPage = false } = this.props;
        const startItem = total > 0 ? offset + 1 : 0;
        const endItem = Math.min(offset + 50, total);
        const hasSelected = this.props.selectedCount > 0;
        const { showFolderList } = this.state;

        const folders = AppStorage.folders || [];

        return (
            <div className="mail-header">
                <div className="mail-header__left-container">
                    <div className="left-container__select-all">
                        <Input
                            type="checkbox"
                            className={`checkbox-all ${isSelectAll ? "isSelect" : ""}`}
                            name="checkbox-all"
                            help="Выбрать все"
                            checked={isSelectAll}
                            onChange={this.handleSelectAll}
                        />
                        <Button
                            name="arrow-down"
                            help="Выбрать"
                            onClick={(event: any) => {
                                event.preventDefault();
                            }}
                        />
                    </div>

                    {!hasSelected && (
                        <Button
                            name="refresh"
                            help={this.t("refresh")}
                            onClick={(event: any) => {
                                event.preventDefault();
                                this.props.reloadMail();
                            }}
                        />
                    )}

                    {hasSelected && (
                        <div className="select-all-container">
                            <div className="select-all__tools-left">
                                <Button
                                    name="favorites"
                                    help={this.t("starred")}
                                    onClick={(event: any) => {
                                        event.preventDefault();
                                        this.props.reloadMail();
                                    }}
                                />
                                <Button
                                    name="spam"
                                    help={this.t("spam")}
                                    onClick={(event: any) => {
                                        event.preventDefault();
                                        this.props.reloadMail();
                                    }}
                                />
                                <Button
                                    name="trash"
                                    help={this.t("trash")}
                                    onClick={(event: any) => {
                                        event.preventDefault();
                                        this.props.reloadMail();
                                    }}
                                />
                            </div>
                            <div className="select-all__tools-right">
                                {hasUnreadSelected && mainPage && (
                                    <Button
                                        name="read-all-mail"
                                        help={this.t("mark_as_read")}
                                        onClick={(event: any) => {
                                            event.preventDefault();
                                            this.props.onMarkAsRead();
                                        }}
                                    />
                                )}
                                {mainPage && (
                                    <div className="move-to-folder-container">
                                        <Button name="move-to-folder" help={this.t("move-to-folder")} onClick={this.handleMoveToFolder} />
                                        {showFolderList && (
                                            <div className="folder-dropdown">
                                                {folders.length > 0 ? (
                                                    folders.map((folder: any) => (
                                                        <div
                                                            key={folder.id}
                                                            className="folder-dropdown__item"
                                                            onClick={(e: any) => this.handleFolderSelect(folder.id, e)}>
                                                            {folder.name}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="folder-dropdown__item folder-dropdown__item--empty">
                                                        Нет доступных папок
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <div className="mail-header__right-container">
                    <div className="count-email">
                        {startItem} - {endItem} {this.t("of")} {total}
                    </div>
                    <Button name="left" help="Пред." block={offset === 0} onClick={this.handlePrevPage} />
                    <Button name="right" help="След." block={offset + 50 >= total} onClick={this.handleNextPage} />
                </div>
            </div>
        );
    }
}

export default MailHeader;
