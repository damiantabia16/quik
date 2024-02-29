import { createContext, useState } from "react";
import { createBoardRequest, getBoardsRequest, getBoardRequest } from "../api/boards";

export const BoardContext = createContext();

export const BoardProvider = ({ children }) => {

    const [ board, setBoard ] = useState(null);
    const [ boards, setBoards ] = useState([]);
    const [ isMounted, setIsMounted ] = useState(false);
    const [ form, setForm ] = useState(false);
    const [ backgroundImages, setBackgroundImages ] = useState([]);
    const [ backgroundImageIndex, setBackgroundImageIndex ] = useState(0);
    const [ backgroundColorIndex, setBackgroundColorIndex ] = useState(null);
    const [ selectedBackground, setSelectedBackground ] = useState(null);

    const createBoard = async (board) => {
        const res = await createBoardRequest(board);
    };

    const getBoards = async () => {
        try {
            const res = await getBoardsRequest(board);
            setBoards(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getBoard = async (id) => {
        try {
            const res = await getBoardRequest(id);
            return res.data;
        } catch (error) {
            console.error(error)
        }
    };

    const toggleForm = () => {
        setIsMounted(!isMounted);
    };

    const cancelForm = () => {
        setSelectedBackground(backgroundImages.length > 0 ? backgroundImages[0] : null);
        setBackgroundImageIndex(0);
        setBackgroundColorIndex();
    };

    const handleBackground = (background, index, type) => {
        setSelectedBackground(background);
        if (type === 'image') {
            background.type = 'image',
            setBackgroundImageIndex(index);
            setBackgroundColorIndex();
            setSelectedBackground({ ...background, type: 'image' });
        } else if (type === 'color') {
            background.type = 'color',
            setBackgroundImageIndex();
            setBackgroundColorIndex(index);
            setSelectedBackground({ ...background, type: 'color' });
        }
    };

    const exports = {
        boards,
        board,
        setBoard,
        createBoard,
        getBoards,
        getBoard,
        isMounted,
        setIsMounted,
        form,
        setForm,
        toggleForm,
        cancelForm,
        handleBackground,
        backgroundImages,
        setBackgroundImages,
        backgroundImageIndex,
        setBackgroundImageIndex,
        backgroundColorIndex,
        setBackgroundColorIndex,
        selectedBackground,
        setSelectedBackground,
    };

    return(
        <BoardContext.Provider value={exports}>
            {children}
        </BoardContext.Provider>
    )

}