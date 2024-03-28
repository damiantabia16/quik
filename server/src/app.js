import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import boardsRoutes from './routes/boards.routes.js';
import notesRoutes from './routes/notes.routes.js';
import { FRONTEND_URL } from './config.js';

const app = express();

app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", boardsRoutes);
app.use("/api", notesRoutes);

app.get("/", (req, res) => {
    res.json("El servidor está funcionando correctamente.");
})

export default app;