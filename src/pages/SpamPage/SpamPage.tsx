import BaseEmailPage from "../../widgets/BaseEmailPage/BaseEmailPage";
import { getEmailsSpam } from "../../api/ApiSpam";
import { trash } from "../../api/ApiTrash";

class SpamPage extends BaseEmailPage {
    constructor(props: any) {
        super({
            currentView: "spam",
            fetchEmails: getEmailsSpam,
            deleteEmails: trash,
            emptyMessage: "Спам пуст",
            ...props,
        });
    }
}

export default SpamPage;