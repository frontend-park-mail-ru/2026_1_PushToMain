import Death13 from "@react/stands";
import "./UploadAvatar.scss";

class UploadAvatar extends Death13.Component {
    constructor(props: any) {
        super(props);
        this.handleImageChange = this.handleImageChange.bind(this);
    }

    state: any = {
        avatarSrc: "../../assets/svg/Avatar.svg",
    };

    handleImageChange(e: any) {
        const file = e.target.files?.[0];

        if (file) {
            const reader = new FileReader();

            console.log(reader);
            reader.onload = (event: any) => {
                this.setState({ avatarSrc: event.target.result });
            };

            reader.readAsDataURL(file);
        }
    }

    render() {
        const { avatarSrc } = this.state;
        return (
            <div className="upload">
                <div className="upload__preview">
                    <img id="upload-image" src={avatarSrc} alt="avatar" />
                </div>
                <input id="file-input" type="file" name="file" accept="image/*" hidden onChange={this.handleImageChange} />
                <label for="file-input">Изменить фото</label>
            </div>
        );
    }
}

export default UploadAvatar;
