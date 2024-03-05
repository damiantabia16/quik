import { useEffect } from 'react';
import "react-quill/dist/quill.snow.css";
import { useNote } from '../../../../hooks/useNote';
import { MdDelete } from 'react-icons/md';
import Masonry from 'react-masonry-css';
import NoteCard from '../ui-elements/NoteCard';

function BinGrid({ boardId, handleDeleteNote, handleRestoreNote, message, setMessage }) {
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
            <NoteCard key={note.id} id={note.id} note={note} boardId={boardId} handleDeleteNote={handleDeleteNote} handleRestoreNote={handleRestoreNote} message={message} setMessage={setMessage} />
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

function Bin({ boardId, message, setMessage }) {

  const { note, setNote, getNotes, deleteNote, restoreNote } = useNote();

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(boardId, { id: noteId });
      setMessage('Nota eliminada');
      setTimeout(() => {
        setMessage('');
      }, 7000);
      getNotes(boardId);
    } catch (error) {
      console.error('Error al eliminar definitivamente la nota:', error);
    }
  };

  const handleRestoreNote = async (noteId) => {
    try {
      await restoreNote(boardId, { id: noteId });
      setMessage('Nota restaurada');
      setTimeout(() => {
        setMessage('');
      }, 7000);
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
      <BinGrid boardId={boardId} handleDeleteNote={handleDeleteNote} handleRestoreNote={handleRestoreNote} message={message} setMessage={setMessage} />
    </section>
  )
}

export default Bin;