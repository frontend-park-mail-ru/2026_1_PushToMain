import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import "./MailHeader.scss";
import { AppStorage } from "../../App";
import { getEmailsSpam, sendSpam, unSpam } from "../../api/ApiSpam";
import { sendFavorite, unFavorite } from "../../api/ApiFavorite";
import { getEmailsTrash, untrash } from "../../api/ApiTrash";
import { readEmail, unReadEmail } from "../../api/ApiEmail";

class MailHeader extends Death13.Component {
  state: any = {
    showFolderList: false,
  };

  handleSelectAll = (e: any) => {
    const isChecked = e && e.target ? e.target.checked : false;
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
      await sendSpam(this.props.selectedEmails);
      this.props.reloadMail?.();
    }
  };

  handleMarkAsFavorite = async (event: any) => {
    event.preventDefault();
    if (this.props.selectedEmails && this.props.selectedEmails.length > 0) {
      await sendFavorite(this.props.selectedEmails);
      this.props.reloadMail?.();
    }
  };

  handleUnMarkAsFavorite = async (event: any) => {
    event.preventDefault();
    if (this.props.selectedEmails && this.props.selectedEmails.length > 0) {
      await unFavorite(this.props.selectedEmails);
      this.props.reloadMail?.();
    }
  };

  handleMarkAsRead = async (event: any) => {
    event.preventDefault();
    if (this.props.selectedEmails && this.props.selectedEmails.length > 0) {
      await readEmail(this.props.selectedEmails);
      this.props.onMarkAsRead?.();
      this.props.reloadMail?.();
    }
  };

  handleMarkAsUnread = async (event: any) => {
    event.preventDefault();
    if (this.props.selectedEmails && this.props.selectedEmails.length > 0) {
      await unReadEmail(this.props.selectedEmails);
      this.props.reloadMail?.();
    }
  };

  handleMoveToInbox = async (event: any) => {
    event.preventDefault();
    if (this.props.selectedEmails && this.props.selectedEmails.length > 0) {
      const { currentView } = this.props;

      if (currentView === "trash") {
        await untrash(this.props.selectedEmails);
        await getEmailsTrash(0);
      } else if (currentView === "spam") {
        await unSpam(this.props.selectedEmails);
        await getEmailsSpam(0);
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

  hasReadSelected = () => {
    const { selectedEmails } = this.props;
    if (!selectedEmails) return false;
    const { emails } = this.props;
    if (!emails) return false;
    return selectedEmails.some((selectedId: number) => {
      const email = emails.find((e: any) => e.id === selectedId);
      return email && email.is_read;
    });
  };

  hasFavoriteSelected = () => {
    const { selectedEmails } = this.props;
    if (!selectedEmails) return false;
    const { emails } = this.props;
    if (!emails) return false;
    return selectedEmails.some((selectedId: number) => {
      const email = emails.find((e: any) => e.id === selectedId);
      return email && email.is_favorite;
    });
  };

  render() {
    const {
      isSelectAll,
      offset = 0,
      total = 0,
      mainPage = false,
      currentView = "",
      isLoading,
    } = this.props;
    const startItem = total > 0 ? offset + 1 : 0;
    const endItem = Math.min(offset + 50, total);
    const hasSelected = this.props.selectedCount > 0;
    const { showFolderList } = this.state;
    const isSpamOrTrash = currentView === "spam" || currentView === "trash";
    const isDrafts = currentView === "drafts";
    const isMobile = window.innerWidth < 769;
    const isSent = currentView === "sent";
    const hasReadSelected = this.hasReadSelected();
    const hasFavoriteSelected = this.hasFavoriteSelected();
    const hasOnlyUnread = hasSelected && !hasReadSelected;

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
              className={isLoading ? "refreshing" : ""}
              block={isLoading}
              help={this.t("refresh")}
              onClick={(event: any) => {
                event.preventDefault();
                this.props.reloadMail();
              }}
            />
          )}

          {hasSelected && (
            <div className="select-all-container">
              <div
                className={`select-all__tools-left${isDrafts || isSent || isSpamOrTrash ? " hide-separator" : ""}`}
              >
                {isSpamOrTrash && (
                  <Button
                    name="move-to-inbox"
                    help={this.t("move_to_inbox")}
                    onClick={this.handleMoveToInbox}
                  />
                )}

                {!isSpamOrTrash && !isDrafts && (
                  <div className="select-all-container">
                    {hasFavoriteSelected ? (
                      <Button
                        name="unfavorite"
                        help={this.t("unstarred")}
                        onClick={this.handleUnMarkAsFavorite}
                      />
                    ) : (
                      <Button
                        name="favorites"
                        help={this.t("starred")}
                        onClick={this.handleMarkAsFavorite}
                      />
                    )}
                    {!isSent && (
                      <Button
                        name="spam"
                        help={this.t("spam")}
                        onClick={this.handleMarkAsSpam}
                      />
                    )}
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
                {mainPage && !isSpamOrTrash && !isDrafts && (
                  <>
                    {hasOnlyUnread ? (
                      <Button
                        name="read-all-mail"
                        help={this.t("mark_as_read")}
                        onClick={this.handleMarkAsRead}
                      />
                    ) : hasReadSelected ? (
                      <Button
                        name="unread-all-mail"
                        help={this.t("mark_as_unread")}
                        onClick={this.handleMarkAsUnread}
                      />
                    ) : null}
                  </>
                )}
                {mainPage && !isSpamOrTrash && !isDrafts && (
                  <div className="move-to-folder-container">
                    <Button
                      name="move-to-folder"
                      help={this.t("move_to_folder")}
                      onClick={this.handleMoveToFolder}
                    />
                    {showFolderList && (
                      <div className="folder-dropdown">
                        {folders.length > 0 ? (
                          folders.map((folder: any) => (
                            <div
                              key={folder.id}
                              className="folder-dropdown__item"
                              onClick={(e: any) =>
                                this.handleFolderSelect(folder.id, e)
                              }
                            >
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
        {!isMobile || !hasSelected ? (
          <div className="mail-header__right-container">
            <div className="count-email">
              {startItem} - {endItem} {this.t("of")} {total}
            </div>
            <Button
              name="left"
              help="Пред."
              block={offset === 0}
              onClick={this.handlePrevPage}
            />
            <Button
              name="right"
              help="След."
              block={offset + 50 >= total}
              onClick={this.handleNextPage}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

export default MailHeader;
