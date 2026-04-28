import Death13 from "@react/stands";
import "./ProfilePage.scss";
import Sidebar from "../../widgets/Sidebar/Sidebar";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import UploadAvatar from "../../components/UploadAvatar/UploadAvatar";
import { validation } from "../../utils/validation";
import { changePassword, getProfile, changeProfile } from "../../api/ApiAuth";
import { AppStorage } from "../../App";
import ProfileModal from "../../widgets/ProfileModal/ProfileModal";
import ConfirmationModal from "../../widgets/ConfirmationModal/ConfirmationModal";
import SupportModal from "../../widgets/SupportModal/SupportModal";
import SelectDate from "../../components/SelectDate/SelectDate";
import Textarea from "../../components/Textarea/Textarea";
import { getMyTickets, getMessages, answerTicket } from "../../api/ApiSupport";

class ProfilePage extends Death13.Component {
	constructor(props: any) {
		super(props);
		this.loadProfile();
		this.startPolling();
	}

	state: any = {
		errors: {},
		name: AppStorage.name,
		surname: AppStorage.surname,
		email: AppStorage.email,
		oldPassword: "",
		newPassword: "",
		gender: "male",
		profileState: 0,
		avatarKey: 0,
		avatarUrl: AppStorage.getAvatarUrl(),
		isModalOpen: false,
		isConfirm: false,
		isStatus: false,
		// support chat state
		supportTickets: [],
		selectedTicketId: null,
		chatMessages: [],
		chatInputText: "",
		showNewTicketForm: false,
		newTicketSubject: "",
		newTicketMessage: "",
	};

	pollingInterval: any = null;

	componentDidMount() {
		this.startPolling();
	}

	componentWillUnmount() {
		this.stopPolling();
	}

	loadProfile = async () => {
		const data = await getProfile();
		if (data === null) {
			window.app.handleRoute("/login");
		} else {
			AppStorage.setProfileData({
				name: data.name || "",
				surname: data.surname || "",
				email: data.email || "",
				image_path: data.image_path || "",
			});
			this.setState({
				name: data.name || "",
				surname: data.surname || "",
				email: data.email || "",
				avatarUrl: AppStorage.getAvatarUrl(),
				isStatus: false,
			});
		}
	};

	validateField = (field: string, value: string) => {
		const data: any = {
			email: field === "email" ? value : this.state.email,
			newPassword: field === "newPassword" ? value : this.state.newPassword,
			oldPassword: field === "oldPassword" ? value : this.state.oldPassword,
			name: field === "name" ? value : this.state.name,
			surname: field === "surname" ? value : this.state.surname,
		};
		const result = validation(data);
		if (!result.isValid) {
			const fieldError = result.errors.find((err: any) => err.field === field);
			if (fieldError) {
				return fieldError.message;
			}
		}
		return undefined;
	};

	handleAvatarUpdate = () => {
		this.setState({
			avatarKey: this.state.avatarKey + 1,
			avatarUrl: AppStorage.getAvatarUrl(),
			isConfirm: true,
			isStatus: true,
		});
	};

	async handleChangePassword(event: any) {
		event.preventDefault();
		try {
			const response = await changePassword({
				old_password: this.state.oldPassword,
				new_password: this.state.newPassword,
			});
			if (response) {
				this.setState({
					oldPassword: "",
					newPassword: "",
					isConfirm: true,
					isStatus: true,
				});
			}
		} catch {
			this.setState({ isConfirm: true });
		}
	}

	async handleChangeProfileData(event: any) {
		event.preventDefault();
		try {
			const response = await changeProfile({
				name: this.state.name,
				surname: this.state.surname,
			});
			if (response) {
				const currentImagePath = AppStorage.image_path;
				AppStorage.setProfileData({
					name: this.state.name,
					surname: this.state.surname,
					email: this.state.email,
					image_path: currentImagePath,
				});
				this.setState({
					name: this.state.name,
					surname: this.state.surname,
					isConfirm: true,
					isStatus: true,
				});
			} else {
				this.setState({ isConfirm: true, isStatus: false });
			}
		} catch (error) {
			console.error("Ошибка изменения профиля:", error);
			this.setState({ isConfirm: true, isStatus: false });
		}
	}

	handleInputChange = (field: string, value: string) => {
		const error = this.validateField(field, value);
		this.setState({
			[field]: value,
			errors: {
				...this.state.errors,
				[field]: error,
			},
		});
	};

	handleGenderChange = (value: string) => {
		this.setState({ gender: value });
	};

	handleLogout = async (event: Event) => {
		event.preventDefault();
		this.setState({ isModalOpen: false, isConfirm: false });
		window.app.handleRoute("/login");
	};

	handleBackToMail = () => {
		this.setState({ isModalOpen: false, isConfirm: false });
		window.app.handleRoute("/");
	};

	handleAvatar = (event: Event) => {
		event.stopPropagation();
		event.preventDefault();
		this.setState({ isModalOpen: true });
	};

	handleCloseModal = () => {
		this.setState({ isModalOpen: false, isConfirm: false });
	};

	handleProfileClick = () => {
		this.setState({ isModalOpen: false, isConfirm: false });
		window.app.handleRoute("/profile");
	};

	handleChangeProfile = () => {
		this.setState({ profileState: 0 });
	};

	handleChangePasswordState = () => {
		this.setState({ profileState: 1 });
	};

	handleSetting = () => {
		this.setState({ profileState: 2 });
	};

	handleSupport = () => {
		this.setState({ profileState: 3 });
		this.fetchSupportTickets();
	};

	handleNewTicket = () => {
		const supportModal = document.querySelector(".support-modal");
		if (supportModal) {
			supportModal.classList.toggle("show");
		}
	};

	startPolling = () => {
		this.pollingInterval = setInterval(() => {
			this.fetchSupportTickets();
			if (this.state.selectedTicketId) {
				this.fetchTicketMessages(this.state.selectedTicketId);
			}
		}, 10000);
	};

	stopPolling = () => {
		if (this.pollingInterval) {
			clearInterval(this.pollingInterval);
			this.pollingInterval = null;
		}
	};

	fetchSupportTickets = async () => {
		const tickets = await getMyTickets();
		this.setState({ supportTickets: tickets });
	};

	fetchTicketMessages = async (ticketId: number) => {
		const messages = await getMessages(ticketId);
		this.setState({ chatMessages: messages });
	};

	handleSelectTicket = (ticketId: number) => {
		this.setState({ selectedTicketId: ticketId });
		this.fetchTicketMessages(ticketId);
	};

	handleChatInputChange = (e: any) => {
		this.setState({ chatInputText: e.target.value });
	};

	handleSendMessage = async () => {
		const { chatInputText, selectedTicketId, chatMessages } = this.state;
		const resp = await answerTicket(selectedTicketId, chatInputText);
		if (resp) {
			this.setState({
				chatInputText: "",
				chatMessages: [...chatMessages, resp],
			});
		}
	};

	handleCreateTicket = () => {
		const { newTicketSubject, newTicketMessage, supportTickets } = this.state;
		if (!newTicketSubject.trim() || !newTicketMessage.trim()) return;

		const newTicket = {
			id: Date.now(),
			subject: newTicketSubject,
			status: "open",
			lastMessagePreview:
				newTicketMessage.slice(0, 50) +
				(newTicketMessage.length > 50 ? "..." : ""),
		};
		const initialMsg = {
			id: Date.now(),
			text: newTicketMessage,
			timestamp: new Date().toISOString(),
			is_admin: false,
		};

		this.setState({
			supportTickets: [...supportTickets, newTicket],
			showNewTicketForm: false,
			newTicketSubject: "",
			newTicketMessage: "",
			selectedTicketId: newTicket.id,
			chatMessages: [initialMsg],
		});
	};

	getTicketStatus = (ticket: any) => {
		const status = ticket.status;
		if (status === "open") return "открыт";
		if (status === "in_progress") return "в обработке";
		if (status === "closed") return "закрыт";
		return status;
	};

	render() {
		const {
			errors,
			oldPassword,
			newPassword,
			name,
			surname,
			profileState,
			avatarKey,
			avatarUrl,
			isModalOpen,
			isConfirm,
			isStatus,
			gender,
			supportTickets,
			selectedTicketId,
			chatMessages,
			chatInputText,
			showNewTicketForm,
			newTicketSubject,
			newTicketMessage,
		} = this.state;

		return (
			<div className="profile-page" onClick={() => this.handleCloseModal()}>
				<SupportModal />
				<aside className="sidebar">
					<Sidebar
						isProfile={1}
						isPressProfile={profileState}
						backToMail={this.handleBackToMail}
						changeProfile={this.handleChangeProfile}
						changePassword={this.handleChangePasswordState}
						handleSetting={this.handleSetting}
						handleSupport={this.handleSupport}
						newMail={() => {}}
					/>
				</aside>

				<div className="right-part">
					<div className="top-bar">
						<div className="search-bar"></div>
						<div className="top-right-menu">
							<Button
								svg={AppStorage.getAvatarUrl()}
								name="avatar"
								help="Аккаунт"
								onClick={this.handleAvatar}
							/>
						</div>
					</div>
					<div
						className={`profile-content-area${profileState === 3 ? " support-chat-open" : ""}`}
					>
						{profileState === 0 && (
							<div className="profile-container">
								<h1>Личные данные</h1>
								<div className="profile-content">
									<div className="profile-avatar">
										<UploadAvatar
											image={avatarUrl}
											onAvatarUpdate={this.handleAvatarUpdate}
											key={avatarKey}
										/>
									</div>
									<form action="" className="profile-form">
										<Input
											type="text"
											placeholder="Введите имя"
											input_title="Имя"
											name="name"
											value={name}
											error={errors.name}
											onInput={(e: any) => {
												this.handleInputChange("name", e.target.value);
											}}
										/>
										<Input
											type="text"
											placeholder="Введите фамилию"
											input_title="Фамилия"
											name="surname"
											value={surname}
											error={errors.surname}
											onInput={(e: any) => {
												this.handleInputChange("surname", e.target.value);
											}}
										/>
										<SelectDate />
										<div className="profile__checkbox">
											<span>Пол</span>
											<div className="checkbox-actions">
												<div className="checkbox-form">
													<Input
														id="male"
														type="radio"
														name="radio-gender"
														checked={gender === "male"}
														onInput={() => this.handleGenderChange("male")}
													/>
													<label for="male">Мужской</label>
												</div>
												<div className="checkbox-form">
													<Input
														id="female"
														type="radio"
														name="radio-gender"
														checked={gender === "female"}
														onInput={() => this.handleGenderChange("female")}
													/>
													<label for="female">Женский</label>
												</div>
											</div>
										</div>
										<div className="profile-actions">
											<Button
												title="Сохранить"
												name="change-profile"
												onClick={(event: any) => {
													event.preventDefault();
													this.handleChangeProfileData(event);
												}}
											/>
											<Button
												title="Назад"
												name="back-to-mail"
												onClick={(event: any) => {
													event.preventDefault();
													this.handleBackToMail();
												}}
											/>
										</div>
									</form>
								</div>
							</div>
						)}

						{profileState === 1 && (
							<div className="profile-security">
								<h1>Безопасность</h1>
								<div className="profile-content">
									<form action="" className="profile-form">
										<Input
											type="password"
											placeholder="Введите пароль"
											input_title="Старый пароль"
											name="oldPassword"
											error={errors.oldPassword}
											value={oldPassword}
											onInput={(e: any) => {
												this.handleInputChange("oldPassword", e.target.value);
											}}
										/>
										<Input
											type="password"
											placeholder="Введите пароль"
											input_title="Новый пароль"
											name="newPassword"
											error={errors.newPassword}
											value={newPassword}
											onInput={(e: any) => {
												this.handleInputChange("newPassword", e.target.value);
											}}
										/>
										<div className="profile-actions">
											<Button
												title="Сохранить"
												name="change-password"
												onClick={(event: any) => {
													this.handleChangePassword(event);
												}}
											/>
											<Button
												title="Назад"
												name="back-to-mail"
												onClick={(event: any) => {
													event.preventDefault();
													this.handleBackToMail();
												}}
											/>
										</div>
									</form>
								</div>
							</div>
						)}
						{profileState === 2 && (
							<div className="profile-security">
								<h1>Настройки</h1>
								<div className="profile-content">
									<form action="" className="profile-form">
										<div className="profile__checkbox">
											<span>Тема</span>
											<div className="checkbox-actions">
												<div className="checkbox-form">
													<Input
														id="dark"
														type="radio"
														name="radio-theme"
														checked={AppStorage.theme === "dark"}
														onInput={() => AppStorage.setTheme("dark")}
													/>
													<label for="dark">Темная</label>
													<div className="checkbox-form">
														<Input
															id="light"
															type="radio"
															name="radio-theme"
															checked={AppStorage.theme === "light"}
															onInput={() => AppStorage.setTheme("light")}
														/>
														<label for="light">Светлая</label>
													</div>
												</div>
											</div>
										</div>
									</form>
								</div>
							</div>
						)}
						{profileState === 3 && (
							<div className="profile-support">
								<div className="support-container">
									<div className="support-tickets-panel">
										<div className="support-tickets-header">
											<h2>Поддержка</h2>
											<Button
												svg="../../assets/svg/Compose.svg"
												className="small-text"
												name="new-ticket"
												onClick={this.handleNewTicket}
											/>
										</div>
										{showNewTicketForm && (
											<div className="new-ticket-form">
												<Input
													type="text"
													placeholder="Subject"
													value={newTicketSubject}
													onInput={(e: any) =>
														this.setState({ newTicketSubject: e.target.value })
													}
												/>
												<textarea
													placeholder="Describe your issue..."
													value={newTicketMessage}
													onChange={(e: any) =>
														this.setState({ newTicketMessage: e.target.value })
													}
													rows={4}
												/>
												<div className="form-actions">
													<Button
														title="Create"
														name="create-ticket"
														onClick={this.handleCreateTicket}
													/>
													<Button
														title="Cancel"
														name="cancel-ticket"
														onClick={() =>
															this.setState({
																showNewTicketForm: false,
																newTicketSubject: "",
																newTicketMessage: "",
															})
														}
													/>
												</div>
											</div>
										)}
										<ul className="tickets-list">
											{supportTickets.map((ticket: any) => (
												<li
													key={ticket.id}
													className={`ticket-item ${selectedTicketId === ticket.id ? "active" : ""}`}
													onClick={() =>
														this.handleSelectTicket(ticket.ticket_id)
													}
												>
													<div className="ticket-subject">{ticket.header}</div>
													<div
														className="ticket-status"
														data-status={this.getTicketStatus(ticket)}
													>
														{this.getTicketStatus(ticket)}
													</div>
													<div className="ticket-preview">
														{ticket.lastMessagePreview}
													</div>
												</li>
											))}
										</ul>
									</div>

									<div className="support-chat-panel">
										{!selectedTicketId ? (
											<div className="chat-empty">
												Выберите тикет для просмотра
											</div>
										) : (
											<>
												<div className="chat-messages">
													{chatMessages.map((msg: any) => (
														<div
															key={msg.id}
															className={`message ${msg.is_admin ? "admin" : "user"}`}
														>
															<div className="message-bubble">
																<div className="message-text">{msg.text}</div>
																{/*<div className="message-time">
																	{new Date(msg.timestamp).toLocaleTimeString()}
																</div>*/}
															</div>
														</div>
													))}
												</div>
												<div className="chat-input-area">
													<Textarea
														type="text"
														className="chat-input"
														placeholder="Введите сообщение..."
														value={chatInputText}
														onInput={this.handleChatInputChange}
													/>
													<Button
														title="Send"
														name="send-message"
														onClick={this.handleSendMessage}
													/>
												</div>
											</>
										)}
									</div>
								</div>
							</div>
						)}
					</div>
					<ProfileModal
						isOpen={isModalOpen}
						onClose={this.handleCloseModal}
						onProfileClick={this.handleProfileClick}
						onLogout={this.handleLogout}
					/>
					<ConfirmationModal
						isOpen={isConfirm}
						onClose={this.handleCloseModal}
						isStatus={isStatus}
					/>
				</div>
			</div>
		);
	}
}

export default ProfilePage;
