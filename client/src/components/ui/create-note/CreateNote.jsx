import ReactDOM from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { useNote } from '../../../hooks/useNote';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import useUndoRedo from '../../../hooks/useUndoRedo';
import useTextEditor from '../../../hooks/useTextEditor';
import { Tooltip } from 'react-tooltip';
import { options } from '../../notes/content/options';
import { styles } from '../../notes/content/styles';
import './create-note.css';
import { Button } from '../button/Button';
import Reminder from '../reminder/Reminder';
import ColorPicker from '../color-picker/ColorPicker';
import ContentEditable from 'react-contenteditable';
import ReminderDate from '../reminder-date/ReminderDate';
import { MdOutlineWatchLater, MdClose } from "react-icons/md";

export default function CreateNote({
    boardId,
    isMounted,
    createNoteForm,
    setCreateNoteForm,
    toggleCreateNote,
    placeholder,
    setPlaceholder,
    selectedColor,
    setSelectedColor,
    noteReminder,
    setNoteReminder,
    isArchived,
    setIsArchived,
    resetValues,
    setMessage
}) {

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

    const location = useLocation();

    const { createNote, getNotes } = useNote();

    const { register, handleSubmit, reset, getValues } = useForm();

    const [addReminder, setAddReminder] = useState(false);
    const [selectColor, setSelectColor] = useState(false);

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

    const mountedStyle = { backgroundColor: selectedColor, transition: 'all 0.2s ease', animation: 'translateInAnimation 0.2s' }
    const unmountedStyle = { animation: 'translateOutAnimation 0.2s', animationFillMode: "forwards" }

    const canUndo = index > 0;
    const canRedo = index < lastIndex;

    let formRef = useRef(null);

    const handleResetValues = () => {
        resetValues();
        reset();
        handleReset(init);
    }

    useEffect(() => {
        if (!isMounted) {
            handleReset(init);
            reset();
        }
    }, [toggleCreateNote]);

    useEffect(() => {
        handleResetValues();
    }, [location.pathname]);

    const { handleStyles } = useTextEditor();

    const editorRef = useRef(null);

    const handleContentChange = (e) => {
        const text = e.target.value;
        setState(text);
        setPlaceholder(text.length === 0 ? true : false);
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
        } else if (optionId === 3) {
            setIsArchived(true);
        } else if (optionId === 5) {
            handleUndo();
        } else if (optionId === 6) {
            handleRedo();
        }
    }

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

    const handlePickColor = (color) => {
        setSelectedColor(color);
    }

    const onSubmit = async (data) => {
        try {
            data.note_content = state;
            data.background_color = selectedColor;
            data.reminder = noteReminder;
            await createNote(boardId, data);
            handleResetValues();
            getNotes(boardId);
        } catch (error) {
            console.error('Error al crear la nota:', error);
        }
    }

    useEffect(() => {
        if (isArchived) {
            onSubmit({
                is_archived: true,
                note_title: getValues("note_title"),
                note_content: state,
                background_color: selectedColor
            })
            setIsArchived(false);
        }
    }, [isArchived])

    if (!createNoteForm) return null;

    return ReactDOM.createPortal(
        <div className='add-note-form-overlay close-shadow' style={isMounted ? mountedStyle : unmountedStyle}>
            <section ref={formRef} className='add-note-form-container'>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='title-container'>
                        <input id='title' type="text" placeholder='Título' autoComplete='off' {...register('note_title')} />
                    </div>
                    <div className={`${placeholder ? 'editor-placeholder' : 'hidden'}`}>
                        Escribe tu nota aquí...
                    </div>
                    <ContentEditable
                        id='editor'
                        innerRef={editorRef}
                        html={state}
                        onChange={handleContentChange}
                        tagName='div'
                        aria-multiline
                        tabIndex={0}
                        role='textbox'
                        spellCheck
                    />
                    {noteReminder && (
                        <ReminderDate noteReminder={noteReminder} setNoteReminder={setNoteReminder} />
                    )}
                    <div id='styles'>
                        {styles.map(style => (
                            <button
                                type='button'
                                key={style.id}
                                data-tooltip-id='style-tooltip'
                                data-tooltip-content={style.alt}
                                onClick={() => handleStyles(style.id)}
                                className='styles-button'>
                                <span aria-label={style.alt}>
                                    {style.icon.default}
                                </span>
                            </button>
                        ))}
                        <Tooltip id='style-tooltip' effect="solid" place="bottom" />
                    </div>
                    <div id="add-note-options">
                        {options.slice(0, 6).map(option => (
                            option.id !== 4 && (
                                <button type='button' data-option-id={option.id} key={option.id} data-tooltip-id='option-tooltip' data-tooltip-content={option.alt} onClick={() => handleOptions(option.id)} className={`options-button ${((option.id === 5 && !canUndo) || (option.id === 6 && !canRedo)) ? 'disabled' : ''}`} disabled={(option.id === 5 && !canUndo) || (option.id === 6 && !canRedo)}>
                                    <span aria-label={option.alt}>
                                        {option.icon.default}
                                    </span>
                                </button>
                            )
                        ))}
                        <Tooltip id='option-tooltip' effect="solid" place="bottom" />
                    </div>
                    <div id='add-note-button'>
                        <Button size='md'>AGREGAR NOTA</Button>
                    </div>
                </form>
            </section>
            <Reminder addReminder={addReminder} setAddReminder={setAddReminder} boardId={boardId} formRef={formRef} setNoteReminder={setNoteReminder} setMessage={setMessage} />
            <ColorPicker selectColor={selectColor} setSelectColor={setSelectColor} formRef={formRef} handlePickColor={handlePickColor} />
        </div>,
        document.body
    )
}