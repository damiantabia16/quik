import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FaSearch } from 'react-icons/fa';
import ReactQuill, { Quill } from 'react-quill';
import { Tooltip } from 'react-tooltip';
import { options } from '../options';
import '../custom-toolbar.css';
import "react-quill/dist/quill.snow.css";
import { useNote } from '../../../../hooks/useNote';
import { RiArchive2Fill } from "react-icons/ri";
import Parser from 'html-react-parser';
import Masonry from 'react-masonry-css';
import ColorPicker from '../ui-elements/ColorPicker';

function Searcher() {
  return (
    <div className='relative mt-[20px] w-full max-w-[600px] px-[20px] mb-[8px] flex items-center justify-center mx-auto'>
      <div className='w-full relative flex shadow-lg'>
        <FaSearch className='absolute top-[30%] text-[#404540] right-3' />
        <input className='w-full outline-none rounded px-[15px] py-[10px] text-[#202520]' type="text" placeholder='Buscar en archivos... ' />
      </div>
    </div>
  )
};

function NoteCard({ note, boardId, onDragStart, draggedNote, onDrop, editNote, handleUnarchiveNote, handleDeleteNote }) {

  const noteRef = useRef(null);

  const { notes, setNotes, getNotes, updateNote } = useNote();

  const [hover, setHover] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectColor, setSelectColor] = useState(false);
  const [pickedColor, setPickedColor] = useState(note.background_color);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const truncateText = (text, maxLength) => {
    const truncatedText = text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    return Parser(truncatedText);
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
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    onDrop(note);
    if (draggedNote && draggedNote.id !== note.id) {
      const updatedNotes = notes.map(n => {
        if (n.id === draggedNote.id) {
          return { ...note };
        }
        if (n.id === note.id) {
          return { ...draggedNote };
        }
        return n;
      });
      setNotes(updatedNotes);
    }
  };

  const handleButtons = (optionId) => {
    if (optionId === 2) {
      if (selectColor) {
        setSelectColor(false)
      } else {
        setSelectColor(true);
      }
    } else if (optionId === 4 || optionId === 7) {
      setIsFadingOut(true);
      setTimeout(() => {
        if (optionId === 4) {
          handleUnarchiveNote(note.id);
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

  const cardStyle = {
    backgroundColor: note.background_color,
    transition: 'all 0.2s ease'
  };

  return (
    <div className='select-none mb-[8px] px-[10px]'>
      <div
        ref={noteRef}
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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
                  <h3 className='font-bold'>{note.note_title}</h3>
                </div>
              ) : ('')}
              <div className='py-[12px] px-[16px]'>
                <span className='text-[.875rem]' style={{ whiteSpace: 'pre-line' }}>{truncateText(note.note_content, 500)}</span>
              </div>
            </>
          )}
        </div>
        <div id="options" className={`flex justify-between items-center p-[15px] ${hover ? 'visible opacity-100' : 'invisible opacity-0'} transition duration-150`}>
          {options.map(option => (
            (option.id !== 3 && option.id !== 5 && option.id !== 6 && option.id !== 8 && option.id !== 9) && (
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
      <ColorPicker selectColor={selectColor} setSelectColor={setSelectColor} pickedColor={pickedColor} noteRef={noteRef} handlePickColor={handlePickColor} />
    </div>
  )
}

function Note({ boardId, cancelEditNote }) {

  const { note, updateNote, getNotes } = useNote();

  const { register, handleSubmit, setValue } = useForm();

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
        <div className='bg-[#eeeeee] min-[480px]:w-[400px] rounded close-shadow'>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='p-[20px]'>
                <input type="text" {...register('note_title')} placeholder={note.note_title ? '' : 'Título'} autoComplete='off' className='text-[#202520] outline-none w-full overflow-none whitespace-normal' />
              </div>
              <ReactQuill theme='snow' formats={formats} modules={modules} value={note.note_content} onChange={(value) => setValue('note_content', value)} />
              <div id="options" className='flex justify-between items-center p-[20px]'>
                {options.map(option => (
                  option.id !== 3 && (
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

function ArchivedGrid({ boardId, editNote, handleUnarchiveNote, handleDeleteNote }) {
  const { notes, getNotes } = useNote();

  const [draggedNote, setDraggedNote] = useState(null);

  useEffect(() => {
    getNotes(boardId);
  }, [boardId]);

  const filteredNotes = notes.filter(note => note.is_archived && !note.in_bin);

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
              Nada que ocultar por aquí.
            </p>
            <p>
              <span className='flex items-center justify-center'>
                Haz click en el botón
                <span className='bg-[#98ff98] mx-[5px] select-none text-[#202520] rounded-full w-[20px] h-[20px] inline-flex text-center justify-center items-center font-semibold'>
                  <RiArchive2Fill />
                </span>
                para archivar una.
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function Archives({ boardId }) {

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
    <section id="archives" className="pt-[12px] pl-[70px] flex flex-col flex-1 overflow-y-auto w-full">
      <Searcher />
      <ArchivedGrid boardId={boardId} editNote={editNote} handleUnarchiveNote={handleUnarchiveNote} handleDeleteNote={handleDeleteNote} />
      {editNoteForm && <Note cancelEditNote={cancelEditNote} boardId={boardId} />}
    </section>
  )
}

export default Archives