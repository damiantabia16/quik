import { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useBoard } from "../../hooks/useBoard";
import NotesNav from "./navigate/NotesNav";
import Notes from "./content/grid/Notes";
import CreateNote from "./content/ui-elements/create-note/CreateNote";
import Message from "./content/ui-elements/popup-message/Message";
import Reminder from "./content/ui-elements/reminder/Reminder";
import ColorPicker from "./content/ui-elements/color-picker/ColorPicker";
import { options } from "./content/options";
import { Tooltip } from 'react-tooltip';
import { MdClose } from "react-icons/md";
import './notes.css';

function Grid({
    boardId,
    boardName,
    isMounted,
    setIsMounted,
    createNoteForm,
    setCreateNoteForm,
    toggleCreateNote,
    placeholder,
    setPlaceholder,
    selectedColor,
    setSelectedColor,
    isArchived,
    setIsArchived,
    selectedNotes,
    setSelectedNotes,
    resetValues,
    message,
    setMessage,
    pathname
}) {

    const isInNotes = pathname.includes('/notas');

    return (
        <>
            <Notes
                boardId={boardId}
                boardName={boardName}
                message={message}
                setMessage={setMessage}
                selectedNotes={selectedNotes}
                setSelectedNotes={setSelectedNotes} />
            {isInNotes && <CreateNote
                boardId={boardId}
                isMounted={isMounted}
                setIsMounted={setIsMounted}
                createNoteForm={createNoteForm}
                setCreateNoteForm={setCreateNoteForm}
                toggleCreateNote={toggleCreateNote}
                placeholder={placeholder}
                setPlaceholder={setPlaceholder}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                isArchived={isArchived}
                setIsArchived={setIsArchived}
                resetValues={resetValues} />}
            {isInNotes && <div role="button" onClick={toggleCreateNote} className={`add-note-button ${isMounted ? 'active' : ''}`}>+</div>}
        </>
    )
}

function Container() {

    const { getBoard } = useBoard();

    const params = useParams();

    const selector = useRef();

    const [boardId, setBoardId] = useState(null);
    const [boardName, setBoardName] = useState(null);
    const [backgroundType, setBackgroundType] = useState(null);
    const [backgroundValue, setBackgroundValue] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [createNoteForm, setCreateNoteForm] = useState(false);
    const [placeholder, setPlaceholder] = useState(true);
    const [selectedColor, setSelectedColor] = useState('#eee');
    const [isArchived, setIsArchived] = useState(false);
    const [message, setMessage] = useState('');
    const [undoPerformed, setUndoPerformed] = useState(false);
    const [selectedNotes, setSelectedNotes] = useState([]);

    useEffect(() => {
        const loadBoard = async () => {
            if (params.id) {
                const board = await getBoard(params.id);
                setBoardId(board.id);
                setBoardName(board.board_name);
                setBackgroundType(board.background_type);
                setBackgroundValue(board.background_value);
            }
        }

        loadBoard();
    }, [params.id]);

    const containerStyle = {
        backgroundImage: backgroundType === 'image' ? `url(${backgroundValue})` : 'none',
        backgroundColor: backgroundType === 'color' ? backgroundValue : 'transparent',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    };

    const resetValues = () => {
        setIsMounted(false);
        setPlaceholder(true);
        setSelectedColor('#eee');
    };

    const toggleCreateNote = () => {
        setIsMounted(true);
        if (isMounted) {
            resetValues();
        }
    };

    const { pathname } = useLocation();

    return (
        <div className="notes-container">
            <div className="notes-board-background" style={containerStyle} />
            <div ref={selector} className={`selected-notes-options ${selectedNotes.length > 0 ? 'hide' : 'display'}`}>
                <div onClick={() => setSelectedNotes([])} role="button" className="close-selected-notes-options">
                    <MdClose />
                </div>
                <span className="selected-notes-amount">{selectedNotes.length} seleccionado</span>
                <div role="toolbar" className="selected-notes-toolbar">
                    {options.map(option => {
                        if (window.location.pathname === `/tableros/${boardId}/notas`) {
                            if ([1, 2, 3, 7].includes(option.id)) {
                                return (
                                    <div
                                        role='button'
                                        data-option-id={option.id}
                                        key={option.id}
                                        data-tooltip-id='selected-notes-option-tooltip'
                                        data-tooltip-content={option.alt}
                                        className='selected-notes-toolbar-option'
                                    >
                                        {option.icon.default}
                                    </div>
                                );
                            }
                        } else if (window.location.pathname === `/tableros/${boardId}/recordatorios`) {
                            if ([1, 2, 3, 7].includes(option.id)) {
                                return (
                                    <div
                                        role='button'
                                        data-option-id={option.id}
                                        key={option.id}
                                        data-tooltip-id='selected-notes-option-tooltip'
                                        data-tooltip-content={option.alt}
                                        className='selected-notes-toolbar-option'
                                    >
                                        {option.icon.default}
                                    </div>
                                );
                            }
                        } else if (window.location.pathname === `/tableros/${boardId}/archivos`) {
                            if ([1, 2, 4, 7].includes(option.id)) {
                                return (
                                    <div
                                        role='button'
                                        data-option-id={option.id}
                                        key={option.id}
                                        data-tooltip-id='selected-notes-option-tooltip'
                                        data-tooltip-content={option.alt}
                                        className='selected-notes-toolbar-option'
                                    >
                                        {option.icon.default}
                                    </div>
                                );
                            }
                        } else if (window.location.pathname === `/tableros/${boardId}/papelera`) {
                            if ([8, 9].includes(option.id)) {
                                return (
                                    <div
                                        role='button'
                                        data-option-id={option.id}
                                        key={option.id}
                                        data-tooltip-id='selected-notes-option-tooltip'
                                        data-tooltip-content={option.alt}
                                        className='selected-notes-toolbar-option'
                                    >
                                        {option.icon.default}
                                    </div>
                                );
                            }
                        }
                        return null;
                    })}
                    <Tooltip id='selected-notes-option-tooltip' effect="solid" place="bottom" />
                </div>
            </div>
            <NotesNav boardId={boardId} />
            <Grid
                boardId={boardId}
                boardName={boardName}
                isMounted={isMounted}
                setIsMounted={setIsMounted}
                createNoteForm={createNoteForm}
                setCreateNoteForm={setCreateNoteForm}
                toggleCreateNote={toggleCreateNote}
                placeholder={placeholder}
                setPlaceholder={setPlaceholder}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedNotes={selectedNotes}
                setSelectedNotes={setSelectedNotes}
                isArchived={isArchived}
                setIsArchived={setIsArchived}
                resetValues={resetValues}
                message={message}
                setMessage={setMessage}
                pathname={pathname} />
            <Message message={message} setMessage={setMessage} undoPerformed={undoPerformed} />
        </div>
    )
}

export default Container