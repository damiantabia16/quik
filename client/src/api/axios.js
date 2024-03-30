import axios from 'axios';
import Cookies from 'js-cookie';

const cookies = Cookies.get();

const instance = axios.create({
    baseURL: "https://quik-server.vercel.app/api",
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cookies.token
    }
});

export default instance;