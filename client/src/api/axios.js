import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');

const instance = axios.create({
    baseURL: "https://quik-server.vercel.app/api",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
});

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const res = await axios.post('/auth/refresh-token');
                instance.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
                return instance(originalRequest);
            } catch (refreshError) {
                throw refreshError;
            }
        }
        return Promise.reject(error);
    }
);

export default instance;