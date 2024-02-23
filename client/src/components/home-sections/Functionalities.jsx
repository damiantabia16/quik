import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import functionalities from './functionalities.json';
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

function SamplePrevArrow({ onClick }) {
  return (
    <div onClick={onClick} role='button' id='prev' className='absolute z-[1] w-[40px] h-[40px] right-[80px] top-0 text-[#202520] transition-all duration-100 hover:text-[#98ff98]'>
      <MdNavigateBefore className='w-full h-full' />
    </div>
  )
}

function SampleNextArrow({ onClick }) {
  return (
    <div onClick={onClick} role='button' id='next' className='absolute z-[1] w-[40px] h-[40px] right-[20px] top-0 text-[#202520] transition-all duration-100 hover:text-[#98ff98]'>
      <MdNavigateNext className='w-full h-full' />
    </div>
  )
}

function Carousel() {

  const settings = {
    infinite: true,
    speed: 150,
    initialSlide: 0,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <SamplePrevArrow />,
    nextArrow: <SampleNextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      },
    ]
  };

  return (
    <div className='w-full pb-[20px]'>
      <Slider {...settings} className='w-full h-auto'>
        {functionalities.map((item) => (
          <div key={item.id} className='p-[20px]'>
            <div className='w-full h-auto bg-[#eeeeee] rounded-lg transition-all duration-150 hover:shadow-2xl'>
              <div className='h-[48px] rounded-t-md' style={{ backgroundColor: item.color }} />
              <div className='pt-[36px] px-[20px] pb-[20px]'>
                <div className='absolute h-[3rem] w-[3rem] top-[5.25rem] rounded-lg' style={{ backgroundColor: '#eeeeee', backgroundImage: `url(${item.urlSmall})`, backgroundPosition: 'center center', backgroundRepeat: 'no-repeat', backgroundSize: 'contain' }} />
                <h3 className='text-[#202520] font-bold text-[20px] mb-[8px]'>{item.title}</h3>
                <p className='text-[#202520] font-medium'>{item.function}</p>
              </div>
              <div className='w-[200px] h-auto m-auto pb-[36px]'>
                <img className='w-full h-full' src={item.url} alt="" />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}

function Functionalities() {
  return (
    <section id="functionalities" className="md:max-w-[720px] lg:max-w-[1140px] h-full mx-auto">
      <div className="p-[20px]">
        <div className="flex flex-wrap lg:flex-start lg:items-center md:w-[61%]">
          <div>
            <p className="mb-[8px] font-medium">FUNCIONALIDADES DE QUIK</p>
            <h2 className="mb-[16px] text-[24px] md:text-[32px] text-left font-semibold">Optimiza tu productividad de manera intuitiva.</h2>
          </div>
        </div>
      </div>
      <Carousel />
    </section>
  )
};

export default Functionalities