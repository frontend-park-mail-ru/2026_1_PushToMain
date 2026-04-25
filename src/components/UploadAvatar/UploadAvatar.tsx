import Death13 from "@react/stands";
import "./UploadAvatar.scss";
import { AppStorage } from "../../App";
import { uploadAvatar } from "../../api/ApiAuth";

class UploadAvatar extends Death13.Component {
    constructor(props: any) {
        super(props);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.state = {
            localPreview: null,
        };
    }

    handleImageChange = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event: any) => {
            this.setState({ localPreview: event.target.result });
        };
        reader.readAsDataURL(file);

        const imagePath = await uploadAvatar(file);
        if (imagePath) {
            AppStorage.setImagePath(imagePath);
            this.setState({ localPreview: null });

            if (this.props.onAvatarUpdate) {
                this.props.onAvatarUpdate();
            }
        }
    };

    t(key: string): string {
        return AppStorage.t(key);
    }

    render() {
        const src = this.state.localPreview || this.props.image || AppStorage.getAvatarUrl() || "../../assets/svg/Avatar.svg";

        return (
            <div className="upload">
                <div className="upload__preview">
                    <img id="upload-image" src={src} alt="avatar" />
                </div>
                <input id="file-input" type="file" name="file" accept="image/*" hidden onChange={this.handleImageChange} />
                <label for="file-input">{this.t("change_avatar")}</label>
            </div>
        );
    }
}

export default UploadAvatar;
