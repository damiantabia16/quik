import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FaSearch } from 'react-icons/fa';
import ReactQuill, { Quill } from 'react-quill';
import { Tooltip } from 'react-tooltip';
import { options } from '../options';
import '../custom-toolbar.css';
import "react-quill/dist/quill.snow.css";
import { useNote } from '../../../../hooks/useNote';
import { MdOutlineWatchLater, MdClose } from "react-icons/md";
import Parser from 'html-react-parser';
import Masonry from 'react-masonry-css';
import Reminder from '../ui-elements/Reminder';
import ColorPicker from '../ui-elements/ColorPicker';

function Searcher({ boardName }) {

  const lowerCase = boardName ? boardName.toLowerCase() : '';

  return (
    <div className='relative mt-[20px] w-full max-w-[600px] px-[20px] mb-[8px] flex items-center justify-center mx-auto'>
      <div className='w-full relative flex shadow-lg'>
        <FaSearch className='absolute top-[30%] text-[#404540] right-3' />
        <input className='w-full outline-none rounded px-[15px] py-[10px] text-[#202520]' type="text" placeholder={`Buscar en ${lowerCase}...`} />
      </div>
    </div>
  )
};

export function CreateNote({ boardId, isMounted, setIsMounted, createNoteForm, setCreateNoteForm, content, setContent }) {

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }]
    ],
  };

  const formats = [
    'bold', 'italic', 'underline', 'strike', 'color', 'background',
    'list', 'bullet'
  ];

  useEffect(() => {
    let timeoutId;

    if (isMounted && !createNoteForm) {
      setCreateNoteForm(true);
    } else if (!isMounted && createNoteForm) {
      timeoutId = setTimeout(() => {
        setCreateNoteForm(false);
      }, 100)
    }
    return () => clearTimeout(timeoutId);
  }, [isMounted, createNoteForm]);

  const mountedStyle = { animation: 'translateInAnimation 0.2s' }
  const unmountedStyle = { animation: 'translateOutAnimation 0.2s', animationFillMode: "forwards" }

  const { createNote, getNotes } = useNote();

  const { register, handleSubmit, reset } = useForm();

  let formRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (formRef?.current && !formRef.current.contains(e.target)) {
      setIsMounted(false);
      reset();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setIsMounted]);

  const onSubmit = async (data) => {
    data.note_content = content
    try {
      await createNote(boardId, data);
      setContent('');
      setIsMounted(false);
      reset();
      getNotes(boardId);
    } catch (error) {
      console.error('Error al crear la nota:', error);
    }
  }

  return (
    <>
      {createNoteForm && (
        <div ref={formRef} className={`fixed right-0 bottom-0 close-shadow z-[9998] bg-white rounded-md mr-[30px] mb-[105px] transform transition-all duration-100 ease-in-out`} style={isMounted ? mountedStyle : unmountedStyle}>
          <section className='relative w-[300px]'>
            <form onSubmit={handleSubmit(onSubmit)} className='relative'>
              <div id='title' className='px-[20px] py-[10px]'>
                <input type="text" placeholder='Título' autoComplete='off' className='text-[15px] text-[#202524] outline-none w-full overflow-none whitespace-normal' style={{ overflowWrap: 'break-word' }} {...register('note_title')} />
              </div>
              <ReactQuill theme='snow' formats={formats} modules={modules} value={content} onChange={setContent} placeholder='Escribe tu nota aquí...' />
              <div id="options" className='flex justify-between items-center px-[20px] pb-[5px] overflow-hidden'>
                {options.slice(0, 6).map(option => (
                  option.id !== 4 && (
                    <button type='button' key={option.id} className='rounded transition duration-100 hover:bg-[#c9c9c9] p-[5px]'>
                      <span className='text-[#202520] text-[20px]' aria-label={option.alt} data-tooltip-id='option-tooltip' data-tooltip-content={option.alt}>
                        {option.icon.default}
                      </span>
                    </button>
                  )
                ))}
                <Tooltip id='option-tooltip' effect="solid" place="bottom" />
              </div>
              <div id='add-note' className='px-[20px] py-[20px] flex justify-end'>
                <button type='submit' className='px-[7px] py-[3px] text-[15px] text-[#202524] bg-[#98ff98] rounded-md font-medium transition duration-150 hover:bg-[#78ff78]'>
                  AGREGAR NOTA
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  )
}

function Note({ boardId, cancelEditNote }) {

  const { note, updateNote, getNotes } = useNote();

  const { register, handleSubmit, setValue } = useForm();

  const [backgroundColor, setBackgroundColor] = useState(null);

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }]
    ],
  };

  const formats = [
    'bold', 'italic', 'underline', 'strike', 'color', 'background',
    'list', 'bullet'
  ];

  useEffect(() => {
    setValue('note_title', note.note_title);
    setValue('note_content', note.note_content);
    if (note.background_color === 'transparent') {
      setBackgroundColor('#eee');
    } else {
      setBackgroundColor(note.background_color);
    }
  }, [note]);

  const onSubmit = async (data) => {
    try {
      await updateNote(boardId, { ...note, ...data });
      cancelEditNote();
      getNotes(boardId);
    } catch (error) {
      console.error('Error al actualizar la nota:', error);
    }
  }

  return (
    <>
      <div className={`fixed w-screen h-screen top-0 bottom-0 left-0 right-0 z-[9999] bg-[#00000070] overflow-hidden transition-opacity duration-100`} />
      <section className='fixed px-[20px] min-[480px]:px-0 flex justify-center items-center w-full h-full left-0 right-0 bottom-0 top-0 z-[10000] transition-opacity duration-100'>
        <div className={`min-[480px]:w-[400px] rounded close-shadow ${note.background_color === 'transparent' ? 'bg-[#eee]' : ''}`} style={{ backgroundColor: backgroundColor }}>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='p-[20px]'>
                <input type="text" {...register('note_title')} placeholder={note.note_title ? '' : 'Título'} autoComplete='off' className='text-[#202520] outline-none w-full overflow-none whitespace-normal bg-transparent' />
              </div>
              <ReactQuill theme='snow' formats={formats} modules={modules} value={note.note_content} onChange={(value) => setValue('note_content', value)} />
              <div id="options" className='flex justify-between items-center p-[20px]'>
                {options.map(option => (
                  option.id !== 4 && option.id !== 8 && option.id !== 9 && (
                    <button type='button' key={option.id} className='rounded transition duration-150 hover:bg-[#c9c9c9] p-[5px]'>
                      <span className='text-[#202520] text-[20px]' aria-label={option.alt} data-tooltip-id='option-tooltip' data-tooltip-content={option.alt}>
                        {option.icon.default}
                      </span>
                    </button>
                  )
                ))}
                <Tooltip id='option-tooltip' effect="solid" place="bottom" />
                <button type='submit' className='text-[#202520] py-[8px] px-[24px] transition duration-150 hover:bg-[#98ff98] rounded-md font-medium'>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

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

function NotesGrid({ boardId, editNote, handleArchiveNote, handleDeleteNote }) {

  const { notes, setNotes, getNotes } = useNote();

  const [draggedNote, setDraggedNote] = useState(null);

  useEffect(() => {
    getNotes(boardId);
  }, [boardId]);

  const filteredNotes = notes.filter(note => !note.is_archived && !note.in_bin);

  const handleDragStart = (note) => {
    setDraggedNote(note)
  };

  const handleDrop = (targetNote, draggedNote) => {
    const targetIndex = notes.findIndex(n => n.id === targetNote.id);
    const draggedIndex = notes.findIndex(n => n.id === draggedNote.id);

    const updatedNotes = [...notes];

    [updatedNotes[targetIndex], updatedNotes[draggedIndex]] = [draggedNote, targetNote];

    setNotes(updatedNotes);
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
              setDraggedNote={setDraggedNote}
              editNote={editNote}
              handleArchiveNote={handleArchiveNote}
              handleDeleteNote={handleDeleteNote} />
          ))}
        </Masonry>
      ) : (
        <div className='p-[20px] w-full h-full m-auto flex flex-col items-center justify-center'>
          <div className='cursor-default add-note-blur rounded p-[20px] text-center'>
            <p className='text-[35px] mb-[10px]'>
              Aún no tienes ninguna nota.
            </p>
            <p>
              <span>
                Haz click en el botón{' '}
                <span className='bg-[#98ff98] select-none text-[#202520] rounded-full w-[20px] h-[20px] inline-flex text-center justify-center items-center font-semibold'>
                  +
                </span>{' '}
                en el costado inferior derecho para crear una.
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function NotesContent({ boardId, boardName }) {

  const { note, setNote, getNote, getNotes, archiveNote, sendNoteToBin } = useNote();

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

  const handleArchiveNote = async (noteId) => {
    try {
      await archiveNote(boardId, { id: noteId });
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
    <>
      <section id="notes" className="pt-[12px] pl-[70px] flex flex-col flex-1 overflow-y-auto w-full">
        <Searcher boardName={boardName} />
        <NotesGrid boardId={boardId} editNote={editNote} handleArchiveNote={handleArchiveNote} handleDeleteNote={handleDeleteNote} />
        {editNoteForm && <Note cancelEditNote={cancelEditNote} boardId={boardId} />}
      </section>
    </>
  )
}

export default NotesContent