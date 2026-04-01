import Death13 from "@react/stands";
import "./Profile.scss";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import SelectDate from "../../components/SelectDate/SelectDate";

class Profile extends Death13.Component {
    state: any = {
        errors: {},
        name: "",
        surname: "",
        oldPassword: "",
        newPassword: "",
    };
    render() {
        const { profileState } = this.props;
        return (
            <div className="profile">
                {profileState === 0 && (
                    <div className="profile-container">
                        <h1>Личные данные</h1>
                        <div className="profile-content">
                            <div className="profile-avatar">
                                <img src="../../assets/svg/Avatar.svg" alt="avatar" />
                                <Button
                                    title="Изменить фото"
                                    name="change-avatar"
                                    onClick={(event: any) => {
                                        event.preventDefault();
                                    }}
                                />
                            </div>
                            <form action="" className="profile-form">
                                <Input type="text" placeholder="Введите имя" input_title="Имя" name="name" onInput={() => {}} />
                                <Input
                                    type="text"
                                    placeholder="Введите фамилию"
                                    input_title="Фамилия"
                                    name="surname"
                                    onInput={() => {}}
                                />
                                <SelectDate />
                                <div className="profile-actions">
                                    {" "}
                                    <Button
                                        title="Сохранить"
                                        name="change-profile"
                                        onClick={(event: any) => {
                                            event.preventDefault();
                                        }}
                                    />{" "}
                                    <Button
                                        title="Отменить"
                                        name="back-to-mail"
                                        onClick={(event: any) => {
                                            event.preventDefault();
                                        }}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {profileState === 1 && (
                    <div className="profile-form">
                        <h1>Безопасность</h1>
                        <div className="profile-content">
                            <form action="" className="profile-form">
                                <Input
                                    type="password"
                                    placeholder="Введите пароль"
                                    input_title="Старый пароль"
                                    name="password"
                                    onInput={() => {}}
                                />{" "}
                                <Input
                                    type="password"
                                    placeholder="Введите пароль"
                                    input_title="Новый пароль"
                                    name="password"
                                    onInput={() => {}}
                                />
                                <div className="profile-actions">
                                    {" "}
                                    <Button
                                        title="Сохранить"
                                        name="change-password"
                                        onClick={(event: any) => {
                                            event.preventDefault();
                                        }}
                                    />{" "}
                                    <Button
                                        title="Отменить"
                                        name="back-to-mail"
                                        onClick={(event: any) => {
                                            event.preventDefault();
                                        }}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default Profile;
