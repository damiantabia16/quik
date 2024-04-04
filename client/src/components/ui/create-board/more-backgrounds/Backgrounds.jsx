import ReactDOM from 'react-dom';
import { MdClose } from 'react-icons/md';
import './backgrounds.css'

function Backgrounds({ moreBackgrounds, setMoreBackgrounds, backgroundImages, colors, backgroundImageIndex, backgroundColorIndex, handleBackground }) {

    const mountedStyle = { animation: 'inAnimation 0.2s' }
    const unmountedStyle = { animation: 'outAnimation 0.2s', animationFillMode: "forwards" }

    if (!moreBackgrounds) return null;

    return ReactDOM.createPortal(
        <section id='more-menu' className='close-shadow' style={moreBackgrounds ? mountedStyle : unmountedStyle}>
            <header className='more-backgrounds-header'>
                <h2>Fondo del tablero</h2>
                <button onClick={() => setMoreBackgrounds(false)}>
                    <MdClose />
                </button>
            </header>
            <div className='backgrounds-container'>
                <div className='backgrounds-images-colors-container'>
                    <header className='backgrounds-images-colors-container-header'>
                        <h1>Fotos</h1>
                    </header>
                    <ul>
                        {backgroundImages.slice(0, 9).map((image, index) => (
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
                </div>
                <div className='backgrounds-images-colors-container'>
                    <header className='backgrounds-images-colors-container-header'>
                        <h1>Colores</h1>
                    </header>
                    <ul>
                        {colors.slice(0, 9).map((color, index) => (
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
                    </ul>
                </div>
            </div>
        </section>,
        document.body
    )
}

export default Backgrounds