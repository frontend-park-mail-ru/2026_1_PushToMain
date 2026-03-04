
/**
 * Возвращает URL API в зависимости от окружения.
 * Если код запущен в браузере, возвращается URL API с учётом текущего домена.
 * Если код запущен в Node.js, проверяется переменная окружения API_URL.
 * В противном случае возвращается URL API по умолчанию.
 *
 * @returns {string} API URL
 */
export const getApiUrl = () => {
    if (typeof window !== 'undefined') {
        return `${window.location.origin}/api`;
    }
    if (typeof process !== 'undefined' && process.env?.API_URL) {
        return process.env.API_URL;
    }
    return 'http://localhost:8000/api';
};
