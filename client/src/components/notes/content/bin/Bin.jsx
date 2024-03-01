import { useState, useEffect } from 'react';
import ConfirmDelete from '../ui-elements/ConfirmDelete';
import { Tooltip } from 'react-tooltip';
import { options } from '../options';
import '../custom-toolbar.css';
import "react-quill/dist/quill.snow.css";
import { useNote } from '../../../../hooks/useNote';
import { MdDelete } from 'react-icons/md';
import Parser from 'html-react-parser';
import Masonry from 'react-masonry-css';

function NoteCard({ note, handleDeleteNote, handleRestoreNote }) {

  const [hover, setHover] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const truncateText = (text, maxLength) => {
    const truncatedText = text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
    return Parser(truncatedText);
  };

  const handleButtonClick = (optionId) => {
    if (optionId === 8) {
      setConfirmDelete(true)
    } else if (optionId === 9) {
      setIsFadingOut(true);
      setTimeout(() => {
        handleRestoreNote(note.id);
      }, 200)
    }
  };

  const handleConfirmDelete = () => {
    handleDeleteNote(note.id);
  }

  const handleCancelDelete = () => {
    setConfirmDelete(false)
  }

  return (
    <div className='select-none mb-[8px] px-[10px]'>
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`relative text-[#202520] rounded draggable-note
        ${isFadingOut ? 'fade-out' : 'opacity-transition'}`}
        style={{ backgroundColor: note.background_color }}>
        <div className='min-h-[60px]'>
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
        <div id="options" className={`flex justify-end items-center p-[15px] ${hover ? 'visible opacity-100' : 'invisible opacity-0'} transition duration-150`}>
          {options.map(option => (
            (option.id !== 1 && option.id !== 2 && option.id !== 3 && option.id !== 4 && option.id !== 5 && option.id !== 6 && option.id !== 7) && (
              <button key={option.id} onClick={() => handleButtonClick(option.id)}>
                <span className='text-[#202520] text-[20px]' aria-label={option.alt} data-tooltip-id='option-tooltip' data-tooltip-content={option.alt}>
                  {option.icon.default}
                </span>
              </button>
            )
          ))}
          <Tooltip id='option-tooltip' effect="solid" place="bottom" />
        </div>
      </div>
      <ConfirmDelete confirmDelete={confirmDelete} handleConfirmDelete={handleConfirmDelete} handleCancelDelete={handleCancelDelete} />
    </div>
  )
}

function BinGrid({ boardId, handleDeleteNote, handleRestoreNote }) {
  const { notes, getNotes } = useNote();

  useEffect(() => {
    getNotes(boardId);
  }, [boardId]);

  const filteredNotes = notes.filter(note => note.in_bin);

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
            <NoteCard key={note.id} id={note.id} note={note} handleDeleteNote={handleDeleteNote} handleRestoreNote={handleRestoreNote} />
          ))}
        </Masonry>
      ) : (
        <div className='p-[20px] w-full h-full m-auto flex flex-col items-center justify-center'>
          <div className='cursor-default add-note-blur rounded p-[20px] text-center'>
            <p className='text-[35px] mb-[10px]'>
              Aún no eliminaste ninguna nota.
            </p>
            <p>
              <span className='flex items-center justify-center'>
                Haz click en el botón
                <span className='bg-[#98ff98] mx-[5px] select-none text-[#202520] rounded-full w-[20px] h-[20px] inline-flex text-center justify-center items-center font-semibold'>
                  <MdDelete />
                </span>
                para eliminar una nota.
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function Bin({ boardId }) {

  const { note, setNote, getNotes, deleteNote, restoreNote } = useNote();

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(boardId, { id: noteId });
      getNotes(boardId);
    } catch (error) {
      console.error('Error al eliminar definitivamente la nota:', error);
    }
  }

  const handleRestoreNote = async (noteId) => {
    try {
      await restoreNote(boardId, { id: noteId });
      getNotes(boardId);
    } catch (error) {
      console.error('Error al restaurar la nota:', error);
    }
  };

  useEffect(() => {
    setNote(note);
  }, [note]);

  return (
    <section id="archives" className="pt-[12px] pl-[70px] flex flex-col flex-1 overflow-y-auto w-full">
      <BinGrid boardId={boardId} handleDeleteNote={handleDeleteNote} handleRestoreNote={handleRestoreNote} />
    </section>
  )
}

export default Bin;