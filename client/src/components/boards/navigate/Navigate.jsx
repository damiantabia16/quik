import { FaRegClipboard } from "react-icons/fa";
import { useMenu } from "../../../hooks/useMenu";
import { useBoard } from "../../../hooks/useBoard";
import { Link } from "react-router-dom";

function Navigate() {

    const { boards } = useBoard();

    const { menu } = useMenu();

    return (
        <nav className="h-full min-h-full z-[9999]">
            <div className={`fixed top-0 left-0 bottom-0 mt-[70px] border-right transition-all ease-in-out duration-100 ${menu ? 'min-w-[280px]' : 'min-w-[70px]'}`}>
                <div className="flex flex-col h-full min-h-full overflow-auto navigate-blur">
                    <div className="flex-1 overflow-x-hidden overflow-y-auto">
                        <div>
                            <div className="pt-[12px]">
                                <div className={`flex flex-row items-center ml-[10px] w-[50px] h-[50px] bg-[#98ff98] rounded-full cursor-default transition-all duration-100 ${menu ? 'w-full pl-[10px] rounded-none navigate-conditional-rounded' : ''}`}>
                                    <FaRegClipboard className="text-[#202520] mx-[12px] min-w-[25px] min-h-[25px]" />
                                    <p className={`text-[#202520] text-ellipsis font-bold whitespace-nowrap overflow-hidden ml-[10px] ${menu ? 'block' : 'invisible hidden'}`}>Tableros</p>
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
                            <div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    )
};

export default Navigate