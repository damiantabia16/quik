import { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import { Tooltip } from 'react-tooltip';
import { options } from '../options';
import { styles } from '../styles';
import '../custom-toolbar.css';
import "react-quill/dist/quill.snow.css";
import { useNote } from '../../../../hooks/useNote';
import { MdOutlineWatchLater, MdClose } from "react-icons/md";
import Reminder from '../ui-elements/Reminder';
import ColorPicker from '../ui-elements/ColorPicker';
import useUndoRedo from '../../../../hooks/useUndoRedo';

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
                    <div className={`fixed w-screen h-screen top-0 bottom-0 left-0 right-0 bg-[#00000070] overflow-hidden transition-opacity duration-100`} style={isMounted ? mountedStyle : unmountedStyle} />
                    <section className='fixed px-[20px] min-[480px]:px-0 flex justify-center items-center w-full h-full left-0 right-0 bottom-0 top-0 transition-opacity duration-100' style={isMounted ? mountedStyle : unmountedStyle}>
                        <div ref={noteRef} className={`w-[325px] rounded close-shadow ${note.background_color === 'transparent' ? 'bg-[#eee]' : ''}`} style={{ backgroundColor: backgroundColor }}>
                            <div>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className='p-[20px]'>
                                        <input type="text" {...register('note_title')} placeholder={note.note_title ? '' : 'Título'} autoComplete='off' className='text-[#202520] outline-none w-full overflow-none whitespace-normal bg-transparent' />
                                    </div>
                                    {/* <ReactQuill theme='snow' formats={formats} modules={modules} value={note.note_content} onChange={(value) => setValue('note_content', value)} /> */}
                                    <div className={`${placeholder && !state ? 'absolute w-full text-[#a9a9a9] pointer-events-none px-[20px] py-[10px]' : 'hidden'}`}>
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
                                            <button type='button' key={style.id} onClick={() => handleStyles(style.id)} className={`rounded p-[5px] transition-all duration-200 hover:bg-[#c9c9c9]`}>
                                                <span className='text-[#202520]' aria-label={style.alt} data-tooltip-id='style-tooltip' data-tooltip-content={style.alt}>
                                                    {style.icon.default}
                                                </span>
                                            </button>
                                        ))}
                                        <Tooltip id='style-tooltip' effect="solid" place="bottom" />
                                    </div>
                                    <div id="options" className='flex justify-between items-center p-[20px]'>
                                        {options
                                            .filter(option => option.id === 5 || option.id === 6)
                                            .map(option => (
                                                <button type='button' key={option.id} onClick={(option.id === 5 ? () => undo() : option.id === 6 ? () => redo() : null)} className={`rounded p-[5px] ${((option.id === 5 && !canUndo) || (option.id === 6 && !canRedo)) ? 'opacity-[0.5] cursor-not-allowed' : 'transition duration-100 hover:bg-[#c9c9c9]'}`} disabled={(option.id === 5 && !canUndo) || (option.id === 6 && !canRedo)}>
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
            )}
        </>,
        document.body
    )
}