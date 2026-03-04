export const getApiUrl = () => {
    if (typeof window !== 'undefined') {
        return `${window.location.origin}/api`;
    }
    // Safe check for process in Node
    if (typeof process !== 'undefined' && process.env?.API_URL) {
        return process.env.API_URL;
    }
    return 'http://localhost:8000/api';
};
