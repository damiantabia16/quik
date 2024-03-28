import db from "../db.js";

export const getBoards = async (req, res) => {
    const user_id = req.user.id;

    try {
        const select = 'SELECT * FROM boards WHERE user_id = ?';
        db.query(select, [user_id], (err, result) => {
            if (err) {
                console.error('Error al obtener los tableros de la base de datos:', err);
                return res.status(500).json({ message: 'Error al obtener el tablero' });
            }
            res.json(result);
        })
    } catch (err) {
        console.error('Error en la función getBoards:', err);
        res.status(500).send('Error interno del servidor');
    }
};

export const createBoard = async (req, res) => {
    const { board_name, background_type, background_value } = req.body;
    const user_id = req.user.id;

    try {
        const insert = 'INSERT INTO boards (board_name, background_type, background_value, user_id) VALUES (?, ?, ?, ?)'
        db.query(insert, [board_name, background_type, background_value, user_id], async (err, result) => {
            if (err) {
                console.error('Error al insertar en la base de datos:', err);
                res.status(500).send('Error al insertar en la base de datos:');
            }
            res.json({
                board_name,
                background_type,
                background_value,
                user_id
            })
        })
    } catch (err) {
        console.error('Error en la función createBoard:', err);
        res.status(500).json({ 'message': err.message });
    }
};

export const getBoard = async (req, res) => {
    const boardId = req.params.id;
    const user_id = req.user.id;

    try {
        const query = 'SELECT * FROM boards WHERE id = ? AND user_id = ?';
        db.query(query, [boardId, user_id], async (err, result) => {
            if (err) {
                console.error('Error al obtener el tablero', err);
                return res.status(500).json({ message: 'Error al obtener el tablero' });
            }

            if (!result || result.length === 0) {
                return res.status(404).json({ message: 'Tablero no encontrado' });
            }

            const [board] = result;

            res.json({
                id: board.id,
                board_name: board.board_name,
                background_type: board.background_type,
                background_value: board.background_value,
                user_id: board.user_id
            });
        })
    } catch (err) {
        console.error('Error en la función getBoard:', err);
        res.status(500).json({ message: 'Error inesperado' });
    }
};

export const updateBoard = async (req, res) => {
    const boardId = req.params.id;
    const { board_name, background_type, background_value } = req.body;
    const user_id = req.user.id;

    try {
        const query = 'UPDATE boards SET board_name = ?, background_type = ?, background_value = ? WHERE id = ? AND user_id = ?';
        db.query(query, [board_name, background_type, background_value, boardId, user_id], async (err, result) => {
            if (err) {
                console.error('Error al actualizar el tablero:', err);
                return res.status(500).json({ message: 'Error al actualizar el tablero' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Tablero no encontrado o no permitido' });
            }

            const updatedBoard = {
                id: boardId,
                board_name: board_name,
                background_type: background_type,
                background_value: background_value,
                user_id: user_id
            };

            res.json(updatedBoard);
        })
    } catch (err) {
        console.error('Error en la función updateBoard:', err);
        res.status(500).json({ message: 'Error en la función updateBoard' });
    }
};

export const deleteBoard = async (req, res) => {
    const boardId = req.params.id;
    const user_id = req.user.id;

    try {
        const query = 'DELETE FROM boards WHERE id = ? AND user_id = ?';
        db.query(query, [boardId, user_id], async (err, result) => {
            if (err) {
                console.error('Error al eliminar el tablero:', err);
                return res.status(500).json({ message: 'Error al eliminar el tablero' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Tablero no encontrado o no permitido' });
            }

            return res.sendStatus(204);
        })
    } catch (err) {
        console.error('Error en la función deleteBoard:', err);
        return res.status(500).json({ message: 'Error en la función deleteBoard' });
    }
};