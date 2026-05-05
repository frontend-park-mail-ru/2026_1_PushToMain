import BaseEmailPage from "../../widgets/BaseEmailPage/BaseEmailPage";
import { getEmailsTrash, trash } from "../../api/ApiTrash";

class TrashPage extends BaseEmailPage {
    constructor(props: any) {
        super({
            currentView: "trash",
            fetchEmails: getEmailsTrash,
            deleteEmails: trash,
            emptyMessage: "Корзина пуста",
            ...props,
        });
    }
}

export default TrashPage;