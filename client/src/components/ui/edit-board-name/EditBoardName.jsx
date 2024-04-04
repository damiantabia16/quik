import ReactDOM from 'react-dom';
import { useBoard } from '../../../hooks/useBoard';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Button } from '../button/Button';
import './edit-board.css';

function EditBoardName({ edit, setEdit }) {

    const { board, getBoards, updateBoard } = useBoard();

    const { register, handleSubmit, setValue } = useForm();

    useEffect(() => {
        if (board) {
            setValue('board_name', board.board_name);
        }
    }, [board])

    const mountedStyle = { animation: 'inAnimation 0.2s' }
    const unmountedStyle = { animation: 'outAnimation 0.2s', animationFillMode: "forwards" }

    const onSubmit = async (data) => {
        try {
            await updateBoard({...board, ...data});
            setEdit(false);
            getBoards();
        } catch (error) {
            console.log('Error al cambiar el nombre del tablero:', error);
        }
    }

    if (!edit) return null;

    return ReactDOM.createPortal(
        <>
            <div className='overlay' style={edit ? mountedStyle : unmountedStyle} />
            <div className='box' style={edit ? mountedStyle : unmountedStyle}>
                <form onSubmit={handleSubmit(onSubmit)} className='edit-board-name'>
                    <label htmlFor="edit_board_name">Cambiar nombre</label>
                    <input id='edit_board_name' type="text" {...register('board_name', { required: true })} autoComplete='off' />
                    <div className='submit-change'>
                        <Button size='md'>Guardar</Button>
                        <Button size='md' variant='outline' onClick={() => setEdit(false)}>Cancelar</Button>
                    </div>
                </form>
            </div>
        </>,
        document.body
    )
}

export default EditBoardName