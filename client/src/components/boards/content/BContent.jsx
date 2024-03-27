import { useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useBoard } from '../../../hooks/useBoard';
import { Link } from 'react-router-dom';
import CreateBoard from './CreateBoard';

function Searcher() {
  return (
    <div className='searcher-container'>
      <div className='searcher'>
        <FaSearch />
        <input id='board-searcher' name='board-searcher' type="text" placeholder='Buscar tableros' />
      </div>
    </div>
  )
};

function BoardsGrid() {

  const { boards, getBoards, toggleForm } = useBoard();

  useEffect(() => {
    getBoards();
  }, []);

  return (
    <div className='boards'>
      <ul>
        <li className='board-container'>
          <div onClick={toggleForm} className='board create-board'>
            <p>Crear un tablero</p>
          </div>
        </li>
        {boards.map((board) => (
          <li key={board.id} className='board-container'>
            <Link to={`/tableros/${board.id}/notas`}>
              <div className='board board-item'
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
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function BContent() {
  return (
    <>
      <section id="boards">
        <Searcher />
        <BoardsGrid />
      </section>
      <CreateBoard />
    </>
  )
};

export default BContent