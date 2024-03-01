import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

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
            <div className={`${confirmDelete ? 'fixed w-screen h-screen top-0 bottom-0 left-0 right-0 bg-[#00000070] overflow-hidden' : 'hidden'}`} style={confirmDelete ? CONFIRM_DELETE_DISPLAY : CONFIRM_DELETE_HIDE}></div>
            <section className={`${confirmDelete ? 'fixed flex justify-center items-center w-full h-full left-0 right-0 bottom-0 top-0' : 'hidden'}`} style={confirmDelete ? CONFIRM_DELETE_DISPLAY : CONFIRM_DELETE_HIDE}>
                <div className='h-auto w-[345px] bg-[#202520] rounded p-[24px] close-shadow'>
                    <div className='flex flex-col items-center justify-center'>
                        <h4 className='font-thin text-center text-[15px] mb-[0.5em]'>¿Estás seguro que quieres eliminar la nota definitivamente?</h4>
                        <div className='flex items-center gap-x-10 pt-[10px]'>
                            <button type='button' onClick={handleConfirmDelete} className='bg-[#98ff98] text-[#202520] text-[14px] font-medium rounded px-[30px] py-[8px] transition duration-150 hover:bg-[#b8ffb8]'>ELIMINAR</button>
                            <button type='button' onClick={handleCancelDelete} className='border border-[#98ff98] text-[#98ff98] text-[14px] font-medium rounded px-[30px] py-[8px] transition duration-150 hover:border-[#b8ffb8] hover:text-[#b8ffb8]'>CANCELAR</button>
                        </div>
                    </div>
                </div>
            </section>
        </>,
        document.body
    )
}