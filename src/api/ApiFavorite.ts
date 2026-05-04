import { URL } from "./config";
import { getCSRFToken } from "./ApiAuth";

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

export async function sendFavorite(IDs: number[]) {
    try {
        const csrfToken = await getCSRFToken();
        const response = await fetch(`${URL}/emails/favorite`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ ids: IDs }),
        });

        if (response.ok) {
            return true;
        }

        return false;
    } catch {
        return false;
    }
}

export async function unFavorite(IDs: number[]) {
    try {
        const csrfToken = await getCSRFToken();
        const response = await fetch(`${URL}/emails/unfavorite`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ ids: IDs }),
        });

        if (response.ok) {
            return true;
        }

        return false;
    } catch {
        return false;
    }
}
