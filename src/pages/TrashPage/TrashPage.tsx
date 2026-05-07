import BaseEmailPage from "../../widgets/BaseEmailPage/BaseEmailPage";
import { getEmailsTrash, trash } from "../../api/ApiTrash";
import Death13 from "@react/stands";

class TrashPage extends Death13.Component {
    render() {
        return Death13.createElement(BaseEmailPage, {
            currentView: "trash",
            fetchEmails: getEmailsTrash,
            deleteEmails: trash,
            emptyMessage: "Корзина пуста",
        });
    }
}

export default TrashPage;