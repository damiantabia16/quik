import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FaSearch } from 'react-icons/fa';
import ReactQuill, { Quill } from 'react-quill';
import { Tooltip } from 'react-tooltip';
import { options } from './options';
import './custom-toolbar.css';
import "react-quill/dist/quill.snow.css";
import { useNote } from '../../../hooks/useNote';
import Parser from 'html-react-parser';
import Masonry from 'react-masonry-css';

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

  const mountedStyle = { animation: 'translateInAnimation 0.1s' }
  const unmountedStyle = { animation: 'translateOutAnimation 0.1s', animationFillMode: "forwards" }

  const { createNote, getNotes } = useNote();

  const { register, handleSubmit, reset } = useForm();

  let formRef = useRef(null);

  useEffect(() => {
    let handler = (e) => {
      if (formRef?.current && !formRef.current.contains(e.target)) {
        setIsMounted(false);
        reset();
      }
    }

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    }

  });

  const onSubmit = async (data) => {
    data.note_content = content
    try {
      await createNote(boardId, data);
      console.log(data);
      console.log(content);
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
                {options.slice(0, 5).map(option => (
                  <button type='button' key={option.id} className='rounded transition duration-100 hover:bg-[#c9c9c9] p-[5px]'>
                    <span className='text-[#202520] text-[20px]' aria-label={option.alt} data-tooltip-id='option-tooltip' data-tooltip-content={option.alt}>
                      {option.icon.default}
                    </span>
                  </button>
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

function NoteCard({ note, onDragStart, draggedNote, onDrop, editNote }) {

  const { notes, setNotes, getNote } = useNote();

  const [hover, setHover] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  return (
    <div className='select-none mb-[8px] px-[20px]'>
      <div
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`border border-[#e0e0e0] bg-[#eee] text-[#202520] rounded draggable-note ${isDragging ? 'opacity-0' : ''}`}>
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
            (option.id !== 4 && option.id !== 5) && (
              <button key={option.id}>
                <span className='text-[#202520] text-[20px]' aria-label={option.alt} data-tooltip-id='option-tooltip' data-tooltip-content={option.alt}>
                  {option.icon.default}
                </span>
              </button>
            )
          ))}
          <Tooltip id='option-tooltip' effect="solid" place="bottom" />
        </div>
      </div>
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
                <input type="text" defaultValue={note.note_title} {...register('note_title')} placeholder={note.note_title ? '' : 'Título'} className='text-[#202520] outline-none w-full overflow-none whitespace-normal' />
              </div>
              <ReactQuill theme='snow' formats={formats} modules={modules} value={note.note_content} onChange={(value) => setValue('note_content', value)} />
              <div id="options" className='flex justify-between items-center p-[20px]'>
                {options.map(option => (
                  <button key={option.id} className='rounded transition duration-150 hover:bg-[#c9c9c9] p-[5px]'>
                    <span className='text-[#202520] text-[20px]' aria-label={option.alt} data-tooltip-id='option-tooltip' data-tooltip-content={option.alt}>
                      {option.icon.default}
                    </span>
                  </button>
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

function NotesGrid({ boardId, editNote }) {

  const { notes, getNotes } = useNote();

  const [draggedNote, setDraggedNote] = useState(null);

  useEffect(() => {
    getNotes(boardId);
  }, [boardId]);

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
    <div className='relative mt-[40px] overflow-hidden'>
      {notes.length > 0 ? (
        <Masonry breakpointCols={breakpoints} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
          {notes.map((note) => (
            <NoteCard key={note.id} id={note.id} note={note} onDragStart={handleDragStart} onDrop={handleDrop} draggedNote={draggedNote} editNote={editNote} />
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

  const { note, setNote, getNote } = useNote();

  const [editNoteForm, setEditNoteForm] = useState(false);

  const editNote = async (noteId) => {
    try {
      await getNote(boardId, noteId);
      setEditNoteForm(true);
    } catch (error) {
      console.error('Error al obtener la nota:', error);
    }
  }

  const cancelEditNote = () => {
    setEditNoteForm(false)
  }

  useEffect(() => {
    setNote(note);
  }, [note]);

  return (
    <>
      <section id="notes" className="pt-[12px] pl-[70px] flex flex-col flex-1 overflow-y-auto w-full">
        <Searcher boardName={boardName} />
        <NotesGrid boardId={boardId} editNote={editNote} />
        {editNoteForm && <Note cancelEditNote={cancelEditNote} boardId={boardId} />}
      </section>
    </>
  )
}

export default NotesContent