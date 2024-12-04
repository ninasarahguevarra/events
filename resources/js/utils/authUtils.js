import axios from "axios";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const setAuth = (token) => {
    localStorage.setItem("authToken", token);
};

export const getAuth = () => {
    return localStorage.getItem("authToken");
};

export const clearAuth = () => {
    localStorage.removeItem("authToken");
};

