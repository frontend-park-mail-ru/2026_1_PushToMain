/**
 * Отправляет POST-запрос на эндпоинт /login с данными.
 */
export async function postDataLogin(data = {}) {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
            credentials: "include",
        });

        const responseData = await response.json();
        console.log(responseData);
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
                    message: "",
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
        const response = await fetch(`http://localhost:8080/api/v1/signup`, {
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
                    message: "",
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
        const response = await fetch(`http://localhost:8080/api/v1/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (response.ok) {
            return response;
        }
    } catch (error) {
        console.log("Сервер не отвечает", error);
    }
}
