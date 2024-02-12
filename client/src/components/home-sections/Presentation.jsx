import { useState } from "react";
import { FaRegClipboard } from 'react-icons/fa';
import { BsFileText } from 'react-icons/bs';
import images from './presentationImages.json';

function Slider({ imageIndex }) {
  return (
    <div className="relative order-2 text-center lg:w-[45%] h-full lg:flex-[0_0_auto] m-auto flex overflow-hidden grow-0">
      {images.map((image) => (
          <img key={image.id} className={`w-full h-full object-cover block lg:p-[20px] shrink-0 grow-0 image-transition`} src={image.url} alt={image.alt} style={{ translate: `${-100 * imageIndex}%` }} />
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
    <div className="mt-[60px] mb-[40px]">
      <div>
        <div className="flex justify-start items-stretch flex-wrap relative">
            <div className={`flex flex-col justify-between gap-[16px] z-[1000] pb-[20px] ${descriptionVisible === 'board' || descriptionVisible === 'note' ? 'lg:w-[50%]' : ''}`}>
              <div role="button" onClick={() => {toggleDescription('board'); showBoards();}} className={`outline-none w-[100px] h-[100px] md:w-[140px] md:h-[140px] lg:w-[170px] lg:h-[170px] flex items-center rounded-full bg-[#98ff98] transition-all duration-150 ${descriptionVisible === 'board' ? 'w-full md:w-full lg:w-full rounded-none conditional-rounded shadow-2xl bg-[#b8ffb8]' : 'hover:bg-[#b8ffb8]'}`}>
                <FaRegClipboard className="text-[#202520] w-[40px] h-[40px] md:w-[60px] md:h-[60px] lg:w-[80px] lg:h-[80px] mx-[30px] md:mx-[40px] lg:mx-[45px] shrink-0" />
                <div className={`text-left text-[10px] sm:text-[13px] md:text-[15px] text-ellipsis overflow-hidden lg:min-w-[380px] transition-all duration-150 ${descriptionVisible === 'board' ? 'pr-[20px] sm:pr-[30px] md:pr-[45px] lg:pr-[80px] xl:pr-[45px] visible opacity-100' : 'invisible opacity-0'}`}>
                  <h2 className="text-[#202520] font-bold lg:mb-[5px]">Tableros</h2>
                  <p className="text-[#202520] font-medium">Donde nace el orden. Aquí es donde te organizaras en base a tus necesidades. Puedes estilizarlos como gustes, ya sea con un color plano o con imágenes que harán sentirte en sintonía con tus ideas.</p>
                </div>
              </div>
              <div role="button" onClick={() => {toggleDescription('note'); showNotes();}} className={`outline-none w-[100px] h-[100px] md:w-[140px] md:h-[140px] lg:w-[170px] lg:h-[170px] flex items-center rounded-full bg-[#98ff98] transition-all duration-150 ${descriptionVisible === 'note' ? 'w-full md:w-full lg:w-full rounded-none conditional-rounded shadow-2xl bg-[#b8ffb8]' : 'hover:bg-[#b8ffb8]'}`}>
                <BsFileText className="text-[#202520] w-[40px] h-[40px] md:w-[60px] md:h-[60px] lg:w-[80px] lg:h-[80px] mx-[30px] md:mx-[40px] lg:mx-[45px] shrink-0" />
                <div className={`text-left text-[10px] sm:text-[13px] md:text-[15px] text-ellipsis overflow-hidden lg:min-w-[380px] transition-all duration-150 ${descriptionVisible === 'note' ? 'pr-[20px] sm:pr-[30px] md:pr-[45px] lg:pr-[80px] xl:pr-[45px] visible opacity-100' : 'invisible opacity-0'}`}>
                  <h2 className="text-[#202520] font-bold lg:mb-[5px]">Notas</h2>
                  <p className="text-[#202520] font-medium">Tu biblioteca de ideas, sentimientos y pasiones. Escribe lo que quieras, cómo quieras y cuando quieras dandole estilos únicos que conecten con lo más profundo de tus pensamientos.</p>
                </div>
              </div>
            </div>
          <Slider imageIndex={imageIndex} />
        </div>
      </div>
    </div>
  )
};

function Presentation() {
  return (
    <section id="presentation" className="md:max-w-[720px] lg:max-w-[1140px] h-full mx-auto">
      <div className="p-[20px]">
        <div className="flex flex-wrap lg:flex-start lg:items-center md:w-[61%]">
          <div>
            <p className="mb-[8px] font-medium">¿POR QUÉ QUIK?</p>
            <h2 className="mb-[16px] text-[24px] md:text-[32px] text-left font-semibold">La herramienta perfecta para simplificar tu flujo de trabajo.</h2>
          </div>
          <div>
            <p className="text-[18px]">Una manera sencilla, adaptable y poderosa de mantener tu vida en control. Con solo crear un tablero y diseñarlo a tu gusto podrás ver como todo se vuelve más fácil.</p>
          </div>
        </div>
        <Content />
      </div>
    </section>
  )
};

export default Presentation