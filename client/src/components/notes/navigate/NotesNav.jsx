import { useState, useEffect } from "react";
import { useBoard } from "../../../hooks/useBoard";
import { useMenu } from "../../../hooks/useMenu";
import { menuItems } from "./menuItems";
import { Link, useLocation } from "react-router-dom";
import CreateBoard from "../../boards/content/CreateBoard";

function NotesNav({ boardId }) {

  const { boards, getBoards, toggleForm } = useBoard();

  const { menu, setMenu } = useMenu();

  const [selectedItem, setSelectedItem] = useState(null);

  const { pathname } = useLocation();

  const handleItemClick = (itemName) => {
    setSelectedItem(itemName);
  };

  useEffect(() => {
    getBoards();
    if (pathname.includes('/notas')) {
      setSelectedItem('BsFileText');
    }
    if (pathname.includes('/recordatorios')) {
      setSelectedItem('PiAlarmBold');
    } else if (pathname.includes('/archivos')) {
      setSelectedItem('RiArchive2Fill');
    } else if (pathname.includes('/papelera')) {
      setSelectedItem('FaRegTrashCan');
    }
  }, [pathname]);

  let timeoutId;

  return (
    <>
      <nav>
        <div className={`notes-nav border-right ${menu ? 'active' : ''}`}>
          <div className="navigate-column-container navigate-blur">
            <div className="navigate-column">
              <div
                className="column"
                onMouseEnter={() => { timeoutId = setTimeout(() => { setMenu(true) }, 300) }}
                onMouseLeave={() => { clearTimeout(timeoutId); setMenu(false) }}>
                {menuItems.map((item) => (
                  <Link key={item.id} to={`/tableros/${boardId}/${item.path}`}>
                    <div role="button" onClick={() => handleItemClick(item.icon_label)} className={`navigate-item ${menu ? 'active' : ''} ${selectedItem === item.icon_label ? 'selected' : ''}`}>
                      {item.icon}
                      <p className={`${menu ? 'block' : 'invisible hidden'}`}>{item.label}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="boards-navigation border-top">
                <div
                  className="add-go-boards"
                  onMouseEnter={() => { if (menu) setMenu(true) }}
                  onMouseLeave={() => { if (menu) setMenu(false) }}>
                  <Link to='/tableros' className={`${menu ? 'block' : 'invisible hidden'}`}>
                    <p>Tableros</p>
                  </Link>
                  <button onClick={toggleForm}>+</button>
                </div>
                <div
                  onMouseEnter={() => { timeoutId = setTimeout(() => { setMenu(true) }, 300) }}
                  onMouseLeave={() => { clearTimeout(timeoutId); setMenu(false) }}>
                  {boards.map((board) => (
                    <Link key={board.id} to={`/tableros/${board.id}/notas`}>
                      <div role="button" className={`navigate-element ${menu ? 'active' : ''}`}>
                        <span style={{
                          backgroundImage: board.background_type === 'image'
                            ? `url(${board.background_value})`
                            : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundColor: board.background_type === 'color'
                            ? board.background_value
                            : 'transparent'
                        }} />
                        <p className={`${menu ? 'block' : 'invisible hidden'}`}>{board.board_name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <CreateBoard />
    </>
  )
}

export default NotesNav