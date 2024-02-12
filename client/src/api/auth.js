import axios from './axios.js';

export const registerRequest = (user) => axios.post(`/registrarse`, user);

export const loginRequest = (user) => axios.post(`/ingresar`, user);

export const verifyTokenRequest = () => axios.get('/verificar');