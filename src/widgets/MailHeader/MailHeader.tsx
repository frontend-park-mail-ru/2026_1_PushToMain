import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import "./MailHeader.scss";
import { AppStorage } from "../../App";
import { changeFolderV2, restoreFromTrash } from "../../api/ApiEmail";

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

    handleMarkAsSpam = async (event: any) => {
        event.preventDefault();
        if (this.props.selectedEmails && this.props.selectedEmails.length > 0) {
            await changeFolderV2(this.props.selectedEmails, "spam");
            this.props.reloadMail?.();
        }
    };

    handleMarkAsFavorite = async (event: any) => {
        event.preventDefault();
        if (this.props.selectedEmails && this.props.selectedEmails.length > 0) {
            await changeFolderV2(this.props.selectedEmails, "favorite");
        }
    };

    handleMoveToInbox = async (event: any) => {
        event.preventDefault();
        if (this.props.selectedEmails && this.props.selectedEmails.length > 0) {
            const { currentView } = this.props;

            if (currentView === "trash") {
                await restoreFromTrash(this.props.selectedEmails);
            } else if (currentView === "spam") {
                await changeFolderV2(this.props.selectedEmails, "inbox");
            }

            this.props.reloadMail?.();
        }
    };

    handleClickOutside = () => {
        this.setState({ showFolderList: false });
    };

    t(key: string): string {
        return AppStorage.t(key);
    }

    render() {
        const { isSelectAll, offset = 0, total = 0, hasUnreadSelected = false, mainPage = false, currentView = "" } = this.props;
        const startItem = total > 0 ? offset + 1 : 0;
        const endItem = Math.min(offset + 50, total);
        const hasSelected = this.props.selectedCount > 0;
        const { showFolderList } = this.state;
        const isSpamOrTrash = currentView === "spam" || currentView === "trash";
        const isDrafts = currentView === "drafts";

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
                                {isSpamOrTrash && (
                                    <Button name="move-to-inbox" help={this.t("move_to_inbox")} onClick={this.handleMoveToInbox} />
                                )}

                                {!isSpamOrTrash && !isDrafts && (
                                    <div className="select-all-container">
                                        <Button name="favorites" help={this.t("starred")} onClick={this.handleMarkAsFavorite} />
                                        <Button name="spam" help={this.t("spam")} onClick={this.handleMarkAsSpam} />
                                    </div>
                                )}

                                <Button
                                    name="trash"
                                    help={this.t("trash")}
                                    onClick={(event: any) => {
                                        event.preventDefault();
                                        if (this.props.onDelete) {
                                            this.props.onDelete();
                                        }
                                    }}
                                />
                            </div>
                            <div className="select-all__tools-right">
                                {hasUnreadSelected && mainPage && !isSpamOrTrash && !isDrafts && (
                                    <Button
                                        name="read-all-mail"
                                        help={this.t("mark_as_read")}
                                        onClick={(event: any) => {
                                            event.preventDefault();
                                            this.props.onMarkAsRead();
                                        }}
                                    />
                                )}
                                {mainPage && !isSpamOrTrash && !isDrafts && (
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
