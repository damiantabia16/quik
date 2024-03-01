import { createContext, useState } from "react";
import { createNoteRequest, getNotesRequest, getNoteRequest, updateNoteRequest, setReminderRequest, archiveNoteRequest, unarchiveNoteRequest, sendNoteToBinRequest, restoreNoteRequest, deleteReminderRequest, deleteNoteRequest } from "../api/notes";

export const NoteContext = createContext();

export const NoteProvider = ({ children }) => {

    const [notes, setNotes] = useState([]);
    const [note, setNote] = useState(null);

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

    const setReminder = async (boardId, note, reminder) => {
        try {
            const res = await setReminderRequest(boardId, note, reminder);
            setNote(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteReminder = async (boardId, note) => {
        try {
            const res = await deleteReminderRequest(boardId, note);
            setNote(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const archiveNote = async (boardId, note) => {
        try {
            await archiveNoteRequest(boardId, note);
        } catch (error) {
            console.error(error);
        }
    };

    const unarchiveNote = async (boardId, note) => {
        try {
            await unarchiveNoteRequest(boardId, note);
        } catch (error) {
            console.error(error);
        }
    };

    const sendNoteToBin = async (boardId, note) => {
        try {
            const res = await sendNoteToBinRequest(boardId, note);
            setNote(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const restoreNote = async (boardId, note) => {
        try {
            const res = await restoreNoteRequest(boardId, note);
            setNote(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const deleteNote = async (boardId, note) => {
        try {
            const res = await deleteNoteRequest(boardId, note);
            return res.data;
        } catch (error) {
            console.log(error);
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
        updateNote,
        setReminder,
        deleteReminder,
        archiveNote,
        unarchiveNote,
        sendNoteToBin,
        restoreNote,
        deleteNote
    };

    return (
        <NoteContext.Provider value={exports}>
            {children}
        </NoteContext.Provider>
    )
}