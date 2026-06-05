/**
 * Проверяет поля формы на валидность
 * @param {Object} dataForm - Объект с полями формы
 * @returns {{isValid: boolean, errors: Array<{field: string, message: string}>}}
 */

export function validation(dataForm: object, t: (_key: string) => string) {
  const errors = [];

  for (const [type, data] of Object.entries(dataForm)) {
    if (type == "email") {
      if (!data || data === "@e-smail.ru") {
        errors.push({ field: "email", message: t("email_required") });
      } else {
        const regex = /^[a-zA-Z0-9._-]+@e-smail.ru/gm;
        if (!regex.test(data)) {
          errors.push({
            field: "email",
            message: t("email_invalid_format"),
          });
        }
        if (data.length > 40) {
          errors.push({ field: "email", message: t("email_max_length") });
        }
      }
    }

    if (type == "password") {
      if (!data) {
        errors.push({ field: "password", message: t("password_required") });
      } else {
        if (data.length < 8) {
          errors.push({
            field: "password",
            message: t("password_min_length"),
          });
        } else if (data.length > 20) {
          errors.push({
            field: "password",
            message: t("password_max_length"),
          });
        }
      }
    }

    if (type == "oldPassword") {
      if (!data) {
        errors.push({ field: "oldPassword", message: t("password_required") });
      } else {
        if (data.length < 8) {
          errors.push({
            field: "oldPassword",
            message: t("password_min_length"),
          });
        } else if (data.length > 20) {
          errors.push({
            field: "oldPassword",
            message: t("password_max_length"),
          });
        }
      }
    }

    if (type == "newPassword") {
      if (!data) {
        errors.push({ field: "newPassword", message: t("password_required") });
      } else {
        if (data.length < 8) {
          errors.push({
            field: "newPassword",
            message: t("password_min_length"),
          });
        } else if (data.length > 20) {
          errors.push({
            field: "newPassword",
            message: t("password_max_length"),
          });
        }
      }
    }

    if (type == "name") {
      if (!data) {
        errors.push({ field: "name", message: t("name_required") });
      } else {
        const regexForName = /^[a-zA-Zа-яА-Я-]+$/gm;
        if (!regexForName.test(data)) {
          errors.push({
            field: "name",
            message: t("name_only_letters"),
          });
        }
      }
    }

    if (type == "surname") {
      if (!data) {
        errors.push({ field: "surname", message: t("surname_required") });
      } else {
        const regexForSurname = /^[a-zA-Zа-яА-Я-]+$/gm;
        if (!regexForSurname.test(data)) {
          errors.push({
            field: "surname",
            message: t("surname_only_letters"),
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
