import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth"
import { Link } from 'react-router-dom';
import logo from './quik-logo.png';
import { HiBars3 } from 'react-icons/hi2';
import { MdAccountCircle, MdKeyboardArrowDown } from "react-icons/md";
import { useMenu } from "../../hooks/useMenu";
import OptionsMenu from "../OptionsMenu";
import Logout from "../Logout";

function HeaderV2() {

    const { user, logOut } = useAuth();

    const { toggleMenu } = useMenu();

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
        <header className={`header border-bottom bg-primary ${scroll ? 'shadow-bottom' : ''}`}>
            <div className='row'>
                <div className='row v2 border-bottom bg-primary'>
                    <button onClick={toggleMenu} className='bars'>
                        <HiBars3 />
                    </button>
                    <Link to='/'>
                        <img src={logo} alt="Quik Logo" />
                        <span>
                            Quik
                        </span>
                    </Link>
                    <div className='user-container'>
                        <button onClick={handleUserOptions} className='user-button'>
                            <MdAccountCircle className='account-circle' />
                            <span>
                                {user.username}
                            </span>
                            <MdKeyboardArrowDown className='arrow-down' />
                        </button>
                        <OptionsMenu user={user} userOptions={userOptions} setUserOptions={setUserOptions} handleLogout={handleLogout} />
                        <Logout confirmLogout={confirmLogout} handleConfirmLogout={handleConfirmLogout} handleCancelLogout={handleCancelLogout} />
                    </div>
                </div>
            </div>
        </header >
    )
};

export default HeaderV2