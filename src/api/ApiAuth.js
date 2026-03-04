import { getApiUrl } from "./config.js"

/**
 * Отправляет POST-запрос на эндпоинт /login с данными.
 */
export async function postDataLogin(data = {}) {

    const response = await fetch(`${getApiUrl()}/login`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)

    })

    if (response.ok) {
        return response.json()
    } else {
        return {
            error: "Неверный пароль или почта",
        }
    }

}

/**
 * Отправляет POST-запрос на эндпоинт /register с данными.
 */
export async function postDataReg(data = {}) {
    console.log(data);

    const response = await fetch(`${URL}/register`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify(data)

    })

    if (response.ok) {
        return response.json()
    } else {
        return {
            error: "Такой адрес почты уже существует",
        }
    }
}
