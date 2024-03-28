import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import '../custom-toolbar.css';
import { useNote } from '../../../../hooks/useNote';
import Masonry from 'react-masonry-css';
import { MdAddAlarm, MdDelete } from "react-icons/md";
import { RiArchive2Fill } from "react-icons/ri";
import Note from '../ui-elements/popup-note/Note';
import NoteCard from '../ui-elements/note-card/NoteCard';
import { useLocation } from 'react-router-dom';

function Searcher({ boardName, searchTerm, setSearchTerm }) {

  const [placeholder, setPlaceholder] = useState('');

  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.includes('/notas')) {
      setPlaceholder(boardName ? boardName.toLowerCase() : '')
    } else if (pathname.includes('/recordatorios')) {
      setPlaceholder('recordatorios')
    } else if (pathname.includes('/archivos')) {
      setPlaceholder('archivos')
    }
  }, [pathname, setPlaceholder, boardName])

  const isInBin = pathname.includes('/papelera');

  if (isInBin) return null;

  return (
    <div className='searcher-container'>
      <div className='searcher'>
        <FaSearch />
        <input
          id='notes-searcher'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          placeholder={`Buscar en ${placeholder}...`}
          autoComplete='off' />
      </div>
    </div>
  )
};

function NotesGrid({ boardId, editNote, editNoteForm, selectedNotes, setSelectedNotes, handleSelectAll, allSelected, handleArchiveNote, handleUnarchiveNote, handleSendNoteToBin, handleDeleteNote, handleRestoreNote, setMessage, searchTerm, setSearchTerm }) {

  const { notes, setNotes, getNotes } = useNote();

  const [draggedNote, setDraggedNote] = useState(null);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [initialMessage, setInitialMessage] = useState('');
  const [icon, setIcon] = useState(null);
  const [lastMessage, setLastMessage] = useState('');
  const [noResultMessage, setNoResultMessage] = useState('');

  const { pathname } = useLocation();

  useEffect(() => {
    getNotes(boardId);
  }, [boardId]);

  useEffect(() => {
    let filtered = [];
    let initial = '';
    let icon = null;
    let last = '';
    let noResultMessage = '';

    if (searchTerm.trim() !== '') {
      if (pathname.includes('/notas')) {
        filtered = notes.filter(note =>
          !note.is_archived &&
          !note.in_bin &&
          (note.note_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.note_content.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      } else if (pathname.includes('/recordatorios')) {
        filtered = notes.filter(note =>
          note.reminder &&
          !note.in_bin &&
          (note.note_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.note_content.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      } else if (pathname.includes('/archivos')) {
        filtered = notes.filter(note =>
          note.is_archived &&
          !note.in_bin &&
          (note.note_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            note.note_content.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
    } else {
      if (pathname.includes('/notas')) {
        filtered = notes.filter(note => !note.is_archived && !note.in_bin);
        initial = 'Aún no tienes ninguna nota';
        icon = '+';
        last = 'en el costado inferior derecho para crear una.';
      } else if (pathname.includes('/recordatorios')) {
        filtered = notes.filter(note => note.reminder && !note.in_bin);
        initial = 'Parece que tienes buena memoria';
        icon = <MdAddAlarm />;
        last = 'para añadir un recordatorio.';
      } else if (pathname.includes('/archivos')) {
        filtered = notes.filter(note => note.is_archived && !note.in_bin);
        initial = 'Nada que ocultar por aquí';
        icon = <RiArchive2Fill />;
        last = 'para archivar una nota.';
      } else if (pathname.includes('/papelera')) {
        filtered = notes.filter(note => note.in_bin);
        initial = 'Aún no eliminaste ninguna nota';
        icon = <MdDelete />;
        last = 'para eliminar una nota.';
      }
    }

    if (filtered.length === 0) {
      noResultMessage = 'No se ha encontrado ninguna nota';
    }

    setFilteredNotes(filtered);
    setInitialMessage(initial);
    setIcon(icon);
    setLastMessage(last);
    setNoResultMessage(noResultMessage);
  }, [notes, pathname, searchTerm]);

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
    <div className='notes-board-grid-container'>
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
              selectedNotes={selectedNotes}
              setSelectedNotes={setSelectedNotes}
              handleSelectAll={handleSelectAll}
              allSelected={allSelected}
              handleArchiveNote={handleArchiveNote}
              handleUnarchiveNote={handleUnarchiveNote}
              handleSendNoteToBin={handleSendNoteToBin}
              handleDeleteNote={handleDeleteNote}
              handleRestoreNote={handleRestoreNote}
              setMessage={setMessage}
              searchTerm={searchTerm} />
          ))}
        </Masonry>
      ) : (
        <div className='empty-notes-board-container'>
          <div className='empty-notes-board-dialog add-note-blur'>
            <p className={`empty-notes-board-dialog-initial ${initialMessage ? 'initial' : ''}`}>
              {initialMessage || noResultMessage}
            </p>
            {initialMessage && (
              <p>
                <span className='empty-notes-board-dialog-span'>
                  Haz click en el botón
                  <span className='empty-notes-board-icon'>
                    {icon}
                  </span>
                  {lastMessage}
                </span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function Notes({ boardId, boardName, setMessage, selectedNotes, setSelectedNotes, handleSelectAll, allSelected }) {

  const { getNote, getNotes, archiveNote, unarchiveNote, sendNoteToBin, deleteNote, restoreNote } = useNote();

  const [editNoteForm, setEditNoteForm] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

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

  const handleUnarchiveNote = async (noteId) => {
    try {
      await unarchiveNote(boardId, { id: noteId });
      getNotes(boardId);
    } catch (error) {
      console.error('Error al archivar la nota:', error);
    }
  };

  const handleSendNoteToBin = async (noteId) => {
    try {
      await sendNoteToBin(boardId, { id: noteId });
      getNotes(boardId);
    } catch (error) {
      console.error('Error al archivar la nota:', error);
    }
  };

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

  return (
    <>
      <section id="notes">
        <Searcher
          boardName={boardName}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm} />
        <NotesGrid
          boardId={boardId}
          editNote={editNote}
          editNoteForm={editNoteForm}
          selectedNotes={selectedNotes}
          setSelectedNotes={setSelectedNotes}
          handleSelectAll={handleSelectAll}
          allSelected={allSelected}
          handleArchiveNote={handleArchiveNote}
          handleUnarchiveNote={handleUnarchiveNote}
          handleSendNoteToBin={handleSendNoteToBin}
          handleDeleteNote={handleDeleteNote}
          handleRestoreNote={handleRestoreNote}
          setMessage={setMessage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm} />
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