import ReactDOM from 'react-dom';
import { useEffect } from 'react';
import { MdClose } from 'react-icons/md'
import { useNote } from '../../../../../hooks/useNote';
import './message.css';

export default function Message({ message, setMessage, undoPerformed }) {

    if (!message) return null;

    return ReactDOM.createPortal(
        <div className='message'>
            <div className='message-dialog'>
                {message}
            </div>
            {!undoPerformed && (
                <div role='button' className='undo-button'>
                    DESHACER
                </div>
            )}
            <button onClick={() => setMessage('')} type='button' className='close-message'>
                <MdClose />
            </button>
        </div>,
        document.body
    )
}