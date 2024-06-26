import axios from "./axios.js";

export const getNotesRequest = (boardId) => axios.get(`/notes/tableros/${boardId}/notas`);

export const getNoteRequest = (boardId, id) => axios.get(`/notes/tableros/${boardId}/notas/${id}`);

export const createNoteRequest = (boardId, note) => axios.post(`/notes/tableros/${boardId}/notas`, note);

export const updateNoteRequest = (boardId, note) => axios.put(`/notes/tableros/${boardId}/notas/${note.id}`, note);

export const setReminderRequest = (boardId, note) => axios.put(`/notes/tableros/${boardId}/notas/${note.id}/recordatorio`, note);

export const archiveNoteRequest = (boardId, note) => axios.put(`/notes/tableros/${boardId}/notas/${note.id}/archivar`, note);

export const unarchiveNoteRequest = (boardId, note) => axios.put(`/notes/tableros/${boardId}/notas/${note.id}/desarchivar`, note);

export const sendNoteToBinRequest = (boardId, note) => axios.put(`/notes/tableros/${boardId}/notas/${note.id}/eliminar`, note);

export const restoreNoteRequest = (boardId, note) => axios.put(`/notes/tableros/${boardId}/notas/${note.id}/restaurar`, note);

export const deleteReminderRequest = (boardId, note) => axios.delete(`/notes/tableros/${boardId}/notas/${note.id}/recordatorio`, note);

export const deleteNoteRequest = (boardId, note) => axios.delete(`/notes/tableros/${boardId}/notas/${note.id}`, note);