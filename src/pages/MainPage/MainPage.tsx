import BaseEmailPage from "../../widgets/BaseEmailPage/BaseEmailPage";
import { getEmailAll } from "../../api/ApiEmail";

class MainPage extends BaseEmailPage {
    constructor(props: any) {
        super({
            currentView: "inbox",
            fetchEmails: getEmailAll,
            emptyMessage: "Ваш почтовый ящик пуст :(",
            ...props,
        });
    }
}

export default MainPage;