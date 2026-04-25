import { URL } from "./config";
import { getCSRFToken } from "./ApiAuth";

export async function sendSupportTicket(payload: any) {
	try {
		const csrfToken = await getCSRFToken();
		const response = await fetch(`${URL}/support/send`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-Token": csrfToken,
			},
			body: JSON.stringify(payload),
			credentials: "include",
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(
				errorData.message || `Request failed with status ${response.status}`,
			);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Failed to submit ticket:", error);
	}
}

export async function getMyTickets() {
	try {
		const csrfToken = await getCSRFToken();
		const response = await fetch(`${URL}/support/myquestions`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-Token": csrfToken,
			},
			credentials: "include",
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(
				errorData.message || `Request failed with status ${response.status}`,
			);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Failed to get my tickets:", error);
	}
}

export async function getAdminTickets() {
	try {
		const response = await fetch(`${URL}/support/admin/questions`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(
				errorData.message || `Request failed with status ${response.status}`,
			);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Failed to get my tickets:", error);
	}
}

export async function getMessages(ticket_id: number) {
	try {
		const csrfToken = await getCSRFToken();
		const response = await fetch(`${URL}/support/${ticket_id}/chat`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-Token": csrfToken,
			},
			credentials: "include",
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(
				errorData.message || `Request failed with status ${response.status}`,
			);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Failed to get messages:", error);
	}
}

export async function answerTicket(ticket_id: number, message: string) {
	try {
		const csrfToken = await getCSRFToken();
		const response = await fetch(`${URL}/support/answer`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-Token": csrfToken,
			},
			credentials: "include",
			body: JSON.stringify({
				question_id: ticket_id,
				answer: message,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(
				errorData.message || `Request failed with status ${response.status}`,
			);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Failed to answer ticket:", error);
	}
}

export async function updateTicketStatus(ticket_id: number, status: string) {
	try {
		const csrfToken = await getCSRFToken();
		const response = await fetch(`${URL}/support/changestatus`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-Token": csrfToken,
			},
			credentials: "include",
			body: JSON.stringify({
				status,
				question_id: ticket_id,
			}),
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(
				errorData.message || `Request failed with status ${response.status}`,
			);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Failed to update ticket status:", error);
	}
}
