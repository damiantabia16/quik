import axios from 'axios';
import { API_URL } from '../config';

const instance = axios.create({
    baseURL: "https://quik-server.vercel.app/api",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default instance;