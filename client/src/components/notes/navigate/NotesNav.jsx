import { useState, useEffect } from "react";
import { useBoard } from "../../../hooks/useBoard";
import { useMenu } from "../../../hooks/useMenu";
import { BsFileText } from "react-icons/bs";
import { PiAlarmBold } from "react-icons/pi";
import { RiArchive2Fill } from "react-icons/ri";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { CreateBoard } from "../../boards/content/BContent";

function NotesNav() {

  const { boards, getBoards, toggleForm } = useBoard();

  const { menu } = useMenu();

  const [selectedItem, setSelectedItem] = useState('BsFileText');

  useEffect(() => {
    getBoards();
  }, []);

  const handleItemClick = (itemName) => {
    setSelectedItem(itemName)
  };

  return (
    <>
    <nav className="h-full min-h-full z-[9999]">
      <div className={`fixed top-0 left-0 bottom-0 mt-[70px] border-right transition-all ease-in-out duration-100 ${menu ? 'min-w-[280px]' : 'min-w-[70px]'}`}>
        <div className="flex flex-col h-full min-h-full overflow-auto navigate-blur">
          <div className="flex-1 overflow-x-hidden overflow-y-auto">
            <div>
              <div className="pt-[12px] pb-[20px]">
                <div role="button" onClick={() => handleItemClick('BsFileText')} className={`flex flex-row items-center ml-[10px] w-[50px] h-[50px] rounded-full cursor-default transition-all duration-100 ${menu ? 'w-full pl-[10px] rounded-none navigate-conditional-rounded' : ''} ${selectedItem === 'BsFileText' ? 'bg-[#98ff98] text-[#202520] font-bold' : ''}`}>
                  <BsFileText className="mx-[12px] min-w-[25px] min-h-[25px]" />
                  <p className={`text-ellipsis whitespace-nowrap overflow-hidden ml-[10px] ${menu ? 'block' : 'invisible hidden'}`}>Notas</p>
                </div>
                <div role="button" onClick={() => handleItemClick('PiAlarmBold')} className={`flex flex-row items-center ml-[10px] w-[50px] h-[50px] rounded-full cursor-default transition-all duration-100 ${menu ? 'w-full pl-[10px] rounded-none navigate-conditional-rounded' : ''} ${selectedItem === 'PiAlarmBold' ? 'bg-[#98ff98] text-[#202520] font-bold' : ''}`}>
                  <PiAlarmBold className="mx-[12px] min-w-[25px] min-h-[25px]" />
                  <p className={`text-ellipsis whitespace-nowrap overflow-hidden ml-[10px] ${menu ? 'block' : 'invisible hidden'}`}>Recordatorios</p>
                </div>
                <div role="button" onClick={() => handleItemClick('RiArchive2Fill')} className={`flex flex-row items-center ml-[10px] w-[50px] h-[50px] rounded-full cursor-default transition-all duration-100 ${menu ? 'w-full pl-[10px] rounded-none navigate-conditional-rounded' : ''} ${selectedItem === 'RiArchive2Fill' ? 'bg-[#98ff98] text-[#202520] font-bold' : ''}`}>
                  <RiArchive2Fill className="mx-[12px] min-w-[25px] min-h-[25px]" />
                  <p className={`text-ellipsis whitespace-nowrap overflow-hidden ml-[10px] ${menu ? 'block' : 'invisible hidden'}`}>Archivos</p>
                </div>
                <div role="button" onClick={() => handleItemClick('FaRegTrashCan')} className={`flex flex-row items-center ml-[10px] w-[50px] h-[50px] rounded-full cursor-default transition-all duration-100 ${menu ? 'w-full pl-[10px] rounded-none navigate-conditional-rounded' : ''} ${selectedItem === 'FaRegTrashCan' ? 'bg-[#98ff98] text-[#202520] font-bold' : ''}`}>
                  <FaRegTrashCan className="mx-[12px] min-w-[25px] min-h-[25px]" />
                  <p className={`text-ellipsis whitespace-nowrap overflow-hidden ml-[10px] ${menu ? 'block' : 'invisible hidden'}`}>Papelera</p>
                </div>
              </div>
              <div className="pt-[12px] border-top">
                <div className="flex flex-row items-center justify-between px-[20px] pb-[8px]">
                  <Link to='/tableros' className={`${menu ? 'block' : 'invisible hidden'}`}>
                    <p className={`text-[14px] font-medium text-ellipsis whitespace-nowrap overflow-hidden`}>Tableros</p>
                  </Link>
                  <button onClick={toggleForm} className="text-[22px] ml-[5px]">+</button>
                </div>
                {boards.map((board) => (
                  <Link key={board.id} to={`/tableros/${board.id}`}>
                    <div role="button" className={`navigate-element flex flex-row items-center ml-[10px] rounded-full w-[50px] h-[50px] transition-all duration-100 ${menu ? 'w-full pl-[10px] rounded-none navigate-conditional-rounded' : ''}`}>
                      <span className="text-[#202520] mx-[11px] min-w-[25px] min-h-[20px] rounded-sm" style={{
                        backgroundImage: board.background_type === 'image'
                          ? `url(${board.background_value})`
                          : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: board.background_type === 'color'
                          ? board.background_value
                          : 'transparent'
                      }} />
                      <p className={`text-[#eee] text-[14px] text-ellipsis font-medium whitespace-nowrap overflow-hidden ml-[10px] ${menu ? 'block' : 'invisible hidden'}`}>{board.board_name}</p>
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