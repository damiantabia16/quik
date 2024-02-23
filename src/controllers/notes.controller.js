import db from "../db.js";

export const getNotes = async (req, res) => {
    const { boardId } = req.params;
    const userId = req.user.id;
    
    try {
        const select = 'SELECT * FROM notes WHERE board_id = ? AND user_id = ?';
        db.query(select, [boardId, userId], (err, result) => {
            if (err) {
                console.error('Error al obtener las notas de la base de datos:', err);
                return res.status(500).json({ message: 'Error al obtener las notas' });
            }
            res.json(result);
        })
    } catch (error) {
        console.error('Error en la función getNotes:', err);
        res.status(500).send('Error interno del servidor');
    }
};

export const createNote = async (req, res) => {
    const { boardId } = req.params;
    const { note_title, note_content } = req.body;
    const userId = req.user.id;

    try {
        const insert = 'INSERT INTO notes (note_title, note_content, board_id, user_id) VALUES (?, ?, ?, ?)';
        db.query(insert, [note_title, note_content, boardId, userId], (err, result) => {
            if (err) {
                console.error('Error al insertar en la base de datos:', err);
                return res.status(500).json({ message: 'Error al insertar en la base de datos:' });
            }
            res.json({
                note_title,
                note_content,
                board_id: boardId,
                user_id: userId
            })
        })
    } catch (error) {
        console.error('Error en la función createNote:', err);
        res.status(500).json({ 'message': err.message });
    }
};

export const getNote = async (req, res) => {
    const { boardId, noteId } = req.params;
    const userId = req.user.id;

    try {
        const query = 'SELECT * FROM notes WHERE id = ? AND board_id = ? AND user_id = ?';
        db.query(query, [noteId, boardId, userId], async (err, result) => {
            if (err) {
                console.error('Error al obtener la nota', err);
                return res.status(500).json({ message: 'Error al obtener la nota' });
            }

            if (!result || result.length === 0) {
                return res.status(404).json({ message: 'Nota no encontrada' });
            }

            const [note] = result;

            res.json({
                id: note.id,
                note_title: note.note_title,
                note_content: note.note_content,
                board_id: note.board_id,
                user_id: note.user_id
            });
        })
    } catch (error) {
        console.error('Error en la función getNote:', err);
        res.status(500).json({ message: 'Error inesperado' });
    }
};

export const updateNote = async (req, res) => {
    const { boardId, noteId } = req.params;
    const { note_title, note_content } = req.body;
    const userId = req.user.id;

    try {
        const query = 'UPDATE notes SET note_title = ?, note_content = ? WHERE id = ? AND board_id = ? AND user_id = ?';
        db.query(query, [note_title, note_content, noteId, boardId, userId], async (err, result) => {
            if (err) {
                console.error('Error al actualizar la nota:', err);
                return res.status(500).json({ message: 'Error al actualizar la nota' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Nota no encontrada o no permitida' });
            }

            const updatedNote = {
                id: noteId,
                note_title,
                note_content,
                board_id: boardId,
                user_id: userId
            };

            res.json(updatedNote);
        })
    } catch (error) {
        console.error('Error en la función updateNote:', err);
        res.status(500).json({ message: 'Error en la función updateNote' });
    }
};

export const deleteNote = async (req, res) => {
    const { boardId, noteId } = req.params;
    const userId = req.user.id;

    try {
        const query = 'DELETE FROM notes WHERE id = ? AND board_id = ? AND user_id = ?';
        db.query(query, [noteId, boardId, userId], async (err, result) => {
            if (err) {
                console.error('Error al eliminar la nota:', err);
                return res.status(500).json({ message: 'Error al eliminar la nota' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Nota no encontrada o no permitida' });
            }

            return res.sendStatus(204);
        })
    } catch (error) {
        console.error('Error en la función deleteNote:', err);
        return res.status(500).json({ message: 'Error en la función deleteNote' });
    }
}