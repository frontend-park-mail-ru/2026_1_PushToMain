/**
 * Проверяет поля формы на валидность
 * @param {Object} dataForm - Объект с полями формы
 * @returns {{isValid: boolean, errors: Array<{field: string, message: string}>}}
 */
export function validation(dataForm) {

    const errors = [];

    for (const [type, data] of Object.entries(dataForm)) {
        if (type == "email") {
            if (!data) {
                errors.push({ field: 'email', massege: 'Поле почты обязательно' })
            }
        }

        if (type == "password") {
            if (!data) {
                errors.push({ field: 'password', massege: 'Поле пароля обязательно' })
            }
        }

        if (type == "name") {
            if (!data) {
                errors.push({ field: 'name', massege: 'Поле имя обязательно' })
            }
        }

        if (type == "surname") {
            if (!data) {
                errors.push({ field: 'surname', massege: 'Поле фамилия обязательно' })
            }
        }

        if (type == "repassword") {
            if (!data) {
                errors.push({ field: 'repassword', massege: 'Поле повторный пароль обязательно' })
            }
        }
    }

    console.log(errors)

    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors

    }
}
