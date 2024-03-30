import axios from './axios.js';

export const getBoardsRequest = () => axios.get('/boards/tableros');

export const getBoardRequest = (id) => axios.get(`/boards/tableros/${id}`);

export const createBoardRequest = (board) => axios.post('/boards/tableros', board);

export const updateBoardRequest = (board) => axios.put(`/boards/tableros/${board.id}`, board);

export const deleteBoardRequest = (id) => axios.delete(`/boards/tableros/${id}`);
