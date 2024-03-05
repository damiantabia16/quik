import { useState, useRef, useEffect } from 'react';
import { Tooltip } from 'react-tooltip';
import { options } from '../options';
import { useNote } from '../../../../hooks/useNote';
import Parser from 'html-react-parser';
import Reminder from './Reminder';
import ColorPicker from './ColorPicker';
import ConfirmDelete from './ConfirmDelete';
import { MdOutlineWatchLater, MdClose } from "react-icons/md";

export default function NoteCard({
    note,
    boardId,
    onDragStart,
    draggedNote,
    setDraggedNote,
    onDrop,
    editNote,
    handleArchiveNote,
    handleUnarchiveNote,
    handleDeleteNote,
    handleRestoreNote,
    setMessage
}) {

    const noteRef = useRef(null);

    const { getNotes, updateNote, deleteReminder } = useNote();

    const [hover, setHover] = useState(false);
    const [dateHover, setDateHover] = useState(false);

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
                handleDeleteNote(noteId);
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
        <div className='select-none mb-[8px] px-[10px] relative'>
            <div
                ref={noteRef}
                draggable
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className={`relative text-[#202520] rounded draggable-note
                ${isFadingOut ? 'fade-out' : 'opacity-transition'}`}
                style={cardStyle}>
                <div onClick={() => handleEditNote(note.id)} className='min-h-[60px]'>
                    {!note.note_title && !note.note_content ? (
                        <div className='py-[12px] px-[16px]'>
                            <p className='text-[20px] text-[#505550]'>Nota vacía</p>
                        </div>
                    ) : (
                        <>
                            {note && note.note_title ? (
                                <div className='pt-[12px] px-[16px]'>
                                    <h3 className='font-semibold'>{note.note_title}</h3>
                                </div>
                            ) : ('')}
                            <div className='py-[12px] px-[16px]'>
                                <span className='text-[.875rem]' style={{ whiteSpace: 'pre-line' }}>{truncateText(note.note_content, 500)}</span>
                            </div>
                            {note.reminder ? (
                                <div role='button' className='relative text-[#404540] pt-[12px] pb-[6px] px-[16px] flex items-center w-fit' onMouseEnter={() => setDateHover(true)} onMouseLeave={() => setDateHover(false)}>
                                    <MdOutlineWatchLater className='mr-[5px]' />
                                    <label className='cursor-pointer text-[.7rem] mr-[5px]'>
                                        {formatReminderDate(note.reminder)}
                                    </label>
                                    {dateHover ? (
                                        <>
                                            <div role='button' onClick={handleDeleteReminder} className='absolute right-0 option-hover rounded-full w-[16px] h-[16px]'>
                                                <MdClose data-tooltip-id='delete-reminder-tooltip' data-tooltip-content='Eliminar recordatorio' className='text-[.875rem] m-auto h-full' />
                                            </div>
                                            <Tooltip id='delete-reminder-tooltip' effect="solid" place="bottom" />
                                        </>
                                    ) : ('')}
                                </div>
                            ) : ('')}
                        </>
                    )}
                </div>
                <div id="options" className={`flex ${window.location.pathname === `/tableros/${boardId}/papelera` ? 'justify-end' : 'justify-between'} p-[15px] ${hover ? 'visible opacity-100' : 'invisible opacity-0'} transition duration-200`}>
                    {options.map(option => {
                        if (window.location.pathname === `/tableros/${boardId}`) {
                            if ([1, 2, 3, 7].includes(option.id)) {
                                return (
                                    <button
                                        data-option-id={option.id}
                                        key={option.id}
                                        onClick={() => handleButtons(option.id, note.id)}
                                        className={`rounded transition duration-200 option-hover p-[5px]`}
                                    >
                                        <span className='text-[#202520] text-[20px]' aria-label={option.alt} data-tooltip-id='option-tooltip' data-tooltip-content={option.alt}>
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
                                        onClick={() => handleButtons(option.id, note.id)}
                                        className={`rounded transition duration-200 option-hover p-[5px]`}
                                    >
                                        <span className='text-[#202520] text-[20px]' aria-label={option.alt} data-tooltip-id='option-tooltip' data-tooltip-content={option.alt}>
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
                                        className={`rounded transition duration-200 option-hover p-[5px]`}
                                    >
                                        <span className='text-[#202520] text-[20px]' aria-label={option.alt} data-tooltip-id='option-tooltip' data-tooltip-content={option.alt}>
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
                                        className={`rounded transition duration-200 option-hover p-[5px]`}
                                    >
                                        <span className='text-[#202520] text-[20px]' aria-label={option.alt} data-tooltip-id='option-tooltip' data-tooltip-content={option.alt}>
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
            <Reminder addReminder={addReminder} setAddReminder={setAddReminder} noteRef={noteRef} note={note} boardId={boardId} />
            <ColorPicker selectColor={selectColor} setSelectColor={setSelectColor} pickedColor={pickedColor} noteRef={noteRef} handlePickColor={handlePickColor} />
            <ConfirmDelete confirmDelete={confirmDelete} handleConfirmDelete={handleConfirmDelete} handleCancelDelete={handleCancelDelete} />
        </div>
    )
}