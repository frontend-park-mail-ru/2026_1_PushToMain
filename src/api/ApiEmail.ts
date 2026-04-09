import { URL } from "./config";
/**
 * Отправляет GET-запрос на эндпоинт /emails.
 */
export async function getEmail() {
    try {
        const requestId = crypto.randomUUID();
        const response = await fetch(`${URL}/emails?limit=30&offset=0`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
            return data.emails || [];
        }
    } catch (error) {
        console.log("Сервер не отвечает", error);
    }
}

export async function sendEmail(data = {}) {
    try {
        const response = await fetch(`${URL}/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.log("Сервер не отвечает", error);
    }
}
