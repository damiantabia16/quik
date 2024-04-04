import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './options.css'

function Options({
    boardOptions,
    setBoardOptions,
    editBoard,
    confirmBoardDelete,
    setConfirmBoardDelete,
    boardRef,
    boardId,
}) {

    const optionsRef = useRef(null);

    const [boardPosition, setBoardPosition] = useState(null);

    useEffect(() => {
        function updateNoteCardPosition() {
            if (boardRef?.current) {
                const boardCard = boardRef.current.getBoundingClientRect();
                setBoardPosition(boardCard);
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
    }, [boardRef?.current]);

    const handleOutsideClick = (e) => {
        const isOptionsButtonClicked =
            boardRef?.current?.contains(e.target.closest("#button-container div[data-option-id='opciones']"))
        const clickedOutsideOptions = optionsRef.current && !optionsRef.current.contains(e.target);
        if (!isOptionsButtonClicked && clickedOutsideOptions) {
            setBoardOptions(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [boardRef, setBoardOptions]);

    let optionsMenuPosition;
    optionsMenuPosition = {
      position: 'absolute',
      width: boardPosition ? boardPosition.width + 'px' : 'auto',
      top: boardPosition ? boardPosition.bottom + 'px' : 'auto',
      left: boardPosition ? boardPosition.left + 'px' : 'auto',
      animation: 'displayUi 0.2s'
    }

    if (!boardOptions) return null;

    return ReactDOM.createPortal(
        <div ref={optionsRef} role='menu' className={`${boardOptions ? 'board-options-list' : 'hidden'}`} style={optionsMenuPosition}>
            <div onClick={(e) => { e.preventDefault(); editBoard(boardId); }} className='board-option'>
                <p>Cambiar nombre</p>
            </div>
            <div onClick={(e) => { e.preventDefault(); setConfirmBoardDelete(true); }} className='board-option'>
                <p>Eliminar tablero</p>
            </div>
        </div>,
        document.body
    )
}

export default Options