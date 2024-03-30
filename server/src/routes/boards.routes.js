import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getBoards, createBoard, getBoard, updateBoard, deleteBoard } from '../controllers/boards.controller.js';
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createBoardSchema } from "../schemas/board.schema.js";

const router = Router();

router.get('/tableros', getBoards);
router.get('/tableros/:id', getBoard);
router.post('/tableros', validateSchema(createBoardSchema), createBoard);
router.put('/tableros/:id', updateBoard);
router.delete('/tableros/:id', deleteBoard);

export default router;