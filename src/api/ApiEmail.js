export async function getEmail() {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/emails`, {
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
