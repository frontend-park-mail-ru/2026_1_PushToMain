import Death13 from "@react/stands";
import "./AdminSupportPage.scss";
import Button from "../../components/Button/Button";
import Textarea from "../../components/Textarea/Textarea";
import {
	getAdminTickets,
	getMessages,
	answerTicket,
	updateTicketStatus,
} from "../../api/ApiSupport";

class AdminSupportPage extends Death13.Component {
	state: any = {
		supportTickets: [],
		selectedTicketId: null,
		chatMessages: [],
		chatInputText: "",
		filterCategory: "all",
		sortStatus: "all",
	};

	constructor(props: any) {
		super(props);
		this.fetchSupportTickets();
		this.startPolling();
	}

	pollingInterval: any = null;

	componentDidMount() {
		this.startPolling();
	}

	componentWillUnmount() {
		this.stopPolling();
	}

	startPolling = () => {
		this.pollingInterval = setInterval(() => {
			this.fetchSupportTickets();
			if (this.state.selectedTicketId) {
				this.fetchTicketMessages(this.state.selectedTicketId);
			}
		}, 5000);
	};

	stopPolling = () => {
		if (this.pollingInterval) {
			clearInterval(this.pollingInterval);
			this.pollingInterval = null;
		}
	};

	fetchSupportTickets = async () => {
		const tickets = await getAdminTickets();
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

	handleFilterChange = (category: string) => {
		this.setState({
			filterCategory: category,
			selectedTicketId: null,
			chatMessages: [],
		});
	};

	handleSortChange = (status: string) => {
		this.setState({
			sortStatus: status,
			selectedTicketId: null,
			chatMessages: [],
		});
	};

	handleStatusChange = async (newStatus: string) => {
		const { selectedTicketId, supportTickets } = this.state;
		if (!selectedTicketId) return;

		try {
			await updateTicketStatus(selectedTicketId, newStatus);

			const updatedTickets = supportTickets.map((t: any) => {
				if (t.ticket_id === selectedTicketId) {
					return { ...t, status: newStatus };
				}
				return t;
			});
			this.setState({ supportTickets: updatedTickets });
		} catch (error) {
			console.error("Failed to update ticket status:", error);
		}
	};

	getTicketStatus = (ticket: any) => {
		const status = ticket.status;
		if (status === "in_progress") return "pending";
		return status;
	};

	getFilteredSortedTickets = () => {
		const { supportTickets, filterCategory, sortStatus } = this.state;
		let filtered = supportTickets;

		if (filterCategory !== "all") {
			filtered = filtered.filter((t: any) => t.theme === filterCategory);
		}

		if (sortStatus !== "all") {
			const priority = sortStatus;
			filtered = [...filtered].sort((a: any, b: any) => {
				if (a.status === priority && b.status !== priority) return -1;
				if (a.status !== priority && b.status === priority) return 1;
				return 0;
			});
		} else {
			const statusOrder: any = { open: 0, pending: 1, closed: 2 };
			filtered = [...filtered].sort(
				(a: any, b: any) =>
					(statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3),
			);
		}
		return filtered;
	};

	render() {
		const {
			selectedTicketId,
			supportTickets,
			chatMessages,
			chatInputText,
			filterCategory,
			sortStatus,
		} = this.state;

		const tickets = this.getFilteredSortedTickets();

		const selectedTicket = supportTickets.find(
			(t: any) => t.ticket_id === selectedTicketId,
		);

		return (
			<div className="admin-support-page">
				<div className="support-tickets-panel">
					<div className="support-tickets-header">
						<h2>Поддержка (Админ)</h2>
					</div>

					<div className="admin-filter-row">
						<div className="filter-group">
							<label>Категория</label>
							<select
								value={filterCategory}
								onChange={(e: any) => this.handleFilterChange(e.target.value)}
							>
								<option value="all">Все</option>
								<option value="bug">Баг</option>
								<option value="proposal">Предложение</option>
								<option value="complaint">Жалоба</option>
								<option value="other">Другое</option>
							</select>
						</div>
						<div className="filter-group">
							<label>Сорт. по статусу</label>
							<select
								value={sortStatus}
								onChange={(e: any) => this.handleSortChange(e.target.value)}
							>
								<option value="all">Все</option>
								<option value="open">Открытые</option>
								<option value="pending">Обработка</option>
								<option value="closed">Закрытые</option>
							</select>
						</div>
					</div>

					<ul className="tickets-list">
						{tickets.map((ticket: any) => (
							<li
								key={ticket.id}
								className={`ticket-item ${selectedTicketId === ticket.id ? "active" : ""}`}
								onClick={() => this.handleSelectTicket(ticket.ticket_id)}
							>
								<div className="ticket-subject">{ticket.header}</div>
								<div className="ticket-meta">
									<span
										className="ticket-status"
										data-status={this.getTicketStatus(ticket)}
									>
										{this.getTicketStatus(ticket)}
									</span>
									<span
										className="ticket-category"
										data-category={ticket.theme}
									>
										{ticket.theme}
									</span>
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
						<div className="chat-empty">Выберите тикет для просмотра</div>
					) : (
						<>
							<div className="admin-chat-bar">
								<div className="status-control">
									<label>Статус:</label>
									<select
										value={selectedTicket?.status || ""}
										onChange={(e: any) =>
											this.handleStatusChange(e.target.value)
										}
									>
										<option value="open">Открыт</option>
										<option value="pending">В обработке</option>
										<option value="closed">Закрыт</option>
									</select>
								</div>
							</div>
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
									className="chat-input"
									placeholder="Ответить как администратор..."
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
		);
	}
}

export default AdminSupportPage;
