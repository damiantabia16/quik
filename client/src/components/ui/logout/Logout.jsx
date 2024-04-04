import ReactDOM from 'react-dom';
import { Button } from '../button/Button';

function Logout({ confirmLogout, handleConfirmLogout, handleCancelLogout }) {

    if (!confirmLogout) return null;

    const CONFIRM_LOGOUT_DISPLAY = {
        animation: 'displayUi 0.2s ease-in'
    };
    const CONFIRM_LOGOUT_HIDE = {
        animation: 'hideUi 0.2s ease-out',
        animationFillMode: 'forwards'
    }

    return ReactDOM.createPortal(
        <>
            <div className='confirm-logout overlay' style={confirmLogout ? CONFIRM_LOGOUT_DISPLAY : CONFIRM_LOGOUT_HIDE} />
            <section className='confirm-logout box' style={confirmLogout ? CONFIRM_LOGOUT_DISPLAY : CONFIRM_LOGOUT_HIDE}>
                <div className='confirm-logout-message close-shadow'>
                    <header className='mb-[1em]'>
                        <h2 className='confirm-logout-title'>Cierre de sesión</h2>
                    </header>
                    <div className='confirm-logout-dialog'>
                        <h4>¿Estás seguro que quieres cerrar sesión?</h4>
                        <div className='confirm-logout-buttons'>
                            <Button onClick={handleConfirmLogout}>ACEPTAR</Button>
                            <Button onClick={handleCancelLogout} variant='outline'>CANCELAR</Button>
                        </div>
                    </div>
                </div>
            </section>
        </>,
        document.body
    )
}

export default Logout