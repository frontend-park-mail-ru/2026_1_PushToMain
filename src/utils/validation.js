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
                errors.push({ field: 'email', message: 'Поле почты обязательно' });
            } else {
                const regex = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]{2,}/gm;
                if (!regex.test(data)) {
                    errors.push({
                        field: 'email', message: 'Недопустимый формат почты'
                    });
                }
            }
        }

        if (type == "password") {
            if (!data) {
                errors.push({ field: 'password', message: 'Поле пароля обязательно' })
            }
        }

        if (type == "name") {
            if (!data) {
                errors.push({ field: 'name', message: 'Поле имя обязательно' })
            }
        }

        if (type == "surname") {
            if (!data) {
                errors.push({ field: 'surname', message: 'Поле фамилия обязательно' })
            }
        }

        if (type == "repassword") {
            if (!data) {
                errors.push({ field: 'repassword', message: 'Поле повторный пароль обязательно' })
            }
        }
    }

    console.log(errors)

    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors

    }
}
