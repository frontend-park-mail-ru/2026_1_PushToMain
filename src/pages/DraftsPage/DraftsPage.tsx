import BaseEmailPage from "../../widgets/BaseEmailPage/BaseEmailPage";
import { getDrafts, getDraftByID, deleteDraft } from "../../api/ApiDraft";
import { AppStorage } from "../../App";

class DraftsPage extends BaseEmailPage {
    constructor(props: any) {
        super({
            currentView: "drafts",
            fetchEmails: getDrafts,
            deleteEmails: deleteDraft,
            emptyMessage: "Нет черновиков",
            onReadMail: async (email: any) => {
                const response = await getDraftByID(email.id);
                if (response) {
                    const draft = await response.json();
                    AppStorage.setDraftData({
                        id: draft.id,
                        header: draft.header,
                        body: draft.body,
                        receivers: draft.receivers || [],
                    });
                    window.app.handleRoute("/send");
                }
            },
            ...props,
        });
    }
}

export default DraftsPage;