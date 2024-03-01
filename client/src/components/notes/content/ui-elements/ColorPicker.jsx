import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import colors from '../colors.json';
import { Tooltip } from 'react-tooltip';
import { MdCheckCircle, MdFormatColorReset } from "react-icons/md";

export default function ColorPicker({ selectColor, setSelectColor, pickedColor, noteRef, handlePickColor }) {

    const pickerRef = useRef(null);

    const handleOutsideClick = (e) => {
        const isColorPickerButtonClicked = noteRef.current.contains(e.target.closest("#options button[data-option-id='2']"));
        if (!isColorPickerButtonClicked && pickerRef.current && !pickerRef.current.contains(e.target)) {
            setSelectColor(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [setSelectColor]);

    if (!noteRef.current) return null;
    const noteCard = noteRef.current.getBoundingClientRect();
    const COLOR_PICKER_DISPLAY = {
        top: noteCard.bottom - 6 + 'px',
        left: noteCard.left + 'px',
        animation: 'displayUi 0.2s'
    };
    const COLOR_PICKER_HIDE = {
        animation: 'hideUi 0.2s',
        animationFillMode: 'forwards'
    }

    if (!selectColor) return null;

    return ReactDOM.createPortal(
        <div ref={pickerRef} id='color-picker' className={`${selectColor ? 'absolute flex flex-wrap p-[10px] rounded bg-[#eee]' : 'hidden'}`} style={selectColor ? COLOR_PICKER_DISPLAY : COLOR_PICKER_HIDE}>
            {colors.map((color) => (
                <div role='option' className='m-[2px]' key={color.id}>
                    <div
                        className={`relative w-[30px] h-[30px] rounded-full border-2 border-solid cursor-pointer`}
                        style={{ backgroundColor: color.hexadecimal, borderColor: pickedColor === color.hexadecimal ? '#ff1493' : color.border }}
                        aria-label={color.color}
                        data-tooltip-id='color-tooltip'
                        data-tooltip-content={color.color}
                        onClick={() => handlePickColor(color.hexadecimal)}
                        onMouseEnter={(e) => e.target.style.borderColor = pickedColor === color.hexadecimal ? '#ff1493' : '#202520'}
                        onMouseLeave={(e) => e.target.style.borderColor = pickedColor === color.hexadecimal ? '#ff1493' : color.border}>

                        {pickedColor === color.hexadecimal && <MdCheckCircle className='absolute -top-[20%] -right-[30%] text-xl text-[#ff1493] bg-white rounded-full' />}
                        {color.hexadecimal === 'transparent' && <MdFormatColorReset className='absolute pointer-events-none text-[#202520] inline-block m-auto w-[20px] top-0 right-0 bottom-0 left-0 h-full' />}
                        
                    </div>
                </div>
            ))}
            <Tooltip id='color-tooltip' effect="solid" place="bottom" />
        </div>,
        document.body
    )
};