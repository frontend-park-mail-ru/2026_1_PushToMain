import { URL } from "./config";
/**
 * Отправляет POST-запрос на эндпоинт /login с данными.
 */
export async function postDataLogin(data = {}) {
    try {
        const response = await fetch(`${URL}/signin`, {
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
                            message: "Неверный пароль или почта",
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
                            message: "Клиентская ошибка",
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
                    message: "Сервер перестал работать",
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
        const response = await fetch(`${URL}/signup`, {
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
                            message: "Клиентская ошибка",
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
                            message: "Такая почта уже существует",
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
                    message: "Сервер перестал работать",
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
        const response = await fetch(`${URL}/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (response.ok) {
            return response;
        }
    } catch {
    }
}

export async function getProfile() {
    try {
        const response = await fetch(`${URL}/profile/me`, {
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
        const csrfToken = await getCSRFToken();
        const response = await fetch(`${URL}/password`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken,
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
        const response = await fetch(`${URL}/csrf`, {
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
    const csrfToken = await getCSRFToken();
    try {
        const formData = new FormData();
        formData.append("avatar", file);

        const response = await fetch(`${URL}/profile/avatar`, {
            method: "POST",
            headers: {
                "X-CSRF-Token": csrfToken,
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

export async function changeProfile(data: { name: string; surname: string }) {
    const csrfToken = await getCSRFToken();
    try {
        const response = await fetch(`${URL}/profile/change`, {
            method: "PUT",
            headers: {
                "X-CSRF-Token": csrfToken,
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
