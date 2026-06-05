import { EMAIL_URL } from "./config";
import { AppStorage } from "../App";

// private.HandleFunc("/drafts/{id}", h.UpdateDraft).Methods(http.MethodPut, http.MethodOptions);
// private.HandleFunc("/drafts/{id}/send", h.SendDraft).Methods(http.MethodPost, http.MethodOptions);
//	private.HandleFunc("/drafts/{id}", h.UpdateDraft).Methods(http.MethodPut, http.MethodOptions)

export async function createDraft(draftData: {
  header: string;
  body: string;
  receivers: string[];
}) {
  try {
    const response = await fetch(`${EMAIL_URL}/drafts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": AppStorage.csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({
        header: draftData.header,
        body: draftData.body,
        receivers: draftData.receivers,
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

export async function getDraftByID(ID: number) {
  try {
    const response = await fetch(`${EMAIL_URL}/drafts/${ID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": AppStorage.csrfToken,
      },
      credentials: "include",
    });
    if (response.ok) {
      return response;
    }
  } catch {}
}

export async function updateDraft(
  draftData: { header: string; body: string; receivers: string[] },
  ID: number,
) {
  try {
    const response = await fetch(`${EMAIL_URL}/drafts/${ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": AppStorage.csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({
        header: draftData.header,
        body: draftData.body,
        receivers: draftData.receivers,
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

export async function deleteDraft(IDs: number[]) {
  try {
    const response = await fetch(`${EMAIL_URL}/drafts`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": AppStorage.csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({ ids: IDs }),
    });
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
}

export async function getDrafts(offset: number) {
  try {
    const response = await fetch(
      `${EMAIL_URL}/drafts?limit=50&offset=${offset}`,
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

export async function sendDraft(data = {}, draftID: number) {
  try {
    const response = await fetch(`${EMAIL_URL}/drafts/${draftID}/send`, {
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
