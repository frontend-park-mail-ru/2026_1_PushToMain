import Death13 from "@react/stands";
import "./FolderChange.scss";
import Button from "../../components/Button/Button";
import { AppStorage } from "../../App";

class FolderChange extends Death13.Component {
    t(key: string): string {
        return AppStorage.t(key);
    }

    render() {
        return (
            <div className="folder-container">
                <div className="folder-list">
                    <div className="folder"></div>
                </div>
                <div className="folder-actions">
                    <Button
                        title={this.t("add_a_folder")}
                        name="add_a_folder"
                        onClick={(event: any) => {
                            event.preventDefault();
                        }}
                    />
                </div>
            </div>
        );
    }
}

export default FolderChange;
