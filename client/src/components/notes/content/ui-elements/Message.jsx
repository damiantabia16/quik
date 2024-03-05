import ReactDOM from 'react-dom';
import { MdClose } from 'react-icons/md'
import { useNote } from '../../../../hooks/useNote';

export default function Message({ message, setMessage, undoPerformed }) {

    if (!message) return null;

    return ReactDOM.createPortal(
        <div className={`fixed flex items-center justify-between w-[512px] bottom-0 left-0 bg-[#202520] p-[20px] mx-[10px] mb-[10px] rounded-md transition-transform duration-500 ${message ? 'translate-y-0 visible' : '-translate-y-full invisible'}`}>
            <div className='flex-[1_1_auto]'>
                {message}
            </div>
            {!undoPerformed && (
                <div role='button' className='text-[#98ff98] py-[8px] px-[24px] rounded transition duration-200 hover:bg-[#404540]'>
                    DESHACER
                </div>
            )}
            <button onClick={() => setMessage('')} type='button' className='w-[24px] h-[24px] hover:bg-[#404540] rounded-full ml-[5px]'>
                <MdClose className='m-auto' />
            </button>
        </div>,
        document.body
    )
}