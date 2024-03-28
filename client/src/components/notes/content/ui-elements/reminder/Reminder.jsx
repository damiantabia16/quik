import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import { useNote } from '../../../../../hooks/useNote';
import './reminder.css'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import { MdArrowDropDown } from "react-icons/md";
import { Button } from '../../../../ui/button/Button';

export default function Reminder({ addReminder, setAddReminder, noteRef, formRef, note, boardId }) {

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
      if (formRef) {
        const newNoteCard = formRef.current.getBoundingClientRect();
        setNoteCard(newNoteCard);
      }
      if (noteRef?.current) {
        const newNoteCard = noteRef.current.getBoundingClientRect();
        setNoteCard(newNoteCard);
      }
    }

    updateNoteCardPosition();

    const handleResize = () => {
      updateNoteCardPosition();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [formRef, noteRef?.current]);

  const handleOutsideClick = (e) => {
    const isAddReminderButtonClicked =
      formRef?.current?.contains(e.target.closest("#add-note-options button[data-option-id='1']")) ||
      noteRef?.current?.contains(e.target.closest("#options button[data-option-id='1']"));
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
  }, [formRef, noteRef, setAddReminder]);

  if (!addReminder) return null;

  let addReminderPosition;
  if (formRef) {
    addReminderPosition = {
      position: 'fixed',
      bottom: '210px',
      left: noteCard ? noteCard.left + 'px' : 'auto',
      zIndex: '999',
      animation: 'displayUi 0.2s'
    }
  } else if (noteRef?.current) {
    addReminderPosition = {
      position: 'absolute',
      top: noteCard ? noteCard.bottom - 6 + 'px' : 'auto',
      left: noteCard ? noteCard.left + 'px' : 'auto',
      animation: 'displayUi 0.2s'
    }
  } else {
    return null;
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
    <div ref={reminderRef} id='add-reminder' className={`${addReminder ? 'add-reminder' : 'hidden'}`} style={addReminder ? addReminderPosition : null}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='reminder-form'>
          <div className='reminder-title'>Recordatorio:</div>
          <div className='date-container'>
            <div className='date-label'>
              <label htmlFor="date">Fecha</label>
            </div>
            <input
              type="text"
              id="date"
              value={date}
              {...register('date')}
              onChange={(e) => setDate(e.target.value)}
            />
            <div role='button' onClick={() => setDatePicker(!datePicker)}>
              <MdArrowDropDown />
            </div>
          </div>
          <div className='time-container'>
            <div className='time-label'>
              <label htmlFor="time">Hora</label>
            </div>
            <input
              type="text"
              id="time"
              value={time}
              {...register('time')}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
        <div className='set-reminder-button'>
          <Button size='sm'>Agregar</Button>
        </div>
        <Calendar className={`calendar ${datePicker ? 'visible' : 'invisible'}`} value={date} />
      </form>
    </div>,
    document.body
  )
}