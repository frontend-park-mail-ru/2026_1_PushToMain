import Death13 from "@react/stands";
import "./FolderChange.scss";
import Button from "../../components/Button/Button";
import { AppStorage } from "../../App";
import { getProfile } from "../../api/ApiAuth";
import {
  createNewFolder,
  changeFolderName,
  deleteFolder,
} from "../../api/ApiFolder";
import ConfirmationDialog from "../../widgets/ConfirmationDialog/ConfirmationDialog";

class FolderChange extends Death13.Component {
  lastClickTime: number = 0;

  constructor(props: any) {
    super(props);
    AppStorage.folderChangeInstance = this;
    this.loadFolders();
  }

  state: any = {
    folders: Array.isArray(AppStorage.folders) ? AppStorage.folders : [],
    newFolderName: "Новая папка",
    editingFolderId: null,
    editingFolderName: "",
    showDeleteConfirm: false,
    folderToDeleteId: null,
    folderToDeleteName: "",
  };

  loadFolders = async () => {
    const data = await getProfile();
    if (data && data.folder && Array.isArray(data.folder)) {
      const folders = data.folder.map((folder: any) => ({
        id: folder.folder_id,
        name: folder.folder_name,
      }));
      this.setState({ folders });
      AppStorage.setFolders(folders);
    }
  };

  startEditing = (folderId: number, currentName: string) => {
    if (this.state.editingFolderId !== null) {
      this.commitFolderEdit(this.state.editingFolderId);
    }
    this.setState({
      editingFolderId: folderId,
      editingFolderName: currentName,
    });
  };

  cancelEditing = () => {
    this.setState({
      editingFolderId: null,
      editingFolderName: "",
    });
  };

  commitFolderEdit = async (folderId: number) => {
    const { editingFolderName, folders } = this.state;
    const trimmed = editingFolderName.trim();
    const original = folders.find((f: any) => f.id === folderId)?.name || "";

    if (!trimmed || trimmed === original) {
      this.cancelEditing();
      return;
    }

    if (folders.some((f: any) => f.id !== folderId && f.name === trimmed)) {
      this.setState({ error: "Папка с таким именем уже существует" });
      return;
    }

    try {
      await changeFolderName(folderId, trimmed);
      const updatedFolders = folders.map((folder: any) =>
        folder.id === folderId ? { ...folder, name: trimmed } : folder,
      );
      this.setState({
        folders: updatedFolders,
        editingFolderId: null,
        editingFolderName: "",
      });
      AppStorage.setFolders(updatedFolders);
    } catch (error) {
      console.error("Error saving folder name:", error);
      this.cancelEditing();
    }
  };

  handleFolderKeyDown = (e: any, folderId: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.commitFolderEdit(folderId);
    } else if (e.key === "Escape") {
      this.cancelEditing();
    }
  };

  handleNameClick = (e: any, folderId: number, name: string) => {
    const now = Date.now();
    if (now - this.lastClickTime < 300) {
      this.startEditing(folderId, name);
    }
    this.lastClickTime = now;
  };

  handleAddFolder = async () => {
    const { folders } = this.state;
    if (folders.length >= 6) {
      this.props.showConfirmationModal?.(false, "too_many_folders");
      return;
    }

    let newFolderName = this.t("new_folder");
    if (folders.some((f: any) => f.name === newFolderName)) {
      let i = 2;
      while (folders.some((f: any) => f.name === `${newFolderName} ${i}`)) {
        i++;
      }
      newFolderName = `${newFolderName} ${i}`;
    }

    const response = await createNewFolder(newFolderName);
    if (response?.folder_id) {
      const updatedFolders = [
        ...folders,
        { id: response.folder_id, name: newFolderName },
      ];
      this.setState({ folders: updatedFolders });
      AppStorage.setFolders(updatedFolders);
    } else {
      await this.loadFolders();
    }
  };

  handleDeleteFolder = (folderId: number, folderName: string, event: any) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      showDeleteConfirm: true,
      folderToDeleteId: folderId,
      folderToDeleteName: folderName,
    });
  };

  confirmDelete = async () => {
    const { folderToDeleteId, folders } = this.state;
    if (!folderToDeleteId) return;

    const updatedFolders = folders.filter(
      (f: any) => f.id !== folderToDeleteId,
    );
    await deleteFolder(folderToDeleteId);
    this.setState({
      folders: updatedFolders,
      editingFolderId: null,
      editingFolderName: "",
      showDeleteConfirm: false,
      folderToDeleteId: null,
    });
    AppStorage.setFolders(updatedFolders);
  };

  cancelDelete = () => {
    this.setState({
      showDeleteConfirm: false,
      folderToDeleteId: null,
    });
  };

  t(key: string): string {
    return AppStorage.t(key);
  }

  render() {
    const { folders, editingFolderId, editingFolderName } = this.state;
    const isEditMode = this.props.isEditMode || false;

    return (
      <div className="folder-container">
        <div className="folder-list">
          {folders.map((folder: any) => (
            <div key={folder.id} className="folder-item">
              <button
                className="folder-delete-btn"
                onClick={(e: any) =>
                  this.handleDeleteFolder(folder.id, folder.name, e)
                }
              >
                ✕
              </button>

              {editingFolderId === folder.id ? (
                <div className="folder-edit">
                  <input
                    className="folder-edit__input"
                    value={editingFolderName}
                    onInput={(e: any) =>
                      this.setState({ editingFolderName: e.target.value })
                    }
                    onBlur={() => this.commitFolderEdit(folder.id)}
                    onKeyDown={(e: any) =>
                      this.handleFolderKeyDown(e, folder.id)
                    }
                    autoFocus
                  />
                </div>
              ) : (
                <span
                  className="folder-name"
                  onClick={(e: any) =>
                    this.handleNameClick(e, folder.id, folder.name)
                  }
                >
                  {folder.name}
                </span>
              )}

              {isEditMode && editingFolderId !== folder.id && (
                <button
                  className="folder-drag-btn"
                  onClick={(e: any) => e.preventDefault()}
                />
              )}
            </div>
          ))}
        </div>
        <div className="folder-actions">
          <Button
            title={this.t("add_a_folder")}
            name="add_a_folder"
            onClick={(e: any) => {
              e.preventDefault();
              this.handleAddFolder();
            }}
          />
        </div>
        {this.state.showDeleteConfirm && (
          <ConfirmationDialog
            text={`${this.t("confirm_delete_folder")} "${this.state.folderToDeleteName}"?`}
            callbackConfirm={this.confirmDelete}
            callbackCancel={this.cancelDelete}
          />
        )}
      </div>
    );
  }
}

export default FolderChange;
