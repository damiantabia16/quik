import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import boardsRoutes from './routes/boards.routes.js';
import notesRoutes from './routes/notes.routes.js';

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/boards", boardsRoutes);
app.use("/api/notes", notesRoutes);

app.get("/", (req, res) => {
    res.json("El servidor está funcionando correctamente.");
})

app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

export default app;