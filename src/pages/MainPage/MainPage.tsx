import BaseEmailPage from "../../widgets/BaseEmailPage/BaseEmailPage";
import { getInbox } from "../../api/ApiEmail";
import Death13 from "@react/stands";

class MainPage extends Death13.Component {
    render() {
        return Death13.createElement(BaseEmailPage, {
            currentView: "inbox",
            fetchEmails: getInbox,
            emptyMessage: "Ваш почтовый ящик пуст :(",
            emptySubMessage: "Напишите ваше первое письмо, нажав на кнопку слева",
            showUnreadToggle: true,
            showMarkAsRead: true,
            showMoveToFolder: true,
            currentFolderId: null,
        });
    }
}

export default MainPage;