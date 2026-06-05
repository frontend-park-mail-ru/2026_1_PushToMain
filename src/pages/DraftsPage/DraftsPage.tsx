import BaseEmailPage from "../../widgets/BaseEmailPage/BaseEmailPage";
import { getDrafts, getDraftByID, deleteDraft } from "../../api/ApiDraft";
import { AppStorage } from "../../App";

class DraftsPage extends BaseEmailPage {
    constructor() {
        super({
            currentView: "drafts",
            fetchEmails: getDrafts,
            deleteEmails: deleteDraft,
            emptyMessage: "Нет черновиков",
            showUnreadToggle: false,
            showMarkAsRead: false,
            showMoveToFolder: false,
        });
    }

    handleReadMail = async (email: any) => {
        try {
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
        } catch (error) {
            console.error("Failed to load draft:", error);
        }
    };
}

export default DraftsPage;