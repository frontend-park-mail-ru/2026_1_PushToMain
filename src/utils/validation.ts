/**
 * Проверяет поля формы на валидность
 * @param {Object} dataForm - Объект с полями формы
 * @returns {{isValid: boolean, errors: Array<{field: string, message: string}>}}
 */
export function validation(dataForm: object) {
    const errors = [];

    for (const [type, data] of Object.entries(dataForm)) {
        if (type == "email") {
            if (!data) {
                errors.push({ field: "email", message: "Поле почты обязательно" });
            } else {
                const regex = /^[a-zA-Z0-9._-]+@smail.ru/gm;
                if (!regex.test(data)) {
                    errors.push({
                        field: "email",
                        message: "Почта должна быть вида *@smail.ru",
                    });
                }
                if (data.length > 75) {
                    errors.push({ field: "email", message: "Почта должна быть не более 40 символов" });
                }
            }
        }

        if (type == "password") {
            if (!data) {
                errors.push({ field: "password", message: "Поле пароля обязательно" });
            } else {
                if (data.length < 8) {
                    errors.push({
                        field: "password",
                        message: "Пароль должен быть не менее 8 символов",
                    });
                }
            }
        }

        if (type == "oldPassword") {
            if (!data) {
                errors.push({ field: "oldPassword", message: "Поле пароля обязательно" });
            } else {
                if (data.length < 8) {
                    errors.push({
                        field: "oldPassword",
                        message: "Пароль должен быть не менее 8 символов",
                    });
                }
            }
        }

        if (type == "newPassword") {
            if (!data) {
                errors.push({ field: "newPassword", message: "Поле пароля обязательно" });
            } else {
                if (data.length < 8) {
                    errors.push({
                        field: "newPassword",
                        message: "Пароль должен быть не менее 8 символов",
                    });
                }
            }
        }

        if (type == "name") {
            if (!data) {
                errors.push({ field: "name", message: "Поле имя обязательно" });
            } else {
                const regexForName = /^[a-zA-Zа-яА-Я-]+$/gm;
                if (!regexForName.test(data)) {
                    errors.push({
                        field: "name",
                        message: "Имя должно состоять только из букв",
                    });
                }
            }
        }

        if (type == "surname") {
            if (!data) {
                errors.push({ field: "surname", message: "Поле фамилия обязательно" });
            } else {
                const regexForSurname = /^[a-zA-Zа-яА-Я-]+$/gm;
                if (!regexForSurname.test(data)) {
                    errors.push({
                        field: "surname",
                        message: "Фамилия должно состоять только из букв",
                    });
                }
            }
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors,
    };
}
