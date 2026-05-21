import { FOLDER_URL } from "./config";
import { AppStorage } from "../App";

export async function createNewFolder(folderName: string = "Новая папка") {
    try {
        const response = await fetch(`${FOLDER_URL}/folder/new`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": AppStorage.csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({
                folder_name: folderName,
            }),
        });

        if (response) {
            const data = await response.json();
            return data;
        }
    } catch {
        return false;
    }
}

export async function changeFolderName(folderID: number, folderName: string) {
    try {
        const response = await fetch(`${FOLDER_URL}/folder/${folderID}/name`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": AppStorage.csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ folder_name: folderName }),
        });
        if (response.ok) {
            return response;
        }
    } catch {}
}

export async function getEmailsFromFolder(offset: number, folderID: number) {
    try {
        const response = await fetch(`${FOLDER_URL}/folder/${folderID}?limit=50&offset=${offset}`, {
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

export async function deleteEmailsFromFolder(folderID: number, emailID: number[]) {
    try {
        const response = await fetch(`${FOLDER_URL}/folder/${folderID}/delete`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": AppStorage.csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ emails_id: emailID }),
        });

        if (response.ok) {
            return true;
        }
        return false;
    } catch {
        return false;
    }
}

export async function addEmailsInFolder(folderID: number, emailID: number[]) {
    try {
        const response = await fetch(`${FOLDER_URL}/folder/${folderID}/add`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": AppStorage.csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({ emails_id: emailID }),
        });

        if (response) {
            const data = await response.json();
            return data;
        }
    } catch {
        return false;
    }
}

export async function deleteFolder(folderID: number) {
    try {
        const response = await fetch(`${FOLDER_URL}/folder/${folderID}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": AppStorage.csrfToken,
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
