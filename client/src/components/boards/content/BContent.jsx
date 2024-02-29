import { useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { getPhotos } from '../../../api/unsplash';
import colors from '../../../colors/board_colors.json';
import structure from './structure.png';
import { useForm } from 'react-hook-form';
import { useBoard } from '../../../hooks/useBoard';
import { Link } from 'react-router-dom';

function Searcher() {
  return (
    <div className='relative mt-[20px] w-full max-w-[600px] px-[20px] mb-[8px] flex items-center justify-center mx-auto'>
      <div className='w-full relative flex shadow-lg'>
        <FaSearch className='absolute top-[30%] text-[#404540] right-3' />
        <input className='w-full outline-none rounded px-[15px] py-[10px] text-[#202520]' type="text" placeholder='Buscar tableros' />
      </div>
    </div>
  )
};

export function CreateBoard() {

  const { form, setForm, isMounted, setIsMounted, createBoard, cancelForm, getBoards, backgroundImages, setBackgroundImages, handleBackground, backgroundImageIndex, setBackgroundImageIndex, backgroundColorIndex, setBackgroundColorIndex, selectedBackground, setSelectedBackground } = useBoard();

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

  return (
    <>
      {form && (
        <>
          <div className={`fixed w-screen h-screen top-0 bottom-0 left-0 right-0 z-[9999] bg-[#00000070] overflow-hidden transition-opacity duration-100`} style={isMounted ? mountedStyle : unmountedStyle} />
          <section className={`fixed flex justify-center items-center w-full h-full left-0 right-0 bottom-0 top-0 z-[10000] transition-opacity duration-100`} style={isMounted ? mountedStyle : unmountedStyle}>
            <div className='h-auto w-[320px] bg-[#202520] rounded close-shadow'>
              <header className='relative grid items-center grid-cols-[32px_1fr_32px] leading-[40px] p-[20px]'>
                <h2 className='relative row-start-1 col-[1_/_span_3] text-[18px] font-bold text-center cursor-default whitespace-nowrap'>Crear tablero</h2>
                <button onClick={() => { reset(); setTimeout(() => { cancelForm(); setIsMounted(false); }) }} className='flex col-3 row-start-1'>
                  <MdCancel />
                </button>
              </header>
              <div className='px-[20px] pb-[20px]'>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className='flex flex-wrap items-center justify-start mb-[8px]'>
                    <div>
                      <label htmlFor="board_name" className='text-[14px]'>Título del tablero</label>
                    </div>
                    <input type="text" className='w-full rounded outline-none px-[5px] py-[4px] bg-[#404540] text-[14px] mt-[4px]' autoComplete='off' {...register('board_name', { required: true })} />
                  </div>
                  <div>
                    <div className='py-[4px]'>
                      <label htmlFor="background_value" className='text-[14px]'>Fondo</label>
                    </div>
                    <div className='relative'>
                      <ul className='flex justify-between gap-x-2 pb-[8px]'>
                        {backgroundImages.slice(0, 4).map((image, index) => (
                          <li key={image.id} className='w-[64px] h-[40px]'>
                            <button
                              type='button'
                              className={`rounded flex items-center justify-center relative outline-none transition duration-100 hover:brightness-50 ${index === backgroundImageIndex ? 'brightness-50' : ''}`}
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
                      <ul className='flex justify-between gap-x-2'>
                        {colors.slice(0, 5).map((color, index) => (
                          <li key={color.id} className='w-[40px] h-[32px]'>
                            <button
                              type='button'
                              title={`${color.color}`}
                              className={`rounded outline-none transition duration-100 hover:brightness-75 ${index === backgroundColorIndex ? 'brightness-75' : ''}`}
                              style={{
                                backgroundColor: `${color.hexadecimal}`,
                                width: '100%',
                                height: '100%'
                              }}
                              onClick={() => handleBackground(color, index, 'color')}
                            />
                          </li>
                        ))}
                        <li className='w-[40px] h-[32px]'>
                          <button type='button' title='Ver más' className='rounded w-full h-full bg-[#A1BDD914] text-[#c6c6c6] outline-none transition duration-100 hover:bg-[#454D45]'>...</button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className='flex justify-center py-[40px]'>
                    <div
                      className='flex items-center justify-center rounded w-[200px] h-[120px] bg-center bg-cover'
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
                      <img className='w-full h-full' src={structure} alt="Structure presentation" />
                    </div>
                  </div>
                  <div className='pb-[10px]'>
                    <button type='submit' className={`text-center text-[14px] w-full rounded bg-[#98ff98] text-[#202520] py-[6px] font-medium outline-none hover:bg-[#b8ffb8]`}>Crear</button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  )
}

function BoardsGrid() {

  const { boards, getBoards, toggleForm } = useBoard();

  useEffect(() => {
    getBoards();
  }, []);

  return (
    <div className='relative w-full max-w-[1320px] mx-auto mt-[40px]'>
      <div>
        <ul className='flex flex-wrap justify-start'>
          <li className='relative px-[20px] py-[10px] w-full sm:w-[50%] lg:w-[33.33333%] 2xl:w-[25%]'>
            <div onClick={toggleForm} className='p-[10px] w-full h-[120px] rounded-md bg-[#404540] transition-all duration-100 ease-in-out cursor-pointer hover:bg-[#505550] flex items-center justify-center select-none'>
              <p className='text-center'>Crear un tablero</p>
            </div>
          </li>
          {boards.map((board) => (
            <li key={board.id} className='relative px-[20px] py-[10px] w-full sm:w-[50%] lg:w-[33.33333%] 2xl:w-[25%]'>
              <Link to={`/tableros/${board.id}`}>
                <div className='element relative p-[10px] w-full h-[120px] rounded-md bg-[#0079bf] cursor-pointer flex items-start justify-start select-none'
                  style={{
                    backgroundImage: board.background_type === 'image'
                      ? `url(${board.background_value})`
                      : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: board.background_type === 'color'
                      ? board.background_value
                      : 'transparent'
                  }}>
                  <span id='hover' className='absolute bg-[#0000004d] top-0 right-0 rounded bottom-0 left-0'></span>
                  <p className='font-bold z-[1]'>{board.board_name}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function BContent() {
  return (
    <>
      <section id="boards" className="pt-[12px] pl-[70px] flex flex-col flex-1 overflow-y-auto w-full">
        <Searcher />
        <BoardsGrid />
      </section>
      <CreateBoard />
    </>
  )
};

export default BContent