import { EMAIL_URL } from "./config";
import { AppStorage } from "../App";

export async function getAttachments(emailId: number) {
  try {
    const response = await fetch(`${EMAIL_URL}/emails/${emailId}/attachments`, {
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
    return null;
  } catch {
    return null;
  }
}

export async function uploadAttachment(emailId: number, file: File) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${EMAIL_URL}/emails/${emailId}/attachments`, {
      method: "POST",
      headers: {
        "X-CSRF-Token": AppStorage.csrfToken,
      },
      credentials: "include",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function downloadAttachment(
  emailId: number,
  attachmentId: number,
) {
  try {
    const response = await fetch(
      `${EMAIL_URL}/emails/${emailId}/attachments/${attachmentId}`,
      {
        method: "GET",
        headers: {
          "X-CSRF-Token": AppStorage.csrfToken,
        },
        credentials: "include",
      },
    );

    if (response.ok) {
      const blob = await response.blob();
      return blob;
    }
    return null;
  } catch {
    return null;
  }
}

export async function deleteAttachments(
  emailId: number,
  attachmentIds: number[],
) {
  try {
    const response = await fetch(`${EMAIL_URL}/emails/${emailId}/attachments`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": AppStorage.csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({ ids: attachmentIds }),
    });

    if (response.ok) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
