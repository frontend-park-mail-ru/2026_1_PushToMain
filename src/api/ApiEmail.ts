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

export async function readEmail(email_ids: number[]) {
    try {
        const csrfToken = await getCSRFToken();
        const response = await fetch(`${URL}/emails/read`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ email_ids: email_ids }),
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

export async function deleteEmailByID(IDs: number[]) {
    try {
        const csrfToken = await getCSRFToken();
        const response = await fetch(`${URL}/emails/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ email_id: IDs }),
        });

        if (response.ok) {
            return true;
        }
        return false;
    } catch {
        return false;
    }
}

export async function deleteMyEmailByID(IDs: number[]) {
    try {
        const csrfToken = await getCSRFToken();
        const response = await fetch(`${URL}/myemails/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ email_id: IDs }),
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

// Ручка для спама, избранного и т.д с кастомными хз работает ли
export async function changeFolderV2(IDs: number[], folderName: string) {
    try {
        const csrfToken = await getCSRFToken();
        const response = await fetch(`${URL}/emails/${IDs}/folder`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ folder: folderName }),
        });

        if (response.ok) {
            return true;
        }

        return false;
    } catch {
        return false;
    }
}

export async function restoreFromTrash(IDs: number[]) {
    try {
        const csrfToken = await getCSRFToken();
        const response = await fetch(`${URL}/emails/restore`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ email_id: IDs }),
        });

        if (response.ok) {
            return true;
        }

        return false;
    } catch {
        return false;
    }
}

export async function getEmailsSpam(offset: number) {
    try {
        const response = await fetch(`${URL}/emails/spam?limit=50&offset=${offset}`, {
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

export async function getEmailsTrash(offset: number) {
    try {
        const response = await fetch(`${URL}/emails/trash?limit=50&offset=${offset}`, {
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

export async function getEmailsFavorite(offset: number) {
    try {
        const response = await fetch(`${URL}/emails/favorite?limit=50&offset=${offset}`, {
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
