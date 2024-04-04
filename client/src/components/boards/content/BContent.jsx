import { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useBoard } from '../../../hooks/useBoard';
import CreateBoard from '../../ui/create-board/CreateBoard';
import BoardCard from '../../ui/board-card/BoardCard';

function Searcher({ searchTerm, setSearchTerm }) {
  return (
    <div className='searcher-container'>
      <div className='searcher'>
        <FaSearch />
        <input
          id='board-searcher'
          name='board-searcher'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          placeholder='Buscar tableros' />
      </div>
    </div>
  )
};

function BoardsGrid({ searchTerm, handleDeleteBoard }) {

  const { boards, getBoards, setIsMounted } = useBoard();

  const [boardOptions, setBoardOptions] = useState({});
  const [filteredBoards, setFilteredBoards] = useState([]);

  useEffect(() => {
    getBoards();
  }, []);

  useEffect(() => {
    if (searchTerm && searchTerm.trim() !== '') {
      setFilteredBoards(boards.filter(board => (
        board.board_name.toLowerCase().includes(searchTerm.toLowerCase())
      )));
    } else {
      setFilteredBoards(boards);
    }
  }, [searchTerm, boards]);

  const handleOptions = (e, boardId) => {
    e.stopPropagation();
    setBoardOptions(prevState => ({
      ...prevState,
      [boardId]: !prevState[boardId]
    }));
  };

  return (
    <>
      <div className='boards'>
        <ul>
          <li className='board-container'>
            <div onClick={() => setIsMounted(true)} className='board create-board'>
              <p>Crear un tablero</p>
            </div>
          </li>
          {filteredBoards.map((board) => (
            <BoardCard
              board={board}
              key={board.id}
              boardOptions={boardOptions[board.id] || false}
              setBoardOptions={(value) => setBoardOptions({ ...boardOptions, [board.id]: value })}
              handleOptions={handleOptions}
              handleDeleteBoard={handleDeleteBoard} />
          ))}
        </ul>
      </div>
    </>
  )
}

function BContent() {

  const { getBoards, deleteBoard } = useBoard();

  const [searchTerm, setSearchTerm] = useState('');

  const handleDeleteBoard = async (boardId) => {
    try {
      await deleteBoard(boardId);
      getBoards();
    } catch (error) {
      console.error('Error al eliminar definitivamente el tablero:', error);
    }
  }

  return (
    <>
      <section id="boards">
        <Searcher searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <BoardsGrid searchTerm={searchTerm} handleDeleteBoard={handleDeleteBoard} />
      </section>
      <CreateBoard />
    </>
  )
};

export default BContent