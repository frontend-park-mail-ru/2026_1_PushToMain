import { URL } from "./config";
import { getCSRFToken } from "./ApiAuth";
/**
 * Отправляет GET-запрос на эндпоинт /emails.
 */
export async function getEmailAll(offset: number) {
    try {
        const response = await fetch(`${URL}/emails?limit=50&offset=${offset}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log("Сервер не отвечает", error);
    }
}

export async function sendEmail(data = {}) {
    try {
        const csrfToken = await getCSRFToken();
        const response = await fetch(`${URL}/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify(data),
        });

        if (response) {
            return true;
        }
    } catch (error) {
        console.log("Сервер не отвечает", error);
        return false;
    }
}

export async function readEmail(ID: number) {
    try {
        const csrfToken = await getCSRFToken();
        const response = await fetch(`${URL}/emails/${ID}/read`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
            },
            credentials: "include",
        });

        if (response.ok) {
            return true;
        }

        return false;
    } catch (error) {
        console.log("Сервер не отвечает", error);
        return false;
    }
}

export async function getEmailByID(ID: number) {
    try {
        const csrfToken = await getCSRFToken();
        const response = await fetch(`${URL}/emails/${ID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
            },
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        }

        return false;
    } catch (error) {
        console.log("Сервер не отвечает", error);
        return false;
    }
}

export async function deleteEmailByID(ID: number) {
    try {
        const csrfToken = await getCSRFToken();
        const response = await fetch(`${URL}/emails/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ email_id: ID }),
        });

        if (response.ok) {
            return true;
        }
        return false;
    } catch (error) {
        console.log("Сервер не отвечает", error);
        return false;
    }
}

export async function deleteMyEmailByID(ID: number) {
    try {
        const csrfToken = await getCSRFToken();
        const response = await fetch(`${URL}/myemails/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ email_id: ID }),
        });

        if (response.ok) {
            return true;
        }
        return false;
    } catch (error) {
        console.log("Сервер не отвечает", error);
        return false;
    }
}

export async function getEmailSend(offset: number) {
    try {
        const response = await fetch(`${URL}/myemails?limit=50&offset=${offset}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        }
    } catch (error) {
        console.log("Сервер не отвечает", error);
    }
}
