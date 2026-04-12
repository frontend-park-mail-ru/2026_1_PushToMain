import Death13 from "@react/stands";
import "./UploadAvatar.scss";
import { AppStorage } from "../../App";
import { uploadAvatar } from "../../api/ApiAuth";

class UploadAvatar extends Death13.Component {
    constructor(props: any) {
        super(props);
        this.handleImageChange = this.handleImageChange.bind(this);
    }

    state: any = {
        avatarSrc: AppStorage.image_path || this.props.image || `../../assets/svg/Avatar.svg`,
    };

    handleImageChange = async (e: any) => {
        const file = e.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = (event: any) => {
            this.setState({ avatarSrc: event.target.result });
        };

        reader.readAsDataURL(file);

        const imagePath = await uploadAvatar(file);
        console.log(imagePath);
        if (imagePath) {
            AppStorage.image_path = imagePath;
        }
    };

    render() {
        const { avatarSrc } = this.state;
        return (
            <div className="upload">
                <div className="upload__preview">
                    <img id="upload-image" src={this.props.image || avatarSrc} alt="avatar" />
                </div>
                <input id="file-input" type="file" name="file" accept="image/*" hidden onChange={this.handleImageChange} />
                <label for="file-input">Изменить фото</label>
            </div>
        );
    }
}

export default UploadAvatar;
