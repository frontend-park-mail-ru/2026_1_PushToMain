import { URL } from "./config.js"

export async function postDataLogin(data = {}) {
    console.log(data);

    const response = await fetch(`${URL}/login`, {
        method: 'post',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify(data)

    })
    return await response.json()
}

export async function postDataReg(data = {}) {
    console.log(data);

    const response = await fetch(`${URL}/register`, {
        method: 'post',
        mode: 'cors',
        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify(data)

    })
    return await response.json()
}
