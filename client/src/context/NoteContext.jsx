import { createContext, useState } from "react";
import { createNoteRequest, getNotesRequest, getNoteRequest, updateNoteRequest } from "../api/notes";

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {

    const [ notes, setNotes ] = useState([]);
    const [ note, setNote ] = useState(null);

    const createNote = async (boardId, note) => {
        const res = await createNoteRequest(boardId, note);
    };

    const getNotes = async (boardId) => {
        try {
            const res = await getNotesRequest(boardId);
            setNotes(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getNote = async (boardId, id) => {
        try {
            const res = await getNoteRequest(boardId, id);
            setNote(res.data);
        } catch (error) {
            console.error(error)
        }
    };

    const updateNote = async (boardId, note) => {
        try {
            const res = await updateNoteRequest(boardId, note);
            setNote(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const exports = {
        notes,
        setNotes,
        note,
        setNote,
        createNote,
        getNotes,
        getNote,
        updateNote
    };

    return (
        <NoteContext.Provider value={exports}>
            {children}
        </NoteContext.Provider>
    )
}