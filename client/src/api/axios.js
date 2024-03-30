import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('authToken');

const instance = axios.create({
    baseURL: "https://quik-server.vercel.app/api",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    }
});

export default instance;