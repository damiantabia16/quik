import { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useBoard } from "../../hooks/useBoard";
import { useNote } from "../../hooks/useNote";
import NotesNav from "./navigate/NotesNav";
import Notes from "./content/grid/Notes";
import CreateNote from "./content/ui-elements/create-note/CreateNote";
import Message from "./content/ui-elements/popup-message/Message";
import Reminder from "./content/ui-elements/reminder/Reminder";
import ColorPicker from "./content/ui-elements/color-picker/ColorPicker";
import ConfirmDelete from "./content/ui-elements/confirm-delete/ConfirmDelete";
import { options } from "./content/options";
import { Tooltip } from 'react-tooltip';
import { MdClose } from "react-icons/md";
import './notes.css';

function Grid({
    boardId,
    boardName,
    isMounted,
    setIsMounted,
    createNoteForm,
    setCreateNoteForm,
    toggleCreateNote,
    placeholder,
    setPlaceholder,
    selectedColor,
    setSelectedColor,
    isArchived,
    setIsArchived,
    selectedNotes,
    setSelectedNotes,
    selectedNote,
    setSelectedNote,
    handleSelectAll,
    allSelected,
    resetValues,
    message,
    setMessage,
    pathname
}) {

    const isInNotes = pathname.includes('/notas');

    return (
        <>
            <Notes
                boardId={boardId}
                boardName={boardName}
                message={message}
                setMessage={setMessage}
                selectedNotes={selectedNotes}
                setSelectedNotes={setSelectedNotes}
                selectedNote={selectedNote}
                setSelectedNote={setSelectedNote}
                handleSelectAll={handleSelectAll}
                allSelected={allSelected} />
            {isInNotes && <CreateNote
                boardId={boardId}
                isMounted={isMounted}
                setIsMounted={setIsMounted}
                createNoteForm={createNoteForm}
                setCreateNoteForm={setCreateNoteForm}
                toggleCreateNote={toggleCreateNote}
                placeholder={placeholder}
                setPlaceholder={setPlaceholder}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                isArchived={isArchived}
                setIsArchived={setIsArchived}
                resetValues={resetValues} />}
            {isInNotes && <div role="button" onClick={toggleCreateNote} className={`add-note-button ${isMounted ? 'active' : ''}`}>+</div>}
        </>
    )
}

function Container() {

    const { getBoard } = useBoard();

    const { pathname } = useLocation();

    const params = useParams();

    const { notes, getNote, getNotes, updateNote, archiveNote, unarchiveNote, sendNoteToBin, deleteNote, restoreNote } = useNote();

    const selector = useRef();

    const [boardId, setBoardId] = useState(null);
    const [boardName, setBoardName] = useState(null);
    const [backgroundType, setBackgroundType] = useState(null);
    const [backgroundValue, setBackgroundValue] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [createNoteForm, setCreateNoteForm] = useState(false);
    const [placeholder, setPlaceholder] = useState(true);
    const [selectedColor, setSelectedColor] = useState('#eee');
    const [isArchived, setIsArchived] = useState(false);
    const [message, setMessage] = useState('');
    const [undoPerformed, setUndoPerformed] = useState(false);
    const [selectedNotes, setSelectedNotes] = useState([]);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [allSelected, setAllSelected] = useState(false);

    useEffect(() => {
        const loadBoard = async () => {
            if (params.id) {
                const board = await getBoard(params.id);
                setBoardId(board.id);
                setBoardName(board.board_name);
                setBackgroundType(board.background_type);
                setBackgroundValue(board.background_value);
            }
        }

        loadBoard();
    }, [params.id]);

    const containerStyle = {
        backgroundImage: backgroundType === 'image' ? `url(${backgroundValue})` : 'none',
        backgroundColor: backgroundType === 'color' ? backgroundValue : 'transparent',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    };

    const resetValues = () => {
        setIsMounted(false);
        setPlaceholder(true);
        setSelectedColor('#eee');
    };

    const toggleCreateNote = () => {
        setIsMounted(true);
        if (isMounted) {
            resetValues();
        }
    };

    const handleSelectAll = () => {
        let notesToSelect = [];
        if (pathname.includes('/notas')) {
            notesToSelect = notes.filter(note => !note.is_archived && !note.in_bin);
        } else if (pathname.includes('/recordatorios')) {
            notesToSelect = notes.filter(note => note.reminder && !note.in_bin);
        } else if (pathname.includes('/archivos')) {
            notesToSelect = notes.filter(note => note.is_archived && !note.in_bin);
        } else if (pathname.includes('/papelera')) {
            notesToSelect = notes.filter(note => note.in_bin);
        }
        setSelectedNotes(notesToSelect.map(note => note.id));
        setAllSelected(true);
    };

    const handleArchiveNote = async (noteId) => {
        try {
            await archiveNote(boardId, { id: noteId });
            getNotes(boardId);
        } catch (error) {
            console.error('Error al archivar la nota:', error);
        }
    };

    const handleUnarchiveNote = async (noteId) => {
        try {
            await unarchiveNote(boardId, { id: noteId });
            getNotes(boardId);
        } catch (error) {
            console.error('Error al archivar la nota:', error);
        }
    };

    const handleSendNoteToBin = async (noteId) => {
        try {
            await sendNoteToBin(boardId, { id: noteId });
            getNotes(boardId);
        } catch (error) {
            console.error('Error al archivar la nota:', error);
        }
    };

    const handleDeleteNote = async (noteId) => {
        try {
            await deleteNote(boardId, { id: noteId });
            getNotes(boardId);
        } catch (error) {
            console.error('Error al eliminar definitivamente la nota:', error);
        }
    };

    const handleRestoreNote = async (noteId) => {
        try {
            await restoreNote(boardId, { id: noteId });
            getNotes(boardId);
        } catch (error) {
            console.error('Error al restaurar la nota:', error);
        }
    };

    const handleConfirmDelete = () => {
        setMessage(selectedNotes.length > 1 ? 'Notas eliminadas' : 'Nota eliminada');
        setTimeout(() => {
            setMessage('');
        }, 7000);
        selectedNotes.forEach(noteId => {
            setTimeout(() => {
                handleDeleteNote(noteId);
            }, 200);
        });
        setSelectedNotes([]);
        setAllSelected(false);
        setConfirmDelete(false);
    };

    const handleCancelDelete = () => {
        setConfirmDelete(false)
    }

    const handleButtons = (optionId) => {
        {
            selectedNotes.forEach(noteId => {
                if (optionId === 3) {
                    setMessage(selectedNotes.length > 1 ? 'Notas archivadas' : 'Nota archivada');
                    setTimeout(() => {
                        setMessage('');
                    }, 7000);
                    setTimeout(() => {
                        handleArchiveNote(noteId);
                    }, 200);
                    setSelectedNotes([]);
                    setAllSelected(false);
                } else if (optionId === 4) {
                    setMessage(selectedNotes.length > 1 ? 'Notas desarchivadas' : 'Nota desarchivada');
                    setTimeout(() => {
                        setMessage('');
                    }, 7000);
                    setTimeout(() => {
                        handleUnarchiveNote(noteId);
                    }, 200);
                    setSelectedNotes([]);
                    setAllSelected(false);
                } else if (optionId === 7) {
                    setMessage(selectedNotes.length > 1 ? 'Notas enviadas a la papelera' : 'Nota enviada a la papelera');
                    setTimeout(() => {
                        setMessage('');
                    }, 7000);
                    setTimeout(() => {
                        handleSendNoteToBin(noteId);
                    }, 200);
                    setSelectedNotes([]);
                    setAllSelected(false);
                } else if (optionId === 8) {
                    setConfirmDelete(true);
                } else if (optionId === 9) {
                    setMessage(selectedNotes.length > 1 ? 'Notas restauradas' : 'Nota restaurada');
                    setTimeout(() => {
                        setMessage('');
                    }, 7000);
                    setTimeout(() => {
                        handleRestoreNote(noteId);
                    }, 200);
                    setSelectedNotes([]);
                    setAllSelected(false);
                }
            })
        }
    }

    return (
        <div className="notes-container">
            <div className="notes-board-background" style={containerStyle} />
            <div ref={selector} className={`selected-notes-options ${selectedNotes.length > 0 ? 'hide' : 'display'}`}>
                <div onClick={() => { setSelectedNotes([]); setAllSelected(false) }} role="button" className="close-selected-notes-options">
                    <MdClose />
                </div>
                <span className="selected-notes-amount">{selectedNotes.length}</span>
                <div
                    role="button"
                    onClick={handleSelectAll}
                    className="select-all">
                    SELECCIONAR TODO
                </div>
                <div role="toolbar" id="selected-notes-toolbar" className="selected-notes-toolbar">
                    {options.map(option => {
                        if (pathname.includes('/notas')) {
                            if ([3, 7].includes(option.id)) {
                                return (
                                    <div
                                        role='button'
                                        data-option-id={option.id}
                                        key={option.id}
                                        data-tooltip-id='selected-notes-option-tooltip'
                                        data-tooltip-content={option.alt}
                                        onClick={() => handleButtons(option.id)}
                                        className='selected-notes-toolbar-option'
                                    >
                                        {option.icon.default}
                                    </div>
                                );
                            }
                        } else if (pathname.includes('/recordatorios')) {
                            if ([3, 7].includes(option.id)) {
                                return (
                                    <div
                                        role='button'
                                        data-option-id={option.id}
                                        key={option.id}
                                        data-tooltip-id='selected-notes-option-tooltip'
                                        data-tooltip-content={option.alt}
                                        className='selected-notes-toolbar-option'
                                    >
                                        {option.icon.default}
                                    </div>
                                );
                            }
                        } else if (pathname.includes('/archivos')) {
                            if ([4, 7].includes(option.id)) {
                                return (
                                    <div
                                        role='button'
                                        data-option-id={option.id}
                                        key={option.id}
                                        data-tooltip-id='selected-notes-option-tooltip'
                                        data-tooltip-content={option.alt}
                                        onClick={() => handleButtons(option.id)}
                                        className='selected-notes-toolbar-option'
                                    >
                                        {option.icon.default}
                                    </div>
                                );
                            }
                        } else if (pathname.includes('/papelera')) {
                            if ([8, 9].includes(option.id)) {
                                return (
                                    <div
                                        role='button'
                                        data-option-id={option.id}
                                        key={option.id}
                                        data-tooltip-id='selected-notes-option-tooltip'
                                        data-tooltip-content={option.alt}
                                        onClick={() => handleButtons(option.id)}
                                        className='selected-notes-toolbar-option'
                                    >
                                        {option.icon.default}
                                    </div>
                                );
                            }
                        }
                        return null;
                    })}
                    <Tooltip id='selected-notes-option-tooltip' effect="solid" place="bottom" />
                </div>
            </div>
            <ConfirmDelete
                confirmDelete={confirmDelete}
                handleConfirmDelete={handleConfirmDelete}
                handleCancelDelete={handleCancelDelete} />
            <NotesNav boardId={boardId} />
            <Grid
                boardId={boardId}
                boardName={boardName}
                isMounted={isMounted}
                setIsMounted={setIsMounted}
                createNoteForm={createNoteForm}
                setCreateNoteForm={setCreateNoteForm}
                toggleCreateNote={toggleCreateNote}
                placeholder={placeholder}
                setPlaceholder={setPlaceholder}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedNotes={selectedNotes}
                setSelectedNotes={setSelectedNotes}
                handleSelectAll={handleSelectAll}
                allSelected={allSelected}
                isArchived={isArchived}
                setIsArchived={setIsArchived}
                resetValues={resetValues}
                message={message}
                setMessage={setMessage}
                pathname={pathname} />
            <Message message={message} setMessage={setMessage} undoPerformed={undoPerformed} />
        </div>
    )
}

export default Container