import { EMAIL_URL } from "./config";
import { AppStorage } from "../App";
/**
 * Отправляет GET-запрос на эндпоинт /inbox.
 */
export async function getInbox(offset: number) {
  try {
    const response = await fetch(
      `${EMAIL_URL}/inbox?limit=50&offset=${offset}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch {
    return null;
  }
}

export async function getAllEmails(offset: number) {
  try {
    const response = await fetch(
      `${EMAIL_URL}/all-emails?limit=50&offset=${offset}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

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
    const response = await fetch(`${EMAIL_URL}/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": AppStorage.csrfToken,
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

/*
	private.HandleFunc("/emails/read", h.MarkEmailsAsRead).Methods(http.MethodPut, http.MethodOptions)
	private.HandleFunc("/emails/unread", h.MarkEmailsAsUnRead).Methods(http.MethodPut, http.MethodOptions)
    */
export async function readEmail(email_ids: number[]) {
  try {
    const response = await fetch(`${EMAIL_URL}/emails/read`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": AppStorage.csrfToken,
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

export async function unReadEmail(email_ids: number[]) {
  try {
    const response = await fetch(`${EMAIL_URL}/emails/unread`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": AppStorage.csrfToken,
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

export async function getEmailByID(ID: number) {
  try {
    const response = await fetch(`${EMAIL_URL}/emails/${ID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": AppStorage.csrfToken,
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

export async function getEmailSend(offset: number) {
  try {
    const response = await fetch(
      `${EMAIL_URL}/sent?limit=50&offset=${offset}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      },
    );

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
    const response = await fetch(`${EMAIL_URL}/emails/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": AppStorage.csrfToken,
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
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${EMAIL_URL}/emails/send/${emailId}/file`, {
      method: "POST",
      headers: {
        "X-CSRF-Token": AppStorage.csrfToken,
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
