import BaseEmailPage from "../../widgets/BaseEmailPage/BaseEmailPage";
import { getEmailsTrash, deleteEmailByID } from "../../api/ApiEmail";

class TrashPage extends BaseEmailPage {
    constructor(props: any) {
        super({
            currentView: "trash",
            fetchEmails: getEmailsTrash,
            deleteEmails: deleteEmailByID,
            emptyMessage: "Корзина пуста",
            ...props,
        });
    }
}

export default TrashPage;