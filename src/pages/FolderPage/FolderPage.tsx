import BaseEmailPage from "../../widgets/BaseEmailPage/BaseEmailPage";
import { getEmailsFromFolder, deleteEmailsFromFolder } from "../../api/ApiFolder";
import { AppStorage } from "../../App";

class FolderPage extends BaseEmailPage {
    constructor(props: any) {
        const folderId = parseInt(props.folderId) || AppStorage.getCurrentFolderId?.() || 0;
        const folderName = AppStorage.folders?.find((f: any) => f.id === folderId)?.name || "Папка";
        AppStorage.setCurrentFolderId?.(folderId);

        const folderProps = {
            currentView: "folder" as const,
            fetchEmails: (offset: number) => getEmailsFromFolder(offset, folderId),
            deleteEmails: (ids: number[]) => deleteEmailsFromFolder(folderId, ids),
            emptyMessage: `Папка "${folderName}" пуста`,
            emptySubMessage: "Переместите письма в эту папку",
            showUnreadToggle: false,
            showMarkAsRead: false,
            showMoveToFolder: false,
            currentFolderId: folderId,
            currentFolderName: folderName,
        };

        super(folderProps);
    }
}

export default FolderPage;
