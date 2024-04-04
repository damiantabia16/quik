import { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Options from "../options/Options";
import EditBoardName from "../edit-board-name/EditBoardName";
import ConfirmDelete from "../confirm-delete/ConfirmDelete";
import { MdMoreVert } from "react-icons/md";
import { useBoard } from "../../../hooks/useBoard";

function BoardCard({ board, boardOptions, setBoardOptions, handleOptions, handleDeleteBoard }) {

    const boardRef = useRef();

    const navigate = useNavigate();

    const { getBoard } = useBoard();

    const [edit, setEdit] = useState(false);
    const [confirmBoardDelete, setConfirmBoardDelete] = useState(false);

    const handleBoardClick = (boardId) => {
        navigate(`/tableros/${boardId}/notas`);
    };

    const editBoard = async (boardId) => {
        try {
            await getBoard(boardId);
            setEdit(true);
        } catch (error) {
            console.error('Error al obtener el tablero:', error);
        }
    }

    return (
        <>
            <li onClick={() => handleBoardClick(board.id)} className='board-container'>
                <div ref={boardRef} className='board board-item'
                    style={{
                        backgroundImage: board.background_type === 'image'
                            ? `url(${board.background_value})`
                            : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: board.background_type === 'color'
                            ? board.background_value
                            : 'transparent'
                    }}>
                    <span id='hover' />
                    <p>{board.board_name}</p>
                    <div id="button-container">
                        <div onClick={(e) => handleOptions(e, board.id)} data-option-id='opciones' role='button' className='board-options'>
                            <MdMoreVert />
                        </div>
                    </div>
                </div>
            </li>
            <Options
                boardOptions={boardOptions}
                setBoardOptions={setBoardOptions}
                confirmBoardDelete={confirmBoardDelete}
                setConfirmBoardDelete={setConfirmBoardDelete}
                boardRef={boardRef}
                boardId={board.id}
                editBoard={editBoard}
                handleDeleteBoard={handleDeleteBoard}
            />
            <EditBoardName
                edit={edit}
                setEdit={setEdit}
            />
            <ConfirmDelete
                confirmBoardDelete={confirmBoardDelete}
                setConfirmBoardDelete={setConfirmBoardDelete}
                handleDeleteBoard={() => handleDeleteBoard(board.id)}
            />
        </>
    )
}

export default BoardCard