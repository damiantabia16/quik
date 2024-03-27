import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import functionalities from './functionalities.json';
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

function SamplePrevArrow({ onClick }) {
  return (
    <div onClick={onClick} role='button' id='prev'>
      <MdNavigateBefore />
    </div>
  )
}

function SampleNextArrow({ onClick }) {
  return (
    <div onClick={onClick} role='button' id='next'>
      <MdNavigateNext />
    </div>
  )
}

function Carousel() {

  const settings = {
    infinite: true,
    speed: 200,
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
    <div className='carousel-wrapper'>
      <Slider {...settings} className='carousel-slider'>
        {functionalities.map((item) => (
          <div key={item.id} className='card-container'>
            <div className='card transition-all duration-200 hover:shadow-2xl'>
              <div className='card-header' style={{ backgroundColor: item.color }} />
              <div className='card-description'>
                <div style={{
                  backgroundColor: '#eee',
                  backgroundImage: `url(${item.urlSmall})`,
                  backgroundPosition: 'center center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'contain' }}
                />
                <h3>{item.title}</h3>
                <p>{item.function}</p>
              </div>
              <div className='card-img'>
                <img src={item.url} alt={item.alt} />
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
    <section id="functionalities">
      <div className="functionalities-container">
        <div className="functionalities-header">
          <p>FUNCIONALIDADES DE QUIK</p>
          <h2>Optimiza tu productividad de manera intuitiva.</h2>
        </div>
      </div>
      <Carousel />
    </section>
  )
};

export default Functionalities