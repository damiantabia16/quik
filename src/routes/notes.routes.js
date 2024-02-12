import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getNotes, createNote, getNote, updateNote, deleteNote } from '../controllers/notes.controller.js';

const router = Router();

router.get('/tableros/:boardId/notas', authRequired, getNotes);
router.get('/tableros/:boardId/notas/:noteId', authRequired, getNote);
router.post('/tableros/:boardId/notas',authRequired, createNote);
router.put('/tableros/:boardId/notas/:noteId', authRequired, updateNote);
router.delete('/tableros/:boardId/notas/:noteId', authRequired, deleteNote);

export default router;
