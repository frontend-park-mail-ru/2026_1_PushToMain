import { AppStorage } from "../App";
import { USER_URL } from "./config";
/**
 * Отправляет POST-запрос на эндпоинт /login с данными.
 */
export async function postDataLogin(data = {}) {
  try {
    const response = await fetch(`${USER_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    const responseData = await response.json();
    if (response.ok) {
      return {
        isValid: true,
        token: responseData.token,
        errors: [],
      };
    } else {
      if (response.status === 401 || response.status === 404) {
        return {
          isValid: false,
          errors: [
            {
              field: "password",
              message: AppStorage.t("incorrect_credentials"),
            },
            {
              field: "email",
              message: " ",
            },
          ],
        };
      }
      if (response.status === 400) {
        return {
          isValid: false,
          errors: [
            {
              field: "password",
              message: AppStorage.t("client_error"),
            },
            {
              field: "email",
              message: " ",
            },
          ],
        };
      }
    }
  } catch {
    return {
      isValid: false,
      errors: [
        {
          field: "password",
          message: AppStorage.t("server_error"),
        },
        {
          field: "email",
          message: " ",
        },
      ],
    };
  }
}

/**
 * Отправляет POST-запрос на эндпоинт /register с данными.
 */
export async function postDataReg(data = {}) {
  try {
    const response = await fetch(`${USER_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
      credentials: "include",
    });

    const responseData = await response.json();

    if (response.ok) {
      return {
        isValid: true,
        token: responseData.token,
        errors: [],
      };
    } else {
      if (response.status === 400) {
        return {
          isValid: false,
          errors: [
            {
              field: "password",
              message: AppStorage.t("client_error"),
            },
            {
              field: "email",
              message: " ",
            },
          ],
        };
      }
      if (response.status === 409) {
        return {
          isValid: false,
          errors: [
            {
              field: "password",
              message: AppStorage.t("email_exists"),
            },
            {
              field: "email",
              message: " ",
            },
          ],
        };
      }
    }
  } catch {
    return {
      isValid: false,
      errors: [
        {
          field: "password",
          message: AppStorage.t("server_error"),
        },
        {
          field: "email",
          message: " ",
        },
      ],
    };
  }
}
/**
 * Отправляет POST-запрос на эндпоинт /logout с данными.
 */
export async function logOut() {
  try {
    const response = await fetch(`${USER_URL}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      return response;
    }
  } catch {}
}

export async function getProfile() {
  try {
    AppStorage.csrfToken = await getCSRFToken();
    const response = await fetch(`${USER_URL}/profile/me`, {
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

export async function changePassword(data = {}) {
  try {
    const response = await fetch(`${USER_URL}/password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": AppStorage.csrfToken,
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (response.ok) {
      return response;
    }
  } catch {}
}

export async function getCSRFToken() {
  try {
    const response = await fetch(`${USER_URL}/csrf`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      return data.csrf_token || null;
    }
  } catch {
    return null;
  }
}

export async function uploadAvatar(file: File) {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await fetch(`${USER_URL}/profile/avatar`, {
      method: "POST",
      headers: {
        "X-CSRF-Token": AppStorage.csrfToken,
      },
      credentials: "include",
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      return data.image_path;
    }
  } catch {
    return null;
  }
}

export async function changeProfile(data: {
  name: string;
  surname: string;
  is_male: string;
  accept_anonymous: boolean;
}) {
  try {
    const response = await fetch(`${USER_URL}/profile/change`, {
      method: "PUT",
      headers: {
        "X-CSRF-Token": AppStorage.csrfToken,
      },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch {
    return null;
  }
}
