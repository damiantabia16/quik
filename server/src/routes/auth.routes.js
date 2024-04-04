import { Router } from "express";
import { register, login, logout, profile, verifyToken } from '../controllers/auth.controller.js';
import { authRequired } from "../middlewares/validateToken.js";
import { validateSchema } from '../middlewares/validator.middleware.js';
import { registerSchema, loginSchema } from "../schemas/auth.schema.js";

const router = Router();

router.post('/registrarse', validateSchema(registerSchema), register);
router.post('/ingresar', validateSchema(loginSchema), login);
router.post('/desconectarse', logout);
router.get('/verificar', verifyToken);
router.get('/perfil', authRequired, profile);

export default router;