import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FaSearch } from 'react-icons/fa';
import ReactQuill, { Quill } from 'react-quill';
import { Tooltip } from 'react-tooltip';
import { options } from '../options';
import '../custom-toolbar.css';
import "react-quill/dist/quill.snow.css";
import { useNote } from '../../../../hooks/useNote';
import Masonry from 'react-masonry-css';
import Note from '../ui-elements/Note';
import NoteCard from '../ui-elements/NoteCard';

function Searcher({ boardName }) {

  const lowerCase = boardName ? boardName.toLowerCase() : '';

  return (
    <div className='relative mt-[20px] w-full max-w-[600px] px-[20px] mb-[8px] flex items-center justify-center mx-auto'>
      <div className='w-full relative flex shadow-lg'>
        <FaSearch className='absolute top-[30%] text-[#404540] right-3' />
        <input id='searcher' className='w-full outline-none rounded px-[15px] py-[10px] text-[#202520]' type="text" placeholder={`Buscar en ${lowerCase}...`} />
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
                <button type='submit' className='py-[4px] px-[12px] text-[15px] text-[#202524] bg-[#98ff98] rounded-md font-medium transition duration-150 hover:bg-[#78ff78]'>
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

function NotesGrid({ boardId, editNote, editNoteForm, handleArchiveNote, handleDeleteNote, setMessage, previousNote, setPreviousNote }) {

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
              editNoteForm={editNoteForm}
              handleArchiveNote={handleArchiveNote}
              handleDeleteNote={handleDeleteNote}
              setMessage={setMessage} />
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

function NotesContent({ boardId, boardName, message, setMessage }) {

  const { getNote, getNotes, archiveNote, sendNoteToBin } = useNote();

  const [editNoteForm, setEditNoteForm] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const editNote = async (noteId) => {
    try {
      await getNote(boardId, noteId);
      setIsMounted(true);
    } catch (error) {
      console.error('Error al obtener la nota:', error);
    }
  };

  const closeEditNote = () => {
    setIsMounted(false);
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

  return (
    <>
      <section id="notes" className="pt-[12px] pl-[70px] flex flex-col flex-1 overflow-y-auto w-full">
        <Searcher boardName={boardName} />
        <NotesGrid
          boardId={boardId}
          editNote={editNote}
          editNoteForm={editNoteForm}
          handleArchiveNote={handleArchiveNote}
          handleDeleteNote={handleDeleteNote}
          setMessage={setMessage} />
        <Note
          boardId={boardId}
          isMounted={isMounted}
          setIsMounted={setIsMounted}
          editNoteForm={editNoteForm}
          setEditNoteForm={setEditNoteForm}
          closeEditNote={closeEditNote}
        />
      </section>
    </>
  )
}

export default NotesContent