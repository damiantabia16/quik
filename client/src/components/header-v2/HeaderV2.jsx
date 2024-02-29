import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth"
import { Link } from 'react-router-dom';
import logo from './quik-logo.png';
import { HiBars3 } from 'react-icons/hi2';
import { MdAccountCircle, MdKeyboardArrowDown, MdOutlineAccountCircle, MdOutlineEdit, MdLogout } from "react-icons/md";
import { useMenu } from "../../hooks/useMenu";

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
        <header className={`fixed border-bottom w-full h-[70px] block top-0 z-[9999] bg-[#202520] ${scroll ? 'shadow-bottom' : ''}`}>
            <div className='relative h-full flex items-center'>
                <div className='relative border-bottom flex items-center h-full w-full bg-[#202520]'>
                    <button onClick={toggleMenu} className='p-[20px] outline-none'>
                        <HiBars3 className='text-[27px] text-[#eee]' />
                    </button>
                    <div>
                        <Link to='/' className='flex items-center'>
                            <img className='max-h-[45px]' src={logo} alt="" />
                            <span className='text-[28px] text-[#eee] pl-[10px] font-bold'>
                                Quik
                            </span>
                        </Link>
                    </div>
                    <div className='ml-auto px-[20px]'>
                        <button onClick={handleUserOptions} className='w-[40px] h-[40px] outline-none md:w-auto md:h-auto flex items-center justify-center bg-[#98ff98] md:bg-transparent text-[#202520] md:text-inherit rounded-full md:rounded-md md:px-[20px]'>
                            <MdAccountCircle className='md:hidden md:mr-[5px] text-[30px] md:text-[20px]' />
                            <span className='hidden md:block font-bold'>
                                {user.username}
                            </span>
                            <MdKeyboardArrowDown className='hidden md:inline-block ml-[5px] text-[20px]' />
                        </button>
                        <div className={`absolute w-[200px] bg-[#eee] rounded right-5 md:right-10 mt-[14.4px] md:mt-[23px] z-[-1] transition-all duration-200 ${userOptions ? 'translate-y-0 visible' : '-translate-y-full'}`}>
                            <ul className='flex flex-col pl-[15px] pr-[40px] py-[10px]'>
                                <li className='md:hidden flex items-center justify-start my-[4px]'>
                                    <MdOutlineAccountCircle className='text-[#202520] text-[18px] mr-[5px]' />
                                    <span className='text-[#202520]'>
                                        {user.username}
                                    </span>
                                </li>
                                <li className='flex items-center justify-start my-[4px]'>
                                    <Link to='/perfil' onClick={() => setUserOptions(false)} className='text-[#202520] flex items-center justify-start'>
                                        <MdOutlineEdit className='text-[18px] mr-[5px]' />
                                        Editar perfil
                                    </Link>
                                </li>
                                <li onClick={handleLogout} className='flex items-center justify-start my-[4px] cursor-pointer w-full'>
                                    <MdLogout className='text-[#202520] text-[18px] mr-[5px]' />
                                    <span className='text-[#202520]'>
                                        Cerrar sesión
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className={`fixed w-screen h-screen top-0 bottom-0 left-0 right-0 z-[9999] bg-[#00000070] overflow-hidden transition-opacity duration-200 ${confirmLogout ? 'opacity-100 visible' : 'opacity-0 invisible'}`}></div>
                        <section className={`fixed flex justify-center items-center w-full h-full left-0 right-0 bottom-0 top-0 z-[9999] transition-opacity duration-200 ${confirmLogout ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                            <div className='h-auto w-[345px] bg-[#202520] rounded p-[24px] close-shadow'>
                                <header className='mb-[1em]'>
                                    <h2 className='text-[18px] font-bold text-center cursor-default'>Cierre de sesión</h2>
                                </header>
                                <div className='flex flex-col items-center justify-center'>
                                    <h4 className='font-thin text-center text-[15px] mb-[0.5em]'>¿Estás seguro que quieres cerrar sesión?</h4>
                                    <div className='flex items-center gap-x-10 pt-[10px]'>
                                        <button type='button' onClick={handleConfirmLogout} className='bg-[#98ff98] text-[#202520] text-[14px] font-medium rounded px-[30px] py-[8px] transition duration-150 hover:bg-[#b8ffb8]'>ACEPTAR</button>
                                        <button type='button' onClick={handleCancelLogout} className='border border-[#98ff98] text-[#98ff98] text-[14px] font-medium rounded px-[30px] py-[8px] transition duration-150 hover:border-[#b8ffb8] hover:text-[#b8ffb8]'>CANCELAR</button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </header>
    )
};

export default HeaderV2