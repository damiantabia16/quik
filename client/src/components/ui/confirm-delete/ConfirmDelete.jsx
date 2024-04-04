import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './confirm-delete.css';
import { Button } from '../button/Button';

export default function ConfirmDelete({ confirmDelete, confirmBoardDelete, setConfirmBoardDelete, handleConfirmDelete, handleCancelDelete, handleDeleteBoard }) {

    const handleDelete = () => {
        if (confirmDelete) {
            handleConfirmDelete();
        } else if (confirmBoardDelete) {
            handleDeleteBoard();
        }
    }

    const handleCancel = () => {
        if (confirmDelete) {
            handleCancelDelete();
        } else if (confirmBoardDelete) {
            setConfirmBoardDelete(false);
        }
    }

    const CONFIRM_DELETE_DISPLAY = {
        animation: 'displayConfirmDelete 0.2s'
    };
    const CONFIRM_DELETE_HIDE = {
        animation: 'hideConfirmDelete 0.2s',
        animationFillMode: 'forwards'
    };

    if (!confirmDelete && !confirmBoardDelete) return null;

    return ReactDOM.createPortal(
        <>
            <div className={`${confirmDelete || confirmBoardDelete ? 'overlay' : 'hidden'}`} style={confirmDelete || confirmBoardDelete ? CONFIRM_DELETE_DISPLAY : CONFIRM_DELETE_HIDE}></div>
            <section className={`${confirmDelete || confirmBoardDelete ? 'box' : 'hidden'}`} style={confirmDelete || confirmBoardDelete ? CONFIRM_DELETE_DISPLAY : CONFIRM_DELETE_HIDE}>
                <div className='confirm-delete close-shadow'>
                    <div className='confirm-delete-dialog'>
                        <h4 className='confirm-delete-message'>{confirmDelete ? '¿Estás seguro que quieres eliminar la nota definitivamente?' : '¿Estás seguro que quieres eliminar el tablero definitivamente?'}</h4>
                        {confirmBoardDelete && (
                            <p className='confirm-delete-advice'>Todo el contenido del tablero incluidas las notas desaparecerán.</p>
                        )}
                        <div className='confirm-delete-buttons'>
                            <Button variant='danger' onClick={handleDelete}>ELIMINAR</Button>
                            <Button variant='outline' onClick={handleCancel}>CANCELAR</Button>
                        </div>
                    </div>
                </div>
            </section>
        </>,
        document.body
    )
}