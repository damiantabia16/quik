import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import '../custom-toolbar.css';
import "react-quill/dist/quill.snow.css";
import { useNote } from '../../../../hooks/useNote';
import { MdAddAlarm } from "react-icons/md";
import Masonry from 'react-masonry-css';
import NoteCard from '../ui-elements/NoteCard';
import Note from '../ui-elements/Note';

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

function RemindersGrid({ boardId, editNote, handleArchiveNote, handleDeleteNote, message, setMessage }) {
  const { notes, getNotes } = useNote();

  const [draggedNote, setDraggedNote] = useState(null);

  useEffect(() => {
    getNotes(boardId);
  }, [boardId]);

  const filteredNotes = notes.filter(note => note.reminder && !note.in_bin);

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
              handleArchiveNote={handleArchiveNote}
              handleDeleteNote={handleDeleteNote}
              message={message}
              setMessage={setMessage} />
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

function Reminders({ boardId, message, setMessage }) {

  const { note, setNote, getNote, getNotes, archiveNote, sendNoteToBin } = useNote();

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
    setIsMounted(false)
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
    <section id="reminders" className="pt-[12px] pl-[70px] flex flex-col flex-1 overflow-y-auto w-full">
      <Searcher />
      <RemindersGrid boardId={boardId} editNote={editNote} handleArchiveNote={handleArchiveNote} handleDeleteNote={handleDeleteNote} message={message} setMessage={setMessage} />
      <Note
        boardId={boardId}
        isMounted={isMounted}
        setIsMounted={setIsMounted}
        editNoteForm={editNoteForm}
        setEditNoteForm={setEditNoteForm}
        closeEditNote={closeEditNote}
      />
    </section>
  )
}

export default Reminders