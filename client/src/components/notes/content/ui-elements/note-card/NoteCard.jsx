import { useState, useRef, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import { options } from '../../options';
import { useNote } from '../../../../../hooks/useNote';
import './note-card.css';
import Parser from 'html-react-parser';
import Reminder from '../reminder/Reminder';
import ColorPicker from '../color-picker/ColorPicker';
import ConfirmDelete from '../confirm-delete/ConfirmDelete';
import { MdCheckCircle, MdOutlineWatchLater, MdClose } from "react-icons/md";

export default function NoteCard({
    note,
    boardId,
    onDragStart,
    draggedNote,
    setDraggedNote,
    onDrop,
    editNote,
    selectedNotes,
    setSelectedNotes,
    handleArchiveNote,
    handleUnarchiveNote,
    handleSendNoteToBin,
    handleDeleteNote,
    handleRestoreNote,
    setMessage
}) {

    const noteRef = useRef(null);

    const { getNotes, updateNote, deleteReminder } = useNote();

    const [hover, setHover] = useState(false);
    const [dateHover, setDateHover] = useState(false);

    const [selectedNote, setSelectedNote] = useState(false);

    const [isDragging, setIsDragging] = useState(false);

    const [addReminder, setAddReminder] = useState(false);

    const [selectColor, setSelectColor] = useState(false);
    const [pickedColor, setPickedColor] = useState(note.background_color);

    const [isFadingOut, setIsFadingOut] = useState(false);

    const [confirmDelete, setConfirmDelete] = useState(false);

    const truncateText = (text, maxLength) => {
        const truncatedText = text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
        return Parser(truncatedText);
    };

    const formatReminderDate = (reminder) => {
        const reminderDate = new Date(reminder);
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        };
        return reminderDate.toLocaleString('es-ES', options);
    };

    const handleEditNote = (noteId) => {
        if (!window.location.pathname.includes(`/tableros/${boardId}/papelera`)) {
            editNote(noteId);
        }
    };
    const handleConfirmDelete = () => {
        handleDeleteNote(note.id);
    }

    const handleCancelDelete = () => {
        setConfirmDelete(false)
    }

    const handleSelection = () => {
        setSelectedNote(!selectedNote);
        setSelectedNotes(prevSelectedNotes => {
            if (selectedNote) {
                return prevSelectedNotes.filter(id => id !== note.id);
            } else {
                return [...prevSelectedNotes, note.id];
            }
        });
    }

    useEffect(() => {
        if (selectedNotes.length === 0) {
            setSelectedNote(false)
        }
    }, [selectedNotes]);

    const handleButtons = (optionId, noteId) => {
        if (optionId === 1) {
            if (addReminder) {
                setAddReminder(false);
            } else {
                setAddReminder(true);
            }
        } else if (optionId === 2) {
            if (selectColor) {
                setSelectColor(false);
            } else {
                setSelectColor(true);
            }
        } else if (optionId === 3) {
            setIsFadingOut(true);
            setMessage('Nota archivada');
            setTimeout(() => {
                setMessage('');
            }, 7000);
            setTimeout(() => {
                handleArchiveNote(noteId);
            }, 200);
        } else if (optionId === 4) {
            setIsFadingOut(true);
            setMessage('Nota desarchivada');
            setTimeout(() => {
                setMessage('');
            }, 7000);
            setTimeout(() => {
                handleUnarchiveNote(noteId);
            }, 200);
        } else if (optionId === 7) {
            setIsFadingOut(true);
            setMessage('Nota enviada a la papelera');
            setTimeout(() => {
                setMessage('');
            }, 7000);
            setTimeout(() => {
                handleSendNoteToBin(noteId);
            }, 200);
        } else if (optionId === 8) {
            setConfirmDelete(true)
        } else if (optionId === 9) {
            setIsFadingOut(true);
            setTimeout(() => {
                handleRestoreNote(noteId);
            }, 200);
        }
    };

    const handlePickColor = async (color) => {
        try {
            await updateNote(boardId, { ...note, background_color: color });
            getNotes(boardId);
            setPickedColor(color);
        } catch (error) {
            console.error('Error al actualizar el color de la nota:', error);
        }
    };

    const handleDeleteReminder = async (e) => {
        try {
            e.stopPropagation();
            await deleteReminder(boardId, note);
            getNotes(boardId);
        } catch (error) {
            console.error('Error al eliminar el recordatorio de la nota', error);
        }
    };

    const cardStyle = {
        backgroundColor: note.background_color,
        transition: 'all 0.2s ease'
    };

    const handleDragStart = (e) => {
        setIsDragging(true);
        onDragStart(note);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (draggedNote && draggedNote.id !== note.id) {
            onDrop(note, draggedNote);
        }
        setDraggedNote(null);
    };

    return (
        <div className='note-card-container'>
            <div
                ref={noteRef}
                onClick={() => {if (selectedNotes.length > 0) handleSelection()}}
                draggable={!window.location.pathname.includes(`/tableros/${boardId}/papelera`)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className={`note-card ${isFadingOut ? 'fade-out' : ''} ${selectedNote ? 'selected' : ''}`}
                style={cardStyle}>
                <div
                    role='button'
                    onClick={(e) => {e.stopPropagation(); handleSelection()}}
                    className={`select-note ${hover ? 'active' : ''} ${selectedNote ? 'is-selected' : ''}`}
                    data-tooltip-id='select-note-tooltip'
                    data-tooltip-content='Seleccionar nota'>
                    <MdCheckCircle />
                    <Tooltip id='select-note-tooltip' effect="solid" place="bottom" />
                </div>
                <div onClick={() => {if (selectedNotes.length === 0) handleEditNote(note.id)}} className='note-card-content'>
                    {!note.note_title && !note.note_content ? (
                        <div className='note-card-title'>
                            <p>Nota vacía</p>
                        </div>
                    ) : (
                        <>
                            {note && note.note_title ? (
                                <div className='note-card-title'>
                                    <h3>{note.note_title}</h3>
                                </div>
                            ) : ('')}
                            <div className='note-card-description'>
                                <span style={{ whiteSpace: 'pre-line' }}>{truncateText(note.note_content, 500)}</span>
                            </div>
                            {note.reminder ? (
                                <div
                                    role='button'
                                    className='note-card-reminder'
                                    onMouseEnter={() => setDateHover(true)}
                                    onMouseLeave={() => setDateHover(false)}>
                                    <MdOutlineWatchLater className='watch' />
                                    <label>
                                        {formatReminderDate(note.reminder)}
                                    </label>
                                    {dateHover ? (
                                        <>
                                            <div role='button' onClick={handleDeleteReminder} className='delete-reminder option-hover'>
                                                <MdClose data-tooltip-id='delete-reminder-tooltip' data-tooltip-content='Eliminar recordatorio' />
                                            </div>
                                            <Tooltip id='delete-reminder-tooltip' effect="solid" place="bottom" />
                                        </>
                                    ) : ('')}
                                </div>
                            ) : ('')}
                        </>
                    )}
                </div>
                <div id="options" className={`${window.location.pathname === `/tableros/${boardId}/papelera` ? 'in-bin' : 'out-bin'} ${hover && selectedNotes.length === 0 ? 'is-visible' : 'not-visible'} ${selectedNote ? 'is-selected' : ''}`}>
                    {options.map(option => {
                        if (window.location.pathname === `/tableros/${boardId}/notas`) {
                            if ([1, 2, 3, 7].includes(option.id)) {
                                return (
                                    <button
                                        data-option-id={option.id}
                                        key={option.id}
                                        data-tooltip-id='option-tooltip'
                                        data-tooltip-content={option.alt}
                                        onClick={() => handleButtons(option.id, note.id)}
                                        className='option-hover'
                                    >
                                        <span aria-label={option.alt}>
                                            {option.icon.default}
                                        </span>
                                    </button>
                                );
                            }
                        } else if (window.location.pathname === `/tableros/${boardId}/recordatorios`) {
                            if ([1, 2, 3, 7].includes(option.id)) {
                                return (
                                    <button
                                        data-option-id={option.id}
                                        key={option.id}
                                        data-tooltip-id='option-tooltip'
                                        data-tooltip-content={option.alt}
                                        onClick={() => handleButtons(option.id, note.id)}
                                        className='option-hover'
                                    >
                                        <span aria-label={option.alt}>
                                            {option.icon.default}
                                        </span>
                                    </button>
                                );
                            }
                        } else if (window.location.pathname === `/tableros/${boardId}/archivos`) {
                            if ([1, 2, 4, 7].includes(option.id)) {
                                return (
                                    <button
                                        data-option-id={option.id}
                                        key={option.id}
                                        onClick={() => handleButtons(option.id, note.id)}
                                        data-tooltip-id='option-tooltip'
                                        data-tooltip-content={option.alt}
                                        className='option-hover'
                                    >
                                        <span aria-label={option.alt}>
                                            {option.icon.default}
                                        </span>
                                    </button>
                                );
                            }
                        } else if (window.location.pathname === `/tableros/${boardId}/papelera`) {
                            if ([8, 9].includes(option.id)) {
                                return (
                                    <button
                                        data-option-id={option.id}
                                        key={option.id}
                                        onClick={() => handleButtons(option.id, note.id)}
                                        data-tooltip-id='option-tooltip'
                                        data-tooltip-content={option.alt}
                                        className='option-hover'
                                    >
                                        <span aria-label={option.alt}>
                                            {option.icon.default}
                                        </span>
                                    </button>
                                );
                            }
                        }
                        return null;
                    })}
                    <Tooltip id='option-tooltip' effect="solid" place="bottom" />
                </div>
            </div>
            <Reminder
                addReminder={addReminder}
                setAddReminder={setAddReminder}
                noteRef={noteRef}
                note={note}
                boardId={boardId} />
            <ColorPicker
                selectColor={selectColor}
                setSelectColor={setSelectColor}
                pickedColor={pickedColor}
                noteRef={noteRef}
                handlePickColor={handlePickColor} />
            <ConfirmDelete
                confirmDelete={confirmDelete}
                handleConfirmDelete={handleConfirmDelete}
                handleCancelDelete={handleCancelDelete} />
        </div>
    )
}