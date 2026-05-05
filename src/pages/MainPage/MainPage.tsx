import BaseEmailPage from "../../widgets/BaseEmailPage/BaseEmailPage";
import { getEmailAll } from "../../api/ApiEmail";

class MainPage extends BaseEmailPage {
    constructor() {
        const mainProps = {
            currentView: "inbox",
            fetchEmails: getEmailAll,
            emptyMessage: "Ваш почтовый ящик пуст :(",
            emptySubMessage: "Напишите ваше первое письмо, нажав на кнопку слева",
            showUnreadToggle: true,
            showMarkAsRead: true,
            showMoveToFolder: true,
            currentFolderId: null,
        };
        
        super(mainProps);
    }
}

export default MainPage;