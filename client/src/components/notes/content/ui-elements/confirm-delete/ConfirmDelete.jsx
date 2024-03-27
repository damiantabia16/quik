import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import './confirm-delete.css';
import { Button } from '../../../../ui/button/Button';

export default function ConfirmDelete({ confirmDelete, handleConfirmDelete, handleCancelDelete }) {

    const CONFIRM_DELETE_DISPLAY = {
        animation: 'displayConfirmDelete 0.2s'
    };
    const CONFIRM_DELETE_HIDE = {
        animation: 'hideConfirmDelete 0.2s',
        animationFillMode: 'forwards'
    }

    if (!confirmDelete) return null;

    return ReactDOM.createPortal(
        <>
            <div className={`${confirmDelete ? 'overlay' : 'hidden'}`} style={confirmDelete ? CONFIRM_DELETE_DISPLAY : CONFIRM_DELETE_HIDE}></div>
            <section className={`${confirmDelete ? 'box' : 'hidden'}`} style={confirmDelete ? CONFIRM_DELETE_DISPLAY : CONFIRM_DELETE_HIDE}>
                <div className='confirm-delete close-shadow'>
                    <div className='confirm-delete-dialog'>
                        <h4 className='confirm-delete-message'>¿Estás seguro que quieres eliminar la nota definitivamente?</h4>
                        <div className='confirm-delete-buttons'>
                            <Button onClick={handleConfirmDelete}>ELIMINAR</Button>
                            <Button variant='outline' onClick={handleCancelDelete}>CANCELAR</Button>
                        </div>
                    </div>
                </div>
            </section>
        </>,
        document.body
    )
}