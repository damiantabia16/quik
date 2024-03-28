import axios from 'axios';
import { API_URL } from '../config';

const instance = axios.create({
    baseURL: "http://localhost:4000/api" || "https://quik-server.vercel.app/",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default instance;