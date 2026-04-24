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
    } catch {
        return null;
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
            const res = await response.json();
            return res;
        }
    } catch {
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
    } catch {
        return false;
    }
}

export async function unReadEmail(ID: number) {
    try {
        const csrfToken = await getCSRFToken();
        const response = await fetch(`${URL}/emails/${ID}/unread`, {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
        return null;
    }
}

export async function seacrhEmail(data: string) {
    try {
        const csrfToken = await getCSRFToken();
        const response = await fetch(`${URL}/emails/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify(data),
        });

        if (response) {
            const data = await response.json();
            return data;
        }
    } catch {
        return false;
    }
}

export async function uploadFile(file: File, emailId: number) {
    const csrfToken = await getCSRFToken();
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${URL}/emails/send/${emailId}/file`, {
            method: "POST",
            headers: {
                "X-CSRF-Token": csrfToken,
            },
            credentials: "include",
            body: formData,
        });
        if (response.ok) {
            return true;
        }
    } catch {
        return null;
    }
}
