import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { options } from '../../notes/content/options';
import { useNote } from '../../../hooks/useNote';
import './note-card.css';
import Parser from 'html-react-parser';
import Reminder from '../reminder/Reminder';
import ColorPicker from '../color-picker/ColorPicker';
import ConfirmDelete from '../confirm-delete/ConfirmDelete';
import ReminderDate from '../reminder-date/ReminderDate';
import { MdCheckCircle, MdOutlineWatchLater, MdClose } from "react-icons/md";

export default function NoteCard({
    note,
    boardId,
    editNote,
    selectedNotes,
    setSelectedNotes,
    allSelected,
    handleArchiveNote,
    handleUnarchiveNote,
    handleSendNoteToBin,
    handleDeleteNote,
    handleRestoreNote,
    setMessage,
    searchTerm
}) {

    const noteRef = useRef(null);

    const { pathname } = useLocation();

    const { getNotes, updateNote, deleteReminder } = useNote();

    const [hover, setHover] = useState(false);

    const [isSelected, setIsSelected] = useState(false);

    const [addReminder, setAddReminder] = useState(false);

    const [selectColor, setSelectColor] = useState(false);
    const [pickedColor, setPickedColor] = useState(note.background_color);

    const [isFadingOut, setIsFadingOut] = useState(false);

    const [confirmDelete, setConfirmDelete] = useState(false);

    const [showAlert, setShowAlert] = useState(false);

    useEffect(() => {
        const reminderInterval = setInterval(() => {
            const reminderTime = new Date(note.reminder).getTime();
            const currentTime = new Date().getTime();

            if (currentTime >= reminderTime && note.reminder && !showAlert) {
                setShowAlert(true);
                alert(`¡Es hora de tu recordatorio para "${note.note_title}"!`);
                clearInterval(reminderInterval);
            }
        }, 1000);

        return () => clearInterval(reminderInterval);
    }, [note, showAlert]);

    const highlightMatchingText = (text, searchTerm) => {
        if (!searchTerm.trim()) return text;
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    };

    const truncateText = (text, maxLength) => {
        const truncatedText = text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
        return Parser(truncatedText);
    };

    const handleEditNote = (noteId) => {
        if (!pathname.includes('/papelera')) {
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
        setIsSelected(!isSelected);
        setSelectedNotes(prevSelectedNotes => {
            if (isSelected) {
                return prevSelectedNotes.filter(id => id !== note.id);
            } else {
                return [...prevSelectedNotes, note.id];
            }
        });
    };

    useEffect(() => {
        if (selectedNotes.length === 0) {
            setIsSelected(false)
        }
    }, [selectedNotes]);

    useEffect(() => {
        if (allSelected) {
            setIsSelected(true);
        }
    }, [allSelected]);

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
            handleArchiveNote(noteId);
        } else if (optionId === 4) {
            setIsFadingOut(true);
            setMessage('Nota desarchivada');
            setTimeout(() => {
                setMessage('');
            }, 7000);
            handleUnarchiveNote(noteId);
        } else if (optionId === 7) {
            setIsFadingOut(true);
            setMessage('Nota enviada a la papelera');
            setTimeout(() => {
                setMessage('');
            }, 7000);
            handleSendNoteToBin(noteId);
        } else if (optionId === 8) {
            setConfirmDelete(true)
        } else if (optionId === 9) {
            setIsFadingOut(true);
            handleRestoreNote(noteId);
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

    const handleDeleteReminder = async () => {
        try {
            await deleteReminder(boardId, note);
            getNotes(boardId);
        } catch (error) {
            console.error('Error al eliminar el recordatorio de la nota', error);
        }
    };

    const cardStyle = {
        backgroundColor: pickedColor,
        transition: 'all 0.2s ease'
    };

    return (
        <div className='note-card-container'>
            <div
                ref={noteRef}
                onClick={() => { if (selectedNotes.length > 0) handleSelection() }}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className={`note-card ${isFadingOut ? 'fade-out' : ''} ${isSelected ? 'selected' : ''}`}
                style={cardStyle}>
                <div
                    role='button'
                    onClick={(e) => { e.stopPropagation(); handleSelection() }}
                    className={`select-note ${hover ? 'active' : ''} ${isSelected ? 'is-selected' : ''}`}
                    data-tooltip-id='select-note-tooltip'
                    data-tooltip-content='Seleccionar nota'>
                    <MdCheckCircle />
                    <Tooltip id='select-note-tooltip' effect="solid" place="bottom" />
                </div>
                <div onClick={() => { if (selectedNotes.length === 0) handleEditNote(note.id) }} className='note-card-content'>
                    {!note.note_title && !note.note_content ? (
                        <div className='note-card-title'>
                            <p>Nota vacía</p>
                        </div>
                    ) : (
                        <>
                            {note && note.note_title ? (
                                <div className='note-card-title'>
                                    <h3>{Parser(highlightMatchingText(note.note_title, searchTerm))}</h3>
                                </div>
                            ) : ('')}
                            <div className='note-card-description'>
                                <span style={{ whiteSpace: 'pre-line' }}>{truncateText(highlightMatchingText(note.note_content, searchTerm), 500)}</span>
                            </div>
                            {note.reminder && (
                                <ReminderDate noteCardReminder={note.reminder} handleDeleteReminder={handleDeleteReminder} />
                            )}
                        </>
                    )}
                </div>
                <div id="options" className={`${pathname.includes('/papelera') ? 'in-bin' : 'out-bin'} ${hover && selectedNotes.length === 0 ? 'is-visible' : 'not-visible'} ${isSelected ? 'is-selected' : ''}`}>
                    {options.map(option => {
                        if (pathname.includes('/notas')) {
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
                        } else if (pathname.includes('/recordatorios')) {
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
                        } else if (pathname.includes('/archivos')) {
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
                        } else if (pathname.includes('/papelera')) {
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
                boardId={boardId}
                setMessage={setMessage} />
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