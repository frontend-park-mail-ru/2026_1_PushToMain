import BaseEmailPage from "../../widgets/BaseEmailPage/BaseEmailPage";
import { getEmailsSpam } from "../../api/ApiSpam";
import { deleteEmailByID } from "../../api/ApiEmail";

class SpamPage extends BaseEmailPage {
    constructor(props: any) {
        super({
            currentView: "spam",
            fetchEmails: getEmailsSpam,
            deleteEmails: deleteEmailByID,
            emptyMessage: "Спам пуст",
            ...props,
        });
    }
}

export default SpamPage;