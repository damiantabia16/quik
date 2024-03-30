import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
    baseURL: "https://quik-server.vercel.app/api",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

instance.interceptors.request.use(config => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const res = await instance.post('/auth/refresh-token');
                const newToken = res.data.accessToken;
                Cookies.set('token', newToken); // Actualiza el token en las cookies
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return instance(originalRequest);
            } catch (refreshError) {
                throw refreshError;
            }
        }
        return Promise.reject(error);
    }
);

export default instance;