import db from "../db.js";
import bcrypt from 'bcryptjs';
import { createAccessToken, createRefreshToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const checkUser = 'SELECT * FROM users WHERE username = ?';
        db.query(checkUser, [username], async (checkUserErr, checkUserResult) => {
            if (checkUserErr) {
                console.error('Error al verificar el usuario existente:', checkUserErr);
                return res.status(500).send('Error al registrar el usuario');
            } else if (checkUserResult.length > 0) {
                return res.status(400).json(['El usuario ya está en uso']);
            } else {
                const hashPassword = await bcrypt.hash(password, 10);

                const insert = 'INSERT INTO users (username, password) VALUES (?, ?)';
                db.query(insert, [username, hashPassword], async (err, result) => {
                    if (err) {
                        console.error('Error al registrar el usuario:', err);
                        return res.status(500).send('Error al registrar el usuario');
                    } else {
                        const userId = result.insertId;
                        const token = await createAccessToken({ id: userId });
                        const refreshToken = await createRefreshToken({ id: userId });
                        res.cookie('token', token, { sameSite: 'none', secure: true });
                        res.cookie('refreshToken', refreshToken, { sameSite: 'none', secure: true });
                        res.json({
                            id: userId,
                            username
                        });
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ 'message': error.message });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const query = "SELECT * FROM users WHERE username = ?";
        db.query(query, [username], async (err, result) => {
            if (err) {
                console.error('Error al ejecutar la consulta:', err);
                return res.status(500).json({ message: 'Error al iniciar sesión' });
            } else {
                const user = result[0];

                if (!user) {
                    return res.status(404).json(['El usuario no existe']);
                }

                const match = await bcrypt.compare(password, user.password);

                if (match) {
                    const userId = user.id;
                    const token = await createAccessToken({ id: userId });
                    const refreshToken = await createRefreshToken({ id: userId });
                    res.cookie('token', token, { sameSite: 'none', secure: true });
                    res.cookie('refreshToken', refreshToken, { sameSite: 'none', secure: true });
                    res.json({
                        id: userId,
                        username: user.username
                    });
                } else if (!match) {
                    return res.status(400).json(['La contraseña no es valida'])
                } else {
                    res.status(401).json(['Credenciales invalidas']);
                }
            }
        });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};

export const logout = (req, res) => {
    res.cookie('token', '', { expires: new Date(0) });
    return res.sendStatus(200);
};

export const profile = async (req, res) => {
    const userId = await req.user.id;

    try {
        const query = "SELECT * FROM users WHERE id = ?";
        db.query(query, [userId], (err, result) => {
            if (err) {
                console.error('Error al obtener el perfil del usuario:', err);
                return res.status(500).json({ message: 'Error al obtener el perfil del usuario' });
            } else {
                const [user] = result;

                if (!user) {
                    return res.status(404).json({ message: 'Usuario no encontrado' });
                }

                res.json({
                    id: user.id,
                    username: user.username
                });
            }
        });
    } catch (error) {
        console.error('Error inesperado:', error);
        res.status(500).json({ message: 'Error inesperado' });
    }
};

export const verifyToken = async (req, res) => {
    const { token } = req.cookies;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.TOKEN_SECRET, async (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!user.id) {
            return res.status(401).json({ message: 'User not found in token' });
        }

        const userId = user.id;

        try {
            const query = "SELECT * FROM users WHERE id = ?";
            db.query(query, [userId], (err, result) => {
                if (err) {
                    console.error('Error querying user data:', err);
                    return res.status(500).json({ message: 'Error querying user data' });
                } else {
                    const user = result[0];
                    if (!user) {
                        return res.status(404).json({ message: 'User not found' });
                    }
                    res.json({
                        id: user.id,
                        username: user.username
                    });
                }
            });
        } catch (error) {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'Unexpected error' });
        }
    });
};

export const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }
            const accessToken = createAccessToken({ id: user.id });
            res.json({ accessToken });
        });
    } catch (error) {
        console.error('Error refreshing access token:', error);
        res.status(500).json({ message: 'Error refreshing access token' });
    }
};