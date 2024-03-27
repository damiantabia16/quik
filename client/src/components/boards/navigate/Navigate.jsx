import { FaRegClipboard } from "react-icons/fa";
import { useMenu } from "../../../hooks/useMenu";
import { useBoard } from "../../../hooks/useBoard";
import { Link } from "react-router-dom";

function Navigate() {

    const { boards } = useBoard();

    const { menu } = useMenu();

    return (
        <nav>
            <div className={`boards-nav border-right ${menu ? 'active' : ''}`}>
                <div className="navigate-column-container navigate-blur">
                    <div className="navigate-column">
                        <div className="column">
                            <div className={`boards-clipboard ${menu ? 'active' : ''}`}>
                                <FaRegClipboard />
                                <p className={`${menu ? 'block' : 'invisible hidden'}`}>Tableros</p>
                            </div>
                            {boards.map((board) => (
                                <Link key={board.id} to={`/tableros/${board.id}`}>
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
        </nav>
    )
};

export default Navigate