import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MdAccountCircle, MdKeyboardArrowDown } from "react-icons/md";
import logo from './quik-logo.png';
import { useAuth } from '../../hooks/useAuth';
import './header.css';
import OptionsMenu from '../OptionsMenu';
import Logout from '../Logout';

function Header() {

    const { isAuth, user, logOut } = useAuth();

    const [userOptions, setUserOptions] = useState(false);
    const [confirmLogout, setConfirmLogout] = useState(false);
    const [scroll, setScroll] = useState(false);

    const handleUserOptions = () => {
        setUserOptions(!userOptions);
    };

    const handleLogout = () => {
        setConfirmLogout(true);
        setUserOptions(false);
    };

    const handleConfirmLogout = () => {
        logOut();
        setUserOptions(false);
        setConfirmLogout(false);
    };

    const handleCancelLogout = () => {
        setConfirmLogout(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const scrolled = scrollTop > 0;
            setScroll(scrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={`header background ${scroll ? 'shadow-bottom' : ''}`}>
            <div className='row background'>
                <div className='row max-w-[1320px]'>
                    <div className='logo-container'>
                        <Link to='/'>
                            <img src={logo} alt="" />
                            <span>
                                Quik
                            </span>
                        </Link>
                    </div>
                    <div className='user-container'>
                        {isAuth ? (
                            <>
                                <button onClick={handleUserOptions} className='user-button'>
                                    <MdAccountCircle className='account-circle' />
                                    <span>
                                        {user.username}
                                    </span>
                                    <MdKeyboardArrowDown className='arrow-down' />
                                </button>
                                <OptionsMenu user={user} userOptions={userOptions} setUserOptions={setUserOptions} handleLogout={handleLogout} />
                                <Logout confirmLogout={confirmLogout} handleConfirmLogout={handleConfirmLogout} handleCancelLogout={handleCancelLogout} />
                            </>
                        ) : (
                            <Link to='/ingresar'>
                                <button className='login-button'>
                                    <MdAccountCircle />
                                    <span>
                                        INICIAR SESIÓN
                                    </span>
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
};

export default Header