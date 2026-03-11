import { URL, PORT } from "./config.js";
/**
 * Отправляет GET-запрос на эндпоинт /emails.
 */
export async function getEmail() {
    try {
        const response = await fetch(`http://${URL}:${PORT}/api/v1/emails`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (response.ok) {
            const emails = await response.json();
            return emails;
        }
    } catch (error) {
        console.log("Сервер не отвечает", error);
    }
}
