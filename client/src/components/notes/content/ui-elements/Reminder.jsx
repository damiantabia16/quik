import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import { useNote } from '../../../../hooks/useNote';

export default function Reminder({ addReminder, setAddReminder, noteRef, note, boardId }) {

  const { register, handleSubmit } = useForm();

  const { getNotes, setReminder } = useNote();

  const reminderRef = useRef(null);

  const handleOutsideClick = (e) => {
    const isAddReminderButtonClicked = noteRef.current.contains(e.target.closest("#options button[data-option-id='1']"));
    if (!isAddReminderButtonClicked && reminderRef.current && !reminderRef.current.contains(e.target)) {
      setAddReminder(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [setAddReminder]);

  if (!noteRef.current) return null;
  const noteCard = noteRef.current.getBoundingClientRect();
  const ADD_REMINDER_DISPLAY = {
    top: noteCard.bottom - 6 + 'px',
    left: noteCard.left + 'px',
    animation: 'displayUi 0.2s',
  };
  const ADD_REMINDER_HIDE = {
    animation: 'hideUi 0.2s',
    animationFillMode: 'forwards'
  }

  const onSubmit = async (data) => {
    try {
      await setReminder(boardId, { ...note, ...data });
      setAddReminder(false);
      getNotes(boardId);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  if (!addReminder) return null;

  return ReactDOM.createPortal(
    <div ref={reminderRef} id='add-reminder' className={`${addReminder ? 'absolute p-[10px] rounded bg-[#eee]' : 'hidden'}`} style={addReminder ? ADD_REMINDER_DISPLAY : ADD_REMINDER_HIDE}>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-start'>
        <div className='mb-[8px]'>
          <div>
            <label htmlFor='reminder' className='text-[#202520] text-[14px]'>Recordatorio:</label>
          </div>
          <input type='datetime-local' id='reminder' className='text-[#202520] text-[14px] outline-none' {...register('reminder')} />
        </div>
        <div>
          <button type='submit' className='px-[7px] py-[3px] text-[14px] text-[#202524] bg-[#98ff98] rounded-md font-medium transition duration-150 hover:bg-[#78ff78]'>Agregar</button>
        </div>
      </form>
    </div>,
    document.body
  )
}