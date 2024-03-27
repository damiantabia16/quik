import ReactDOM from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { useNote } from '../../../../../hooks/useNote';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import useUndoRedo from '../../../../../hooks/useUndoRedo';
import { Tooltip } from 'react-tooltip';
import { options } from '../../options';
import { styles } from '../../styles';
import './create-note.css';
import '../../custom-toolbar.css';
import { Button } from '../../../../ui/button/Button';
import Reminder from '../reminder/Reminder';
import ColorPicker from '../color-picker/ColorPicker';

export default function CreateNote({ boardId, isMounted, createNoteForm, setCreateNoteForm, toggleCreateNote, placeholder, setPlaceholder, selectedColor, setSelectedColor, isArchived, setIsArchived, resetValues }) {

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

    const [reminder, setReminder] = useState(null);

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
        } else if (optionId === 3) {
            setIsArchived(true);
        } else if (optionId === 5) {
            handleUndo();
        } else if (optionId === 6) {
            handleRedo();
        }
    }

    const handlePickColor = (color) => {
        setSelectedColor(color);
    }

    const onSubmit = async (data) => {
        try {
            data.note_content = state
            data.background_color = selectedColor;
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
                background_color: selectedColor })
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
                    <div
                        id='editor'
                        ref={editorRef}
                        contentEditable={true}
                        aria-multiline
                        tabIndex={0}
                        role='textbox'
                        dangerouslySetInnerHTML={{ __html: state }}
                        onInput={handleContentChange}
                        spellCheck
                    />
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
            <Reminder addReminder={addReminder} setAddReminder={setAddReminder} boardId={boardId} formRef={formRef} />
            <ColorPicker selectColor={selectColor} setSelectColor={setSelectColor} formRef={formRef} selectedColor={selectedColor} setSelectedColor={setSelectedColor} handlePickColor={handlePickColor} />
        </div>,
        document.body
    )
}