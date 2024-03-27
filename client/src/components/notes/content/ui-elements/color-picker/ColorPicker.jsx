import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import colors from '../../colors.json';
import './color-picker.css'
import { Tooltip } from 'react-tooltip';
import { MdCheckCircle, MdFormatColorReset } from "react-icons/md";

export default function ColorPicker({ selectColor, setSelectColor, pickedColor, noteRef, formRef, handlePickColor }) {

    const pickerRef = useRef(null);
    const [noteCard, setNoteCard] = useState(null);

    useEffect(() => {
        function updateNoteCardPosition() {
            if (formRef?.current) {
                const newNoteCard = formRef.current.getBoundingClientRect();
                setNoteCard(newNoteCard);
            }
            if (noteRef?.current) {
                const newNoteCard = noteRef.current.getBoundingClientRect();
                setNoteCard(newNoteCard);
            }
        }

        updateNoteCardPosition();

        const handleResize = () => {
            updateNoteCardPosition();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [formRef, noteRef?.current]);

    const handleOutsideClick = (e) => {
        const isColorPickerButtonClicked = formRef?.current?.contains(e.target.closest("#add-note-options button[data-option-id='2']")) || noteRef?.current?.contains(e.target.closest("#options button[data-option-id='2']"));
        const clickedOutsideColorPicker = pickerRef.current && !pickerRef.current.contains(e.target);
        if (!isColorPickerButtonClicked && clickedOutsideColorPicker) {
            setSelectColor(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [formRef, noteRef, setSelectColor]);

    if (!selectColor) return null;

    let colorPickerPosition;
    if (formRef) {
        colorPickerPosition = {
            position: 'fixed',
            width: noteCard ? noteCard.width : 'auto',
            top: noteCard ? noteCard.top - 200 + 'px' : 'auto',
            left: noteCard ? noteCard.left + 'px' : 'auto',
            zIndex: '999',
            animation: 'displayUi 0.2s'
        }
    } else if (noteRef?.current) {
        colorPickerPosition = {
            position: 'absolute',
            top: noteCard ? noteCard.bottom - 6 + 'px' : 'auto',
            left: noteCard ? noteCard.left + 'px' : 'auto',
            animation: 'displayUi 0.2s'
        }
    } else {
        return null;
    }

    return ReactDOM.createPortal(
        <div ref={pickerRef} id='color-picker' className={`${selectColor ? 'color-picker' : 'hidden'}`} style={selectColor ? colorPickerPosition : null}>
            {colors.map((color) => (
                <div role='option' className='color-container' key={color.id}>
                    <div
                        className='color'
                        style={{ backgroundColor: color.hexadecimal, borderColor: pickedColor === color.hexadecimal ? '#ff1493' : color.border }}
                        aria-label={color.color}
                        data-tooltip-id='color-tooltip'
                        data-tooltip-content={color.color}
                        onClick={() => handlePickColor(color.hexadecimal)}
                        onMouseEnter={(e) => e.target.style.borderColor = pickedColor === color.hexadecimal ? '#ff1493' : '#202520'}
                        onMouseLeave={(e) => e.target.style.borderColor = pickedColor === color.hexadecimal ? '#ff1493' : color.border}>

                        {pickedColor === color.hexadecimal && <MdCheckCircle className='picked' />}
                        {color.hexadecimal === 'transparent' && <MdFormatColorReset className='transparent-icon' />}

                    </div>
                </div>
            ))}
            <Tooltip id='color-tooltip' effect="solid" place="bottom" />
        </div>,
        document.body
    )
};