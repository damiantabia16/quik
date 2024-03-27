import { useState } from "react";
import { FaRegClipboard } from 'react-icons/fa';
import { BsFileText } from 'react-icons/bs';
import images from './presentationImages.json';

function Slider({ imageIndex }) {
  return (
    <div className="slider">
      {images.map((image) => (
        <img key={image.id} className='image-transition' src={image.url} alt={image.alt} style={{ translate: `${-100 * imageIndex}%`, borderRadius: '0.5rem' }} />
      ))}
    </div>
  )
}

function Content() {

  const [descriptionVisible, setDescriptionVisible] = useState('board');
  const [imageIndex, setImageIndex] = useState(0);

  const toggleDescription = (type) => {
    if (type !== descriptionVisible) {
      setDescriptionVisible(type);
    }
  };

  const showBoards = () => {
    setImageIndex(0);
  }

  const showNotes = () => {
    setImageIndex(1);
  }

  return (
    <div className="content-wrapper">
      <div className="content">
        <div className={`boards-notes ${descriptionVisible === 'board' || descriptionVisible === 'note' ? 'lg:w-[50%]' : ''}`}>
          <div
            role="button"
            onClick={() => { toggleDescription('board'); showBoards(); }}
            className={`boards-notes-button ${descriptionVisible === 'board' ? 'active' : 'hover:bg-accent'}`}
          >
            <FaRegClipboard />
            <div className={`presentation-description ${descriptionVisible === 'board' ? 'active' : 'unactive'}`}>
              <h2>Tableros</h2>
              <p>Donde nace el orden. Aquí es donde te organizaras en base a tus necesidades. Puedes estilizarlos como gustes, ya sea con un color plano o con imágenes que harán sentirte en sintonía con tus ideas.</p>
            </div>
          </div>
          <div
            role="button"
            onClick={() => { toggleDescription('note'); showNotes(); }}
            className={`boards-notes-button ${descriptionVisible === 'note' ? 'active' : 'hover:bg-accent'}`}
          >
            <BsFileText />
            <div className={`presentation-description ${descriptionVisible === 'note' ? 'active' : 'unactive'}`}>
              <h2>Notas</h2>
              <p>Tu biblioteca de ideas, sentimientos y pasiones. Escribe lo que quieras, cómo quieras y cuando quieras dandole estilos únicos que conecten con lo más profundo de tus pensamientos.</p>
            </div>
          </div>
        </div>
        <Slider imageIndex={imageIndex} />
      </div>
    </div>
  )
};

function Presentation() {
  return (
    <section id="presentation">
      <div className="presentation-container">
        <div className="presentation-header">
          <p>¿POR QUÉ QUIK?</p>
          <h2>La herramienta perfecta para simplificar tu flujo de trabajo.</h2>
          <p>Una manera sencilla, adaptable y poderosa de mantener tu vida en control. Con solo crear un tablero y diseñarlo a tu gusto podrás ver como todo se vuelve más fácil.</p>
        </div>
        <Content />
      </div>
    </section>
  )
};

export default Presentation