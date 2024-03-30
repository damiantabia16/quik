import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getBoards, createBoard, getBoard, updateBoard, deleteBoard } from '../controllers/boards.controller.js';
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createBoardSchema } from "../schemas/board.schema.js";

const router = Router();

router.get('/tableros', getBoards);
router.get('/tableros/:id', authRequired, getBoard);
router.post('/tableros', authRequired, validateSchema(createBoardSchema), createBoard);
router.put('/tableros/:id', authRequired, updateBoard);
router.delete('/tableros/:id', authRequired, deleteBoard);

export default router;