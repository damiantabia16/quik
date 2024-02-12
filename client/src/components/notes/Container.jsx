import NotesNav from "./navigate/NotesNav";
import NContent from "./content/NContent";
import { useBoard } from "../../hooks/useBoard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Container() {

    const { getBoard } = useBoard();
    
    const params = useParams();

    const [boardName, setBoardName] = useState(null);
    const [backgroundType, setBackgroundType] = useState(null);
    const [backgroundValue, setBackgroundValue] = useState(null);

    useEffect(() => {
        const loadBoard = async () => {
            if (params.id) {
                const board = await getBoard(params.id);
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

  return (
    <div className="relative flex flex-row">
        <div className="fixed w-full h-screen z-[-1]" style={containerStyle} />
        <NotesNav />
        <NContent boardName={boardName} />
    </div>
  )
}

export default Container