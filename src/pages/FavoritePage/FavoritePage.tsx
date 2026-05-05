import BaseEmailPage from "../../widgets/BaseEmailPage/BaseEmailPage";
import { getEmailsFavorite } from "../../api/ApiFavorite";
import Death13 from "@react/stands";

class FavoritePage extends Death13.Component {
    render() {
        return Death13.createElement(BaseEmailPage, {
            currentView: "favorite",
            fetchEmails: getEmailsFavorite,
            emptyMessage: "Нет избранных писем",
        });
    }
}

export default FavoritePage;