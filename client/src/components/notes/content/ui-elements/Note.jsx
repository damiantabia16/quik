import { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import ReactQuill, { Quill } from 'react-quill';
import { Tooltip } from 'react-tooltip';
import { options } from '../options';
import '../custom-toolbar.css';
import "react-quill/dist/quill.snow.css";
import { useNote } from '../../../../hooks/useNote';
import { MdOutlineWatchLater, MdClose } from "react-icons/md";
import Reminder from '../ui-elements/Reminder';
import ColorPicker from '../ui-elements/ColorPicker';

export default function Note({ boardId, isMounted, setIsMounted, editNoteForm, setEditNoteForm, closeEditNote, handleArchiveNote, handleDeleteNote }) {

    const { note, updateNote, getNotes } = useNote();

    const { register, handleSubmit, setValue } = useForm();

    const [addReminder, setAddReminder] = useState(false);
    const [selectColor, setSelectColor] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [message, setMessage] = useState('');
    const [pickedColor, setPickedColor] = useState(note ? note.background_color : null);
    const [backgroundColor, setBackgroundColor] = useState(null);

    const noteRef = useRef(null);

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }]
        ],
    };

    const formats = [
        'bold', 'italic', 'underline', 'strike', 'color', 'background',
        'list', 'bullet'
    ];

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
                                    <ReactQuill theme='snow' formats={formats} modules={modules} value={note.note_content} onChange={(value) => setValue('note_content', value)} />
                                    <div className='flex justify-end p-[20px]'>
                                        <button type='submit' className='text-[#202520] py-[8px] px-[24px] transition duration-200 hover:bg-[#98ff98] rounded-md font-medium'>Guardar</button>
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