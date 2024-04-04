import { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import { Tooltip } from 'react-tooltip';
import { options } from '../../notes/content/options';
import { styles } from '../../notes/content/styles';
import './note.css';
import { useNote } from '../../../hooks/useNote';
import { Button } from '../button/Button';
import useUndoRedo from '../../../hooks/useUndoRedo';
import useTextEditor from '../../../hooks/useTextEditor';
import ContentEditable from 'react-contenteditable';

export default function Note({ boardId, isMounted, setIsMounted, editNoteForm, setEditNoteForm, closeEditNote, handleArchiveNote, handleDeleteNote }) {

    const { note, updateNote, getNotes } = useNote();

    const { register, handleSubmit, setValue } = useForm();

    useEffect(() => {
        if (note) {
            setValue('note_title', note.note_title);
            setValue('note_content', note.note_content);
            if (note.background_color === 'transparent') {
                setBackgroundColor('#eee');
            } else {
                setBackgroundColor(note.background_color);
            }
        }
    }, [note]);

    const init = note ? note.note_content : null;

    const {
        state,
        setState,
        states,
        index,
        lastIndex,
        handleUndo,
        handleRedo
    } = useUndoRedo(init);

    useEffect(() => {
        if (state !== init) {
            setState(init);
        }
    }, [init]);

    const { handleStyles } = useTextEditor();

    const [backgroundColor, setBackgroundColor] = useState(null);
    const [placeholder, setPlaceholder] = useState(true);

    const canUndo = index > 0 && state !== init;
    const canRedo = index < lastIndex;

    const noteRef = useRef(null);

    const editorRef = useRef(null);

    useEffect(() => {
        let timeoutId;

        if (isMounted && !editNoteForm) {
            setEditNoteForm(true);
        } else if (!isMounted && editNoteForm) {
            timeoutId = setTimeout(() => {
                setEditNoteForm(false);
            }, 100)
        }
        return () => clearTimeout(timeoutId);
    }, [isMounted, editNoteForm]);

    const handleOutsideClick = (e) => {
        if (noteRef.current && !noteRef.current.contains(e.target)) {
            setIsMounted(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [setIsMounted]);

    const mountedStyle = { animation: 'inAnimation 0.2s' }
    const unmountedStyle = { animation: 'outAnimation 0.2s', animationFillMode: "forwards" }

    const handleContentChange = () => {
        const editorContent = editorRef.current.innerHTML;
        setValue('note_content', editorContent);
        setState(editorContent);
        setPlaceholder(editorContent.length === 0);
    };

    const undo = () => {
        setValue('note_content', states[Math.max(0, index - 1)]);
        handleUndo();
    };

    const redo = () => {
        setValue('note_content', states[Math.min(states.length - 1, index + 1)]);
        handleRedo();
    };

    const onSubmit = async (data) => {
        try {
            await updateNote(boardId, { ...note, ...data });
            closeEditNote();
            getNotes(boardId);
        } catch (error) {
            console.error('Error al actualizar la nota:', error);
        }
    }

    if (!editNoteForm) return null;

    return ReactDOM.createPortal(
        <>
            {editNoteForm && (
                <>
                    <div className='overlay' style={isMounted ? mountedStyle : unmountedStyle} />
                    <section className='note-box box' style={isMounted ? mountedStyle : unmountedStyle}>
                        <div ref={noteRef} className={`note-container close-shadow ${note.background_color === 'transparent' ? 'conditional-background' : ''}`} style={{ backgroundColor: backgroundColor }}>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className='note-title-container'>
                                    <input type="text" {...register('note_title')} placeholder={note.note_title ? '' : 'Título'} autoComplete='off' />
                                </div>
                                <div className={`${placeholder && !state ? 'editor-placeholder' : 'hidden'}`}>
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
                                <div id='styles'>
                                    {styles.map(style => (
                                        <button
                                            type='button'
                                            key={style.id}
                                            onClick={() => handleStyles(style.id)}
                                            className='styles-button'>
                                            <span aria-label={style.alt} data-tooltip-id='style-tooltip' data-tooltip-content={style.alt}>
                                                {style.icon.default}
                                            </span>
                                        </button>
                                    ))}
                                    <Tooltip id='style-tooltip' effect="solid" place="bottom" />
                                </div>
                                <div id="note-options">
                                    {options
                                        .filter(option => option.id === 5 || option.id === 6)
                                        .map(option => (
                                            <button
                                                type='button'
                                                key={option.id}
                                                onClick={(option.id === 5 ? () => undo() : option.id === 6 ? () => redo() : null)}
                                                className={`options-button ${((option.id === 5 && !canUndo) || (option.id === 6 && !canRedo)) ? 'disabled' : ''}`} disabled={(option.id === 5 && !canUndo) || (option.id === 6 && !canRedo)}>
                                                <span
                                                    aria-label={option.alt}
                                                    data-tooltip-id='option-tooltip'
                                                    data-tooltip-content={option.alt}>
                                                    {option.icon.default}
                                                </span>
                                            </button>
                                        ))}
                                    <Tooltip id='option-tooltip' effect="solid" place="bottom" />
                                    <Button variant='transparent'>Guardar</Button>
                                </div>
                            </form>
                        </div>
                    </section>
                </>
            )}
        </>,
        document.body
    )
}