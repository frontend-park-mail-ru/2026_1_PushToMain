import BaseEmailPage from "../../widgets/BaseEmailPage/BaseEmailPage";
import { getEmailsFromFolder, deleteEmailsFromFolder } from "../../api/ApiFolder";
import { AppStorage } from "../../App";
import Death13 from "@react/stands";

class FolderPage extends Death13.Component {
    render() {
        const folderId =
            parseInt(this.props.folderId) ||
            AppStorage.getCurrentFolderId?.() ||
            0;

        const folderName =
            AppStorage.folders?.find((f: any) => f.id === folderId)?.name ||
            "Папка";

        AppStorage.setCurrentFolderId(folderId);

        return Death13.createElement(BaseEmailPage, {
            currentView: "folder",
            fetchEmails: (offset: number) =>
                getEmailsFromFolder(offset, folderId),
            deleteEmails: (ids: number[]) =>
                deleteEmailsFromFolder(folderId, ids),
            emptyMessage: `Папка "${folderName}" пуста`,
            emptySubMessage: "Переместите письма в эту папку",
            showUnreadToggle: false,
            showMarkAsRead: false,
            showMoveToFolder: false,
            currentFolderId: folderId,
            currentFolderName: folderName,
        });
    }
}

export default FolderPage