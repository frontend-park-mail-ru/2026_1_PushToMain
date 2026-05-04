import BaseEmailPage from "../../widgets/BaseEmailPage/BaseEmailPage";
import { getEmailsFavorite } from "../../api/ApiFavorite";

class FavoritePage extends BaseEmailPage {
    constructor(props: any) {
        super({
            currentView: "favorite",
            fetchEmails: getEmailsFavorite,
            emptyMessage: "Нет избранных писем",
            ...props,
        });
    }
}

export default FavoritePage;