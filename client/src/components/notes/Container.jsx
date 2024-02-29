import NotesNav from "./navigate/NotesNav";
import NotesContent, { CreateNote } from "./content/grid/NContent";
import Reminders from "./content/reminders/Reminders";
import Archives from "./content/archive/Archives";
import Bin from "./content/bin/Bin";
import { useBoard } from "../../hooks/useBoard";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, useParams } from "react-router-dom";

function Grid({ boardId, boardName, isMounted, setIsMounted, createNoteForm,setCreateNoteForm, content, setContent, toggleCreateNote }) {
    return (
        <>
            <NotesContent boardId={boardId} boardName={boardName} />
            <CreateNote boardId={boardId} isMounted={isMounted} setIsMounted={setIsMounted} createNoteForm={createNoteForm} setCreateNoteForm={setCreateNoteForm} content={content} setContent={setContent} />
            <div className='fixed w-[70px] h-[70px] flex items-center justify-center right-0 bottom-0 bg-[#98ff98] rounded-full mr-[30px] mb-[30px] transition duration-150 hover:bg-[#78ff78]'>
                <button onClick={toggleCreateNote} className={`text-[60px] text-[#202124] w-full outline-none ${isMounted ? 'rotate-45' : ''} transition duration-200`}>+</button>
            </div>
        </>
    )
}

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

    const { pathname } = useLocation();

    const isRemindersRoute = pathname.includes('/recordatorios');
    const isArchivesRoute = pathname.includes('/archivos');
    const isBinRoute = pathname.includes('/papelera');

    return (
        <div className="relative flex flex-row">
            <div className="fixed w-full h-screen z-[-1]" style={containerStyle} />
            <NotesNav boardId={boardId} />
            <Routes>
                <Route path="/" element={<Grid
                    boardId={boardId}
                    boardName={boardName}
                    isMounted={isMounted}
                    setIsMounted={setIsMounted}
                    createNoteForm={createNoteForm}
                    setCreateNoteForm={setCreateNoteForm}
                    content={content}
                    setContent={setContent}
                    toggleCreateNote={toggleCreateNote} />} />
                {isRemindersRoute && <Route path="/recordatorios" element={<Reminders boardId={boardId} />} />}
                {isArchivesRoute && <Route path="/archivos" element={<Archives boardId={boardId} />} />}
                {isBinRoute && <Route path="/papelera" element={<Bin />} />}
            </Routes>
        </div>
    )
}

export default Container