import { URL } from "./config.js";

/**
 * Отправляет POST-запрос на эндпоинт /login с данными.
 */
export async function postDataLogin(data = {}) {
    const response = await fetch(`http://localhost:8080/signin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.ok) {
        return {
            isValid: true,
            token: responseData.token,
            errors: [],
        };
    } else {
        if (response.status === 401) {
            return {
                isValid: false,
                errors: [
                    {
                        field: "password",
                        message: "Неверный пароль или почта",
                    },
                    {
                        field: "email",
                        message: "",
                    },
                ],
            };
        }
        if (response.status === 500) {
            return {
                isValid: false,
                errors: [
                    {
                        field: "password",
                        message: "Сервер перестал работать",
                    },
                    {
                        field: "email",
                        message: "",
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
                        message: "",
                    },
                ],
            };
        }
    }
}

/**
 * Отправляет POST-запрос на эндпоинт /register с данными.
 */
export async function postDataReg(data = {}) {
    const response = await fetch(`http://localhost:8080/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
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
                        message: "",
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
                        message: "",
                    },
                ],
            };
        }
        if (response.status === 500) {
            return {
                isValid: false,
                errors: [
                    {
                        field: "password",
                        message: "Сервер перестал работать",
                    },
                    {
                        field: "email",
                        message: "",
                    },
                ],
            };
        }
    }
}
