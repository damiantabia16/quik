import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { FaSearch } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import { options } from '../options';
import { styles } from '../styles';
import '../custom-toolbar.css';
import "react-quill/dist/quill.snow.css";
import { useNote } from '../../../../hooks/useNote';
import Masonry from 'react-masonry-css';
import Note from '../ui-elements/Note';
import NoteCard from '../ui-elements/NoteCard';
import Reminder from '../ui-elements/Reminder';
import ColorPicker from '../ui-elements/ColorPicker';
import useUndoRedo from '../../../../hooks/useUndoRedo';

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

export function CreateNote({ boardId, isMounted, setIsMounted, createNoteForm, setCreateNoteForm }) {

  const init = '';

  const {
    state,
    setState,
    index,
    lastIndex,
    handleReset,
    handleUndo,
    handleRedo
  } = useUndoRedo(init);

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

  const [placeholder, setPlaceholder] = useState(true);
  const [addReminder, setAddReminder] = useState(false);
  const [selectColor, setSelectColor] = useState(false);

  const canUndo = index > 0;
  const canRedo = index < lastIndex;

  let formRef = useRef(null);

  const handleOutsideClick = (e) => {
    if (formRef?.current && !formRef.current.contains(e.target)) {
      setIsMounted(false);
      handleReset(init);
      setPlaceholder(true);
      reset();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setIsMounted]);

  const editorRef = useRef(null);

  const handleContentChange = (e) => {
    const text = e.target.innerHTML;
    setState(text);
    setPlaceholder(text.length === 0);
  };

  useEffect(() => {
    if (editorRef.current) {
      const range = document.createRange();
      const selection = window.getSelection();
      range.setStart(editorRef.current, editorRef.current.childNodes.length);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [state]);

  const isStyleApplied = (style, range) => {
    if (!range || range.collapsed) {
      return false;
    }

    const element = range.commonAncestorContainer.nodeType === 1 ? range.commonAncestorContainer : range.commonAncestorContainer.parentElement;

    if (!element) {
      return false;
    }

    const appliedStyles = window.getComputedStyle(element);

    switch (style) {
      case 'bold':
        return appliedStyles.fontWeight === '600';
      case 'italic':
        return appliedStyles.fontStyle === 'italic';
      case 'underline':
        return appliedStyles.textDecoration.includes('underline');
      case 'strike':
        return appliedStyles.textDecoration.includes('line-through');
      case 'ordered-list':
        return appliedStyles.listStyle.includes('decimal');
      case 'bullet-list':
        return appliedStyles.listStyle.includes('•  ');
      default:
        return false;
    }
  };

  const handleStyles = (styleId) => {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    const selectedText = range.toString();

    const currentStyles = {
      bold: isStyleApplied('bold', range),
      italic: isStyleApplied('italic', range),
      underline: isStyleApplied('underline', range),
      color: isStyleApplied('color', range),
      strike: isStyleApplied('strike', range),
      ordered_list: isStyleApplied('ordered-list', range),
      bullet_list: isStyleApplied('bullet-list', range)
    };

    switch (styleId) {
      case 1:
        currentStyles.bold = !currentStyles.bold;
        break;
      case 2:
        currentStyles.italic = !currentStyles.italic;
        break;
      case 3:
        currentStyles.underline = !currentStyles.underline;
        break;
      case 4:
        currentStyles.strike = !currentStyles.strike;
        break;
      case 5:
        currentStyles.ordered_list = !currentStyles.ordered_list;
        break;
      case 6:
        currentStyles.bullet_list = !currentStyles.bullet_list;
        break;
      default:
        console.log('No se ha encontrado el botón');
        return;
    }

    let newContent = selectedText;

    if (currentStyles.underline) {
      newContent = `<u>${newContent}</u>`;
    }
    if (currentStyles.strike) {
      newContent = `<s>${newContent}</s>`;
    }
    if (currentStyles.bold) {
      newContent = `<strong>${newContent}</strong>`;
    }
    if (currentStyles.italic) {
      newContent = `<em>${newContent}</em>`;
    }
    if (currentStyles.ordered_list) {
      newContent = `<ol><li>${newContent}</li></ol>`;
    }
    if (currentStyles.bullet_list) {
      newContent = `<ul><li>${newContent}</li></ul>`;
    }

    document.execCommand('insertHTML', false, newContent);
  };

  const handleOptions = (optionId) => {
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
    }
  }

  const onSubmit = async (data) => {
    try {
      data.note_content = state
      await createNote(boardId, data);
      setIsMounted(false);
      reset();
      getNotes(boardId);
      handleReset(init);
      setPlaceholder(true);
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
                <input type="text" placeholder='Título' autoComplete='off' className='text-[#202520] outline-none w-full overflow-none whitespace-normal text-wrap' {...register('note_title')} />
              </div>
              <div className={`${placeholder ? 'absolute w-full text-[#a9a9a9] pointer-events-none px-[20px] py-[10px]' : 'hidden'}`}>
                Escribe tu nota aquí...
              </div>
              <div
                id='editor'
                ref={editorRef}
                className={`px-[20px] py-[10px] w-full h-[320px] outline-none text-[#202520] whitespace-pre-wrap break-words overflow-auto`}
                contentEditable={true}
                aria-multiline
                tabIndex={0}
                role='textbox'
                dangerouslySetInnerHTML={{ __html: state }}
                onInput={handleContentChange}
                spellCheck
              />
              <div id='styles' className='flex justify-between items-center px-[20px] overflow-hidden'>
                {styles.map(style => (
                  <button type='button' key={style.id} data-tooltip-id='style-tooltip' data-tooltip-content={style.alt} onClick={() => handleStyles(style.id)} className={`rounded p-[5px] transition-all duration-200 hover:bg-[#c9c9c9]`}>
                    <span className='text-[#202520]' aria-label={style.alt}>
                      {style.icon.default}
                    </span>
                  </button>
                ))}
                <Tooltip id='style-tooltip' effect="solid" place="bottom" />
              </div>
              <div id="options" className='flex justify-between items-center px-[20px] py-[5px] overflow-hidden'>
                {options.slice(0, 6).map(option => (
                  option.id !== 4 && (
                    <button type='button' key={option.id} data-tooltip-id='option-tooltip' data-tooltip-content={option.alt} onClick={(option.id === 5 ? () => handleUndo() : option.id === 6 ? () => handleRedo() : null)} className={`rounded p-[5px] ${((option.id === 5 && !canUndo) || (option.id === 6 && !canRedo)) ? 'opacity-[0.5] cursor-not-allowed' : 'transition duration-100 hover:bg-[#c9c9c9]'}`} disabled={(option.id === 5 && !canUndo) || (option.id === 6 && !canRedo)}>
                      <span className='text-[#202520] text-[20px]' aria-label={option.alt}>
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
          {/* <Reminder addReminder={addReminder} setAddReminder={setAddReminder} boardId={boardId} />
          <ColorPicker selectColor={selectColor} setSelectColor={setSelectColor} /> */}
        </div>
      )}
    </>
  )
}

function NotesGrid({ boardId, editNote, editNoteForm, handleArchiveNote, handleDeleteNote, setMessage }) {

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

function Notes({ boardId, boardName, message, setMessage }) {

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

export default Notes