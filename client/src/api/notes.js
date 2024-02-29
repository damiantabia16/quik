import axios from "./axios.js";

export const getNotesRequest = (boardId) => axios.get(`/tableros/${boardId}/notas`);

export const getNoteRequest = (boardId, id) => axios.get(`/tableros/${boardId}/notas/${id}`);

export const createNoteRequest = (boardId, note) => axios.post(`/tableros/${boardId}/notas`, note);

export const updateNoteRequest = (boardId, note) => axios.put(`/tableros/${boardId}/notas/${note.id}`, note);

export const archiveNoteRequest = (boardId, note) => axios.put(`/tableros/${boardId}/notas/${note.id}/archivar`, note);

export const unarchiveNoteRequest = (boardId, note) => axios.put(`/tableros/${boardId}/notas/${note.id}/desarchivar`, note);

export const deleteNoteRequest = (boardId, id) => axios.delete(`/tableros/${boardId}/notas/${id}`);