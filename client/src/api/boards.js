import axios from './axios.js';
import Cookies from 'js-cookie';

const cookies = Cookies.get();

export const getBoardsRequest = () => axios.get('/tableros', {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + cookies.token
    }});

export const getBoardRequest = (id) => axios.get(`/tableros/${id}`);

export const createBoardRequest = (board) => axios.post('/tableros', board);

export const updateBoardRequest = (board) => axios.put(`/tableros/${board.id}`, board);

export const deleteBoardRequest = (id) => axios.delete(`/tableros/${id}`);
