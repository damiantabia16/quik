import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import { useNote } from '../../../../hooks/useNote';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { MdArrowDropDown } from "react-icons/md";

export default function Reminder({ addReminder, setAddReminder, noteRef, note, boardId }) {

  const reminderRef = useRef(null);
  const [noteCard, setNoteCard] = useState(null);
  const [datePicker, setDatePicker] = useState(false);

  const { register, handleSubmit } = useForm();

  const dateOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  const timeOptions = {
    hour: 'numeric',
    minute: 'numeric'
  }

  const [date, setDate] = useState(new Date().toLocaleDateString('es-ES', dateOptions));
  const [time, setTime] = useState(new Date().toLocaleTimeString('es-ES', timeOptions));

  const { getNotes, setReminder } = useNote();

  useEffect(() => {
    function updateNoteCardPosition() {
      if (noteRef.current) {
        const newNoteCard = noteRef.current.getBoundingClientRect();
        setNoteCard(newNoteCard);
      }
    }

    updateNoteCardPosition();

    window.addEventListener('resize', updateNoteCardPosition);

    return () => {
      window.removeEventListener('resize', updateNoteCardPosition);
    };
  }, [noteRef.current]);

  const handleOutsideClick = (e) => {
    const isAddReminderButtonClicked = noteRef.current.contains(e.target.closest("#options button[data-option-id='1']"));
    const clickedOutsideReminder = reminderRef.current && !reminderRef.current.contains(e.target);
    if (!isAddReminderButtonClicked && clickedOutsideReminder) {
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
  const ADD_REMINDER_DISPLAY = {
    top: noteCard ? noteCard.bottom + - 6 + 'px' : 'auto',
    left: noteCard ? noteCard.left + 'px' : 'auto',
    animation: 'displayUi 0.2s',
  };
  const ADD_REMINDER_HIDE = {
    animation: 'hideUi 0.2s',
    animationFillMode: 'forwards'
  }

  const onSubmit = async (data) => {
    try {
      const dateTime = data.date && data.time ? moment(`${data.date} ${data.time}`).format('YYYY-MM-DD HH:mm:ss') : null;
      if (dateTime) {
        await setReminder(boardId, { ...note, reminder: dateTime });
        getNotes(boardId);
      }
      setAddReminder(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (!addReminder) return null;

  return ReactDOM.createPortal(
    <div ref={reminderRef} id='add-reminder' className={`${addReminder ? 'absolute p-[20px] mr-[20px] rounded bg-[#eee]' : 'hidden'}`} style={addReminder ? ADD_REMINDER_DISPLAY : ADD_REMINDER_HIDE}>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col items-start'>
        <div className='mb-[8px] relative w-full'>
          <div>
            <label htmlFor='reminder' className='text-[#202520] font-medium'>Recordatorio:</label>
          </div>
          <div className='mt-[15px]'>
            <div>
              <label htmlFor="date" className='text-[#202520] text-[14px]'>Fecha</label>
            </div>
            <input
              type="text"
              id="date"
              value={date}
              {...register('date')}
              onChange={(e) => setDate(e.target.value)}
              className='w-full text-[#202520] bg-[#eee] text-[14px] outline-none border border-b-solid bottom-color'
            />
            <div role='button' onClick={() => setDatePicker(!datePicker)} className='absolute inline-block right-0 w-[24px] h-[24px]'>
              <MdArrowDropDown className='text-[#202520] text-[18px] m-auto' />
            </div>
          </div>
          <div className='mt-[15px]'>
            <div>
              <label htmlFor="time" className='text-[#202520] text-[14px]'>Hora</label>
            </div>
            <input
              type="text"
              id="time"
              value={time}
              {...register('time')}
              onChange={(e) => setTime(e.target.value)}
              className='w-full text-[#202520] bg-[#eee] text-[14px] outline-none border border-b-solid bottom-color'
            />
          </div>
        </div>
        <div className='mt-[15px] mb-[7px]'>
          <button type='submit' className='px-[7px] py-[3px] text-[14px] text-[#202524] bg-[#98ff98] rounded-md font-medium transition duration-150 hover:bg-[#78ff78]'>Agregar</button>
        </div>
        <Calendar className={`text-[#202520] absolute top-[92px] left-0 right-0 scale-90 ${datePicker ? 'visible' : 'invisible'}`} value={date} />
      </form>
    </div>,
    document.body
  )
}