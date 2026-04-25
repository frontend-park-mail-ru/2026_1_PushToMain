import Death13 from "@react/stands";
import "./FolderChange.scss";
import Button from "../../components/Button/Button";
import { AppStorage } from "../../App";

class FolderChange extends Death13.Component {
    state: any = {
        folders: Array.isArray(AppStorage.folders) ? AppStorage.folders : [],
        newFolderName: "Новая папка",
    };

    handleAddFolder = () => {
        const { newFolderName, folders } = this.state;

        const maxOrder = folders.length > 0 ? Math.max(...folders.map((f: any) => f.order || 0)) : 0;

        if (maxOrder === 6) {
            return;
        }

        const newFolder = {
            id: maxOrder + 1,
            name: newFolderName.trim(),
            emails: [],
            createdAt: new Date().toISOString(),
            order: maxOrder + 1,
        };

        const updatedFolders = [...folders, newFolder];

        this.setState({
            folders: updatedFolders,
        });

        AppStorage.setFolders(updatedFolders);
    };

    t(key: string): string {
        return AppStorage.t(key);
    }

    render() {
        const { folders } = this.state;
        return (
            <div className="folder-container">
                <div className="folder-list">
                    {folders &&
                        folders.map((folder: any) => (
                            <div key={folder.id} className="folder-item">
                                <span className="folder-name">{folder.name}</span>
                            </div>
                        ))}{" "}
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
