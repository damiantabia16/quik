import { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { MdOutlineWatchLater, MdClose } from "react-icons/md";
import './reminder-date.css'

function ReminderDate({ noteCardReminder, noteReminder, setNoteReminder, handleDeleteReminder, }) {

    const [dateHover, setDateHover] = useState(false);

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

    const deleteReminder = (e) => {
        e.stopPropagation();
        if (noteCardReminder) {
            handleDeleteReminder();
        } else if (noteReminder) {
            setNoteReminder(false);
        }
    }

    return (
        <div
            role='button'
            className={`${noteCardReminder ? 'note-reminder' : 'create-note-reminder'}`}
            onMouseEnter={() => setDateHover(true)}
            onMouseLeave={() => setDateHover(false)}>
            <MdOutlineWatchLater className='watch' />
            <span>
                {formatReminderDate(noteCardReminder ? noteCardReminder : noteReminder)}
            </span>
            {dateHover ? (
                <>
                    <div role='button' onClick={deleteReminder} className='delete-reminder option-hover'>
                        <MdClose data-tooltip-id='delete-reminder-tooltip' data-tooltip-content='Eliminar recordatorio' />
                    </div>
                    <Tooltip id='delete-reminder-tooltip' effect="solid" place="bottom" />
                </>
            ) : ('')}
        </div>
    )
}

export default ReminderDate