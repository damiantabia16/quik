import axios from './axios.js';

export const getBoardsRequest = () => axios.get('/tableros');

export const getBoardRequest = (id) => axios.get(`/tableros/${id}`);

export const createBoardRequest = (board) => axios.post('/tableros', board);

export const updateBoardRequest = (board) => axios.put(`/tableros/${board.id}`, board);

export const deleteBoardRequest = (id) => axios.delete(`/tableros/${id}`);
