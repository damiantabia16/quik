import NotesNav from "./navigate/NotesNav";
import NotesContent, { CreateNote } from "./content/NContent";
import { useBoard } from "../../hooks/useBoard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Container() {

    const { getBoard } = useBoard();

    const params = useParams();

    const [boardId, setBoardId] = useState(null);
    const [boardName, setBoardName] = useState(null);
    const [backgroundType, setBackgroundType] = useState(null);
    const [backgroundValue, setBackgroundValue] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [createNoteForm, setCreateNoteForm] = useState(false);
    const [content, setContent] = useState('');

    useEffect(() => {
        const loadBoard = async () => {
            if (params.id) {
                const board = await getBoard(params.id);
                setBoardId(board.id);
                setBoardName(board.board_name);
                setBackgroundType(board.background_type);
                setBackgroundValue(board.background_value);
            }
        }

        loadBoard();
    }, [params.id]);

    const containerStyle = {
        backgroundImage: backgroundType === 'image' ? `url(${backgroundValue})` : 'none',
        backgroundColor: backgroundType === 'color' ? backgroundValue : 'transparent',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    };

    const toggleCreateNote = () => {
        setIsMounted(!isMounted);
        if (isMounted === false) {
            setContent('')
        }
    };

    return (
        <div className="relative flex flex-row">
            <div className="fixed w-full h-screen z-[-1]" style={containerStyle} />
            <NotesNav />
            <NotesContent boardId={boardId} boardName={boardName} />
            <CreateNote boardId={boardId} isMounted={isMounted} setIsMounted={setIsMounted} createNoteForm={createNoteForm} setCreateNoteForm={setCreateNoteForm} content={content} setContent={setContent} />
            <div className='fixed w-[70px] h-[70px] flex items-center justify-center right-0 bottom-0 bg-[#98ff98] rounded-full mr-[30px] mb-[30px] transition duration-150 hover:bg-[#78ff78]'>
                <button onClick={toggleCreateNote} className={`text-[60px] text-[#202124] w-full outline-none ${isMounted ? 'rotate-45' : ''} transition duration-100`}>+</button>
            </div>
        </div>
    )
}

export default Container