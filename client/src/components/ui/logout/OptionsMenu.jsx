import { Link } from "react-router-dom";
import { MdOutlineAccountCircle, MdModeEdit, MdLogout } from "react-icons/md";

function OptionsMenu({ user, userOptions, setUserOptions, handleLogout }) {
    return (
        <div role='menu' className={`user-options-list ${userOptions ? 'active' : 'unactive'}`}>
            <div className='user-option'>
                <MdOutlineAccountCircle />
                <div>
                    {user.username}
                </div>
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