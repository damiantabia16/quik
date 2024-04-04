import ReactDOM from 'react-dom';
import { useEffect } from "react";
import { useBoard } from "../../../hooks/useBoard";
import { useForm } from "react-hook-form";
import { MdClose } from 'react-icons/md';
import { getPhotos } from '../../../api/unsplash';
import colors from '../../../colors/board_colors.json';
import structure from './structure.png';
import { Button } from '../button/Button';
import Backgrounds from './more-backgrounds/Backgrounds';

export default function CreateBoard() {

    const {
        form,
        setForm,
        isMounted,
        setIsMounted,
        createBoard,
        cancelForm,
        getBoards,
        backgroundImages,
        setBackgroundImages,
        handleBackground,
        backgroundImageIndex,
        setBackgroundImageIndex,
        backgroundColorIndex,
        setBackgroundColorIndex,
        selectedBackground,
        setSelectedBackground,
        moreBackgrounds,
        setMoreBackgrounds } = useBoard();

    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        let timeoutId;

        if (isMounted && !form) {
            setForm(true);
        } else if (!isMounted && form) {
            timeoutId = setTimeout(() => {
                setForm(false);
            }, 100)
        }
        return () => clearTimeout(timeoutId);
    }, [isMounted, form]);

    const mountedStyle = { animation: 'inAnimation 0.2s' }
    const unmountedStyle = { animation: 'outAnimation 0.2s', animationFillMode: "forwards" }

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const images = await getPhotos('technology,landscape,nature');
                setBackgroundImages(images);
                setSelectedBackground(images.length > 0 ? images[0] : null);
            } catch (error) {
                console.error('Error al obtener fotos de Unsplash:', error);
            }
        };
        fetchImages();
    }, []);

    const onSubmit = async (data) => {
        data.background_type = 'image';
        data.background_value = backgroundImages[0].urls.full;
        if (selectedBackground.type === 'image') {
            data.background_type = 'image';
            data.background_value = selectedBackground.urls.full;
        } else if (selectedBackground.type === 'color') {
            data.background_type = 'color';
            data.background_value = selectedBackground.hexadecimal;
        }
        try {
            await createBoard(data);
            setIsMounted(false);
            setForm(false);
            reset();
            getBoards();
            setBackgroundImageIndex(0);
            setBackgroundColorIndex();
            setSelectedBackground(backgroundImages.length > 0 ? backgroundImages[0] : null);
        } catch (error) {
            console.error('Error al crear el tablero:', error);
        }
    };

    if (!form) return null;

    return ReactDOM.createPortal(
        <>
            <div className='overlay' style={isMounted ? mountedStyle : unmountedStyle} />
            <section id='create-board-form' className='box' style={isMounted ? mountedStyle : unmountedStyle}>
                <div className='create-board-form-container close-shadow'>
                    <header className='create-board-header'>
                        <h2>Crear tablero</h2>
                        <button onClick={() => { reset(); setTimeout(() => { cancelForm(); setIsMounted(false); }) }}>
                            <MdClose />
                        </button>
                    </header>
                    <div className='form-container'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className='board-name-container' aria-label='Seleccionar fondo del tablero' aria-labelledby='board_title'>
                                <label id='board_title' htmlFor="board_name">Título del tablero</label>
                                <input id='board_name' type="text" autoComplete='off' {...register('board_name', { required: true })} />
                            </div>
                            <div className='board-background-container' aria-label='Seleccionar fondo del tablero' aria-labelledby='background_label'>
                                <div className='board-background-label'>
                                    <span id="background_label" htmlFor="background_value">Fondo</span>
                                </div>
                                <div className='board-background-picker-container'>
                                    <ul className='board-background-picker board-background-image-picker'>
                                        {backgroundImages.slice(0, 4).map((image, index) => (
                                            <li key={image.id} className='background-image'>
                                                <button
                                                    type='button'
                                                    className={`background-image-picker picker ${index === backgroundImageIndex ? 'active' : ''}`}
                                                    style={{
                                                        backgroundImage: `url(${image.urls.small})`,
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center',
                                                        width: '100%',
                                                        height: '100%'
                                                    }}
                                                    onClick={() => handleBackground(image, index, 'image')}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                    <ul className='board-background-picker'>
                                        {colors.slice(0, 5).map((color, index) => (
                                            <li key={color.id} className='background-color'>
                                                <button
                                                    type='button'
                                                    title={`${color.color}`}
                                                    className={`background-color-picker picker ${index === backgroundColorIndex ? 'active' : ''}`}
                                                    style={{
                                                        backgroundColor: `${color.hexadecimal}`,
                                                        width: '100%',
                                                        height: '100%'
                                                    }}
                                                    onClick={() => handleBackground(color, index, 'color')}
                                                />
                                            </li>
                                        ))}
                                        <li className='more-background-images-colors'>
                                            <button onClick={() => setMoreBackgrounds(!moreBackgrounds)} type='button' title='Ver más'>...</button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className='background-example-container'>
                                <div
                                    className='background-example'
                                    style={{
                                        backgroundImage: selectedBackground && selectedBackground.urls
                                            ? `url(${selectedBackground.urls.small})`
                                            : 'none',
                                        backgroundPosition: 'center',
                                        backgroundSize: 'cover',
                                        backgroundColor: selectedBackground
                                            ? selectedBackground.hexadecimal
                                            : 'transparent',
                                    }}
                                >
                                    <img src={structure} alt="Presentación estructural del tablero" />
                                </div>
                            </div>
                            <div className='submit-form-button'>
                                <Button type='submit'>Crear</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
            <Backgrounds
                moreBackgrounds={moreBackgrounds}
                setMoreBackgrounds={setMoreBackgrounds}
                backgroundImages={backgroundImages}
                colors={colors}
                backgroundImageIndex={backgroundImageIndex}
                backgroundColorIndex={backgroundColorIndex}
                handleBackground={handleBackground}
            />
        </>,
        document.body
    )
}