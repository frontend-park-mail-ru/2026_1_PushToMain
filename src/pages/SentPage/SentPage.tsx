import BaseEmailPage from "../../widgets/BaseEmailPage/BaseEmailPage";
import { getEmailSend, getEmailByID } from "../../api/ApiEmail";
import { trash } from "../../api/ApiTrash";

class SentPage extends BaseEmailPage {
    constructor(props: any) {
        super({
            currentView: "sent",
            fetchEmails: getEmailSend,
            deleteEmails: trash,
            emptyMessage: "Нет отправленных писем",
            emptySubMessage: "Напишите ваше первое письмо, нажав на кнопку слева",
            onReadMail: async (email: any) => {
                const fullEmail = await getEmailByID(email.id);
                window.app.handleRoute(`/read/${fullEmail.id}`);
            },
            ...props,
        });
    }
}

export default SentPage;