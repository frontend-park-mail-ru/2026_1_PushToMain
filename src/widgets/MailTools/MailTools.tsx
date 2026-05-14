import Death13 from "@react/stands";
import Button from "../../components/Button/Button";
import "./MailTools.scss";
import { AppStorage } from "../../App";
import { sendSpam, unSpam } from "../../api/ApiSpam";
import { sendFavorite, unFavorite } from "../../api/ApiFavorite";

class MailTools extends Death13.Component {
  handleDeleteClick = async (event: any) => {
    event.preventDefault();
    const { deleteEmail } = this.props;
    await deleteEmail();
  };

  handleReplyClick = (event: any) => {
    event.preventDefault();
    const { onReply } = this.props;
    if (onReply) {
      onReply();
    }
  };

  handleForwardClick = (event: any) => {
    event.preventDefault();
    const { onForward } = this.props;
    if (onForward) {
      onForward();
    }
  };

  handleSpamClick = async (event: any) => {
    event.preventDefault();
    const { email } = this.props;
    if (email) {
      await sendSpam([email.id]);
      this.props.backToMail?.();
    }
  };

  handleUnSpamClick = async (event: any) => {
    event.preventDefault();
    const { email } = this.props;
    if (email) {
      await unSpam([email.id]);
      this.props.reloadMail?.();
    }
  };

  handleFavoriteClick = async (event: any) => {
    event.preventDefault();
    const { email } = this.props;
    if (email) {
      await sendFavorite([email.id]);
      this.props.reloadMail?.();
    }
  };

  handleUnFavoriteClick = async (event: any) => {
    event.preventDefault();
    const { email } = this.props;
    if (email) {
      await unFavorite([email.id]);
      this.props.reloadMail?.();
    }
  };

  t(key: string): string {
    return AppStorage.t(key);
  }

  render() {
    const { email } = this.props;
    const isFavorite = email?.is_favorite;
    const isSpam = email?.is_spam;

    return (
      <div className="tools-container">
        <div className="tools-left">
          {isFavorite ? (
            <Button
              name="unfavorite"
              help={this.t("unstarred")}
              onClick={this.handleUnFavoriteClick}
            />
          ) : (
            <Button
              name="favorites"
              help={this.t("starred")}
              onClick={this.handleFavoriteClick}
            />
          )}
          {isSpam ? (
            <Button
              name="unspam"
              help={this.t("unspam")}
              onClick={this.handleUnSpamClick}
            />
          ) : (
            <Button
              name="spam"
              help={this.t("spam")}
              onClick={this.handleSpamClick}
            />
          )}
          <Button
            name="trash"
            help={this.t("trash")}
            onClick={this.handleDeleteClick}
          />
        </div>
        <div className="tools-right">
          <Button
            name="answer"
            help={this.t("answer")}
            title={this.t("answer")}
            onClick={this.handleForwardClick}
          />
          <Button
            name="reply"
            title={this.t("reply")}
            help={this.t("reply")}
            onClick={this.handleReplyClick}
          />
        </div>
      </div>
    );
  }
}

export default MailTools;
