import BaseEmailPage from "../../widgets/BaseEmailPage/BaseEmailPage";
import { getEmailsSpam } from "../../api/ApiSpam";
import { trash } from "../../api/ApiTrash";
import Death13 from "@react/stands";

class SpamPage extends Death13.Component {
    render() {
        return Death13.createElement(BaseEmailPage, {
            currentView: "spam",
            fetchEmails: getEmailsSpam,
            deleteEmails: trash,
            emptyMessage: "Спам пуст",
        });
    }
}

export default SpamPage;