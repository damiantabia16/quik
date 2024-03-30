import axios from './axios.js';

export const registerRequest = (user) => axios.post(`/auth/registrarse`, user);

export const loginRequest = (user) => axios.post(`/auth/ingresar`, user);

export const verifyTokenRequest = () => axios.get('/auth/verificar');