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

class FolderChange extends Death13.Component {
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
    pendingChanges: {},
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

  saveFolderName = async (folderId: number) => {
    const { pendingChanges, folders } = this.state;
    const newName = pendingChanges[folderId];

    if (!newName || !newName.trim()) {
      return;
    }

    try {
      await changeFolderName(folderId, newName.trim());

      const updatedFolders = folders.map((folder: any) =>
        folder.id === folderId ? { ...folder, name: newName.trim() } : folder,
      );

      const newPendingChanges = { ...pendingChanges };
      delete newPendingChanges[folderId];

      this.setState({
        folders: updatedFolders,
        pendingChanges: newPendingChanges,
      });

      AppStorage.setFolders(updatedFolders);
    } catch (error) {
      console.error("Error saving folder name:", error);
    }
  };

  saveAllPendingChanges = async () => {
    const { pendingChanges, folders } = this.state;

    const folderIds = Object.keys(pendingChanges);

    for (let i = 0; i < folderIds.length; i++) {
      const folderId = folderIds[i];
      const newName = (pendingChanges as any)[folderId];

      if (newName && newName.trim()) {
        await changeFolderName(Number(folderId), newName.trim());

        folders.forEach((folder: any) => {
          if (folder.id === Number(folderId)) {
            folder.name = newName.trim();
          }
        });
      }
    }

    this.setState({
      folders: [...folders],
      pendingChanges: {},
      editingFolderId: null,
      editingFolderName: "",
    });

    AppStorage.setFolders(folders);
  };

  handleAddFolder = async () => {
    const { folders } = this.state;

    if (folders.length >= 6) {
      const showConfirmationModal = this.props.showConfirmationModal;
      if (showConfirmationModal) {
        showConfirmationModal(false, "Limit of 6 folders reached");
      }
      return;
    }

    const response = await createNewFolder();

    if (response && response.folder_id) {
      const newFolder = {
        id: response.folder_id,
        name: "Новая папка",
      };

      const updatedFolders = [...folders, newFolder];

      this.setState({ folders: updatedFolders });
      AppStorage.setFolders(updatedFolders);
    } else {
      await this.loadFolders();
    }
  };

  handleDeleteFolder = async (folderId: number, event: any) => {
    event.preventDefault();
    event.stopPropagation();

    const { folders } = this.state;
    const updatedFolders = folders.filter(
      (folder: any) => folder.id !== folderId,
    );

    await deleteFolder(folderId);

    this.setState({
      folders: updatedFolders,
      editingFolderId: null,
      editingFolderName: "",
    });
    AppStorage.setFolders(updatedFolders);
  };

  handleStartEdit = async (
    folderId: number,
    currentName: string,
    event: any,
  ) => {
    event.stopPropagation();

    const { editingFolderId, pendingChanges } = this.state;

    if (
      editingFolderId &&
      editingFolderId !== folderId &&
      pendingChanges[editingFolderId]
    ) {
      await this.saveFolderName(editingFolderId);
    }

    this.setState({
      editingFolderId: folderId,
      editingFolderName: currentName,
    });
  };

  handleBlur = async (folderId: number) => {
    const { pendingChanges } = this.state;

    if (pendingChanges[folderId] && pendingChanges[folderId].trim()) {
      await this.saveFolderName(folderId);
    }

    this.setState({
      editingFolderId: null,
      editingFolderName: "",
    });
  };

  handleInputChange = (value: string) => {
    const { editingFolderId } = this.state;

    this.setState({
      editingFolderName: value,
      pendingChanges: {
        ...this.state.pendingChanges,
        [editingFolderId]: value,
      },
    });
  };

  handleKeyDown = async (folderId: number, event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      await this.saveFolderName(folderId);
      this.setState({
        editingFolderId: null,
        editingFolderName: "",
      });
    } else if (event.key === "Escape") {
      this.setState({
        editingFolderId: null,
        editingFolderName: "",
      });
    }
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
          {folders &&
            folders.map((folder: any) => (
              <div key={folder.id} className="folder-item">
                {isEditMode && editingFolderId !== folder.id && (
                  <button
                    className="folder-delete-btn"
                    onClick={(e: any) => this.handleDeleteFolder(folder.id, e)}
                  >
                    ✕
                  </button>
                )}

                {isEditMode && editingFolderId === folder.id ? (
                  <div className="folder-edit">
                    <input
                      className="folder-edit__input"
                      value={editingFolderName}
                      onInput={(e: any) =>
                        this.handleInputChange(e.target.value)
                      }
                      onBlur={() => this.handleBlur(folder.id)}
                      onKeyDown={(e: any) => this.handleKeyDown(folder.id, e)}
                      autoFocus
                    />
                  </div>
                ) : (
                  <span
                    className="folder-name"
                    onClick={(e: any) => {
                      if (isEditMode) {
                        this.handleStartEdit(folder.id, folder.name, e);
                      }
                    }}
                  >
                    {folder.name}
                  </span>
                )}

                {isEditMode && editingFolderId !== folder.id && (
                  <button
                    className="folder-drag-btn"
                    onClick={(e: any) => e.preventDefault()}
                  ></button>
                )}
              </div>
            ))}
        </div>
        <div className="folder-actions">
          <Button
            title={this.t("add_a_folder")}
            name="add_a_folder"
            onClick={(event: any) => {
              event.preventDefault();
              this.handleAddFolder();
            }}
          />
        </div>
      </div>
    );
  }
}

export default FolderChange;
