import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FaSearch } from 'react-icons/fa';
import ReactQuill, { Quill } from 'react-quill';
import { Tooltip } from 'react-tooltip';
import { options } from '../options';
import '../custom-toolbar.css';
import "react-quill/dist/quill.snow.css";
import { useNote } from '../../../../hooks/useNote';
import { MdAddAlarm, MdOutlineWatchLater, MdClose } from "react-icons/md";
import Parser from 'html-react-parser';
import Masonry from 'react-masonry-css';
import Reminder from '../ui-elements/Reminder';
import ColorPicker from '../ui-elements/ColorPicker';

function Searcher() {
  return (
    <div className='relative mt-[20px] w-full max-w-[600px] px-[20px] mb-[8px] flex items-center justify-center mx-auto'>
      <div className='w-full relative flex shadow-lg'>
        <FaSearch className='absolute top-[30%] text-[#404540] right-3' />
        <input className='w-full outline-none rounded px-[15px] py-[10px] text-[#202520]' type="text" placeholder='Buscar en recordatorios... ' />
      </div>
    </div>
  )
};

function NoteCard({ note, boardId, onDragStart, draggedNote, setDraggedNote, onDrop, editNote, handleArchiveNote, handleDeleteNote }) {

  const noteRef = useRef(null);

  const { getNotes, updateNote, deleteReminder } = useNote();

  const [hover, setHover] = useState(false);
  const [dateHover, setDateHover] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  const [addReminder, setAddReminder] = useState(false);

  const [selectColor, setSelectColor] = useState(false);
  const [pickedColor, setPickedColor] = useState(note.background_color);

  const [isFadingOut, setIsFadingOut] = useState(false);

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

  const handleButtons = (optionId) => {
    if (optionId === 1) {
      if (addReminder) {
        setAddReminder(false);
      } else {
        setAddReminder(true);
      }
    } else if (optionId === 2) {
      if (selectColor) {
        setSelectColor(false)
      } else {
        setSelectColor(true);
      }
    } else if (optionId === 3 || optionId === 7) {
      setIsFadingOut(true);
      setTimeout(() => {
        if (optionId === 3) {
          handleArchiveNote(note.id);
        } else if (optionId === 7) {
          handleDeleteNote(note.id);
        }
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
      console.error(error);
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

  const handleDragLeave = () => {
    setIsDragging(false);
    onDragLeave(note);
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
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`relative text-[#202520] rounded draggable-note
        ${isDragging ? 'opacity-0' : ''}
        ${isFadingOut ? 'fade-out' : 'opacity-transition'}`}
        style={cardStyle}>
        <div onClick={() => editNote(note.id)} className='min-h-[60px]'>
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
        <div id="options" className={`flex justify-between items-center p-[15px] ${hover ? 'visible opacity-100' : 'invisible opacity-0'} transition duration-150`}>
          {options.map(option => (
            (option.id !== 4 && option.id !== 5 && option.id !== 6 && option.id !== 8 && option.id !== 9) && (
              <button data-option-id={option.id} key={option.id} onClick={() => handleButtons(option.id)} className={`rounded transition duration-100 option-hover p-[5px]`}>
                <span className='text-[#202520] text-[20px]' aria-label={option.alt} data-tooltip-id='option-tooltip' data-tooltip-content={option.alt}>
                  {option.icon.default}
                </span>
              </button>
            )
          ))}
          <Tooltip id='option-tooltip' effect="solid" place="bottom" />
        </div>
      </div>
      <Reminder addReminder={addReminder} setAddReminder={setAddReminder} noteRef={noteRef} note={note} boardId={boardId} />
      <ColorPicker selectColor={selectColor} setSelectColor={setSelectColor} pickedColor={pickedColor} noteRef={noteRef} handlePickColor={handlePickColor} />
    </div>
  )
}

function RemindersGrid({ boardId, editNote, handleUnarchiveNote, handleDeleteNote }) {
  const { notes, getNotes } = useNote();

  const [draggedNote, setDraggedNote] = useState(null);

  useEffect(() => {
    getNotes(boardId);
  }, [boardId]);

  const filteredNotes = notes.filter(note => note.reminder && !note.in_bin && !note.is_archived);

  const handleDragStart = (note) => {
    setDraggedNote(note)
  };

  const handleDrop = (droppedNote) => {
    console.log('Nota arrastrada:', draggedNote);
    console.log('Nota soltada:', droppedNote);
    setDraggedNote(null);
  };

  const breakpoints = {
    default: 7,
    1700: 6,
    1400: 5,
    1200: 4,
    1130: 3,
    850: 2,
    680: 1
  };

  return (
    <div className='relative mt-[40px] overflow-hidden px-[10px]'>
      {filteredNotes.length > 0 ? (
        <Masonry breakpointCols={breakpoints} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              id={note.id}
              note={note}
              boardId={boardId}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              draggedNote={draggedNote}
              editNote={editNote}
              handleUnarchiveNote={handleUnarchiveNote}
              handleDeleteNote={handleDeleteNote} />
          ))}
        </Masonry>
      ) : (
        <div className='p-[20px] w-full h-full m-auto flex flex-col items-center justify-center'>
          <div className='cursor-default add-note-blur rounded p-[20px] text-center'>
            <p className='text-[35px] mb-[10px]'>
              Parece que tienes buena memoria.
            </p>
            <p>
              <span className='flex items-center justify-center'>
                Haz click en el botón
                <span className='bg-[#98ff98] mx-[5px] select-none text-[#202520] rounded-full w-[20px] h-[20px] inline-flex text-center justify-center items-center font-semibold'>
                  <MdAddAlarm />
                </span>
                para añadir un recordatorio.
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function Reminders({ boardId }) {

  const { note, setNote, getNote, getNotes, unarchiveNote, sendNoteToBin } = useNote();

  const [editNoteForm, setEditNoteForm] = useState(false);

  const editNote = async (noteId) => {
    try {
      await getNote(boardId, noteId);
      setEditNoteForm(true);
    } catch (error) {
      console.error('Error al obtener la nota:', error);
    }
  };

  const cancelEditNote = () => {
    setEditNoteForm(false)
  };

  const handleUnarchiveNote = async (noteId) => {
    try {
      await unarchiveNote(boardId, { id: noteId });
      getNotes(boardId);
    } catch (error) {
      console.error('Error al archivar la nota:', error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await sendNoteToBin(boardId, { id: noteId });
      getNotes(boardId);
    } catch (error) {
      console.error('Error al archivar la nota:', error);
    }
  };

  useEffect(() => {
    setNote(note);
  }, [note]);

  return (
    <section id="reminders" className="pt-[12px] pl-[70px] flex flex-col flex-1 overflow-y-auto w-full">
      <Searcher />
      <RemindersGrid boardId={boardId} editNote={editNote} handleUnarchiveNote={handleUnarchiveNote} handleDeleteNote={handleDeleteNote} />
    </section>
  )
}

export default Reminders