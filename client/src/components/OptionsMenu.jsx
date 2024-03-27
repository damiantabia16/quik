import { Link } from "react-router-dom";
import { MdOutlineAccountCircle, MdModeEdit, MdLogout } from "react-icons/md";

function OptionsMenu({ user, userOptions, setUserOptions, handleLogout }) {
    return (
        <div role='menu' className={`user-options-list transition-transform duration-200 ${userOptions ? 'translate-y-0 visible' : '-translate-y-full'}`}>
            <div className='user-option'>
                <MdOutlineAccountCircle />
                <div>
                    {user.username}
                </div>
            </div>
            <div className='user-option cursor-pointer' onClick={() => setUserOptions(false)}>
                <Link to='/perfil'>
                    <MdModeEdit />
                    <div>
                        Editar perfil
                    </div>
                </Link>
            </div>
            <div onClick={handleLogout} className='user-option cursor-pointer'>
                <MdLogout />
                <div>
                    Cerrar sesión
                </div>
            </div>
        </div>
    )
}

export default OptionsMenu