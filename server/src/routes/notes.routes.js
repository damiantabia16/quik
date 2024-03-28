import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getNotes, createNote, getNote, updateNote, setReminder, deleteReminder, archiveNote, unarchiveNote, sendNoteToBin, restoreNote, deleteNote } from '../controllers/notes.controller.js';

const router = Router();

router.get('/tableros/:boardId/notas', authRequired, getNotes);
router.get('/tableros/:boardId/notas/:noteId', authRequired, getNote);
router.post('/tableros/:boardId/notas',authRequired, createNote);
router.put('/tableros/:boardId/notas/:noteId', authRequired, updateNote);
router.put('/tableros/:boardId/notas/:noteId/recordatorio', authRequired, setReminder);
router.put('/tableros/:boardId/notas/:noteId/archivar', authRequired, archiveNote);
router.put('/tableros/:boardId/notas/:noteId/desarchivar', authRequired, unarchiveNote);
router.put('/tableros/:boardId/notas/:noteId/eliminar', authRequired, sendNoteToBin);
router.put('/tableros/:boardId/notas/:noteId/restaurar', authRequired, restoreNote);
router.delete('/tableros/:boardId/notas/:noteId/recordatorio', authRequired, deleteReminder);
router.delete('/tableros/:boardId/notas/:noteId', authRequired, deleteNote);

export default router;
