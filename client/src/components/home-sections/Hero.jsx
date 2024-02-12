import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"
import quik from './quik-hero.png';

function Hero() {

    const { isAuth } = useAuth();

  return (
    <section id="hero" className="md:max-w-[720px] lg:max-w-[1140px] h-screen mx-auto">
        <div className="px-[20px] w-full mx-auto">
            <div id="items-container" className="flex justify-center items-center flex-wrap mx-[-20px]">
                <div id="text-container" className="pt-[198px] px-[20px] pb-[20px] lg:w-[50%]">
                    <div>
                        <h1 className="font-semibold text-[32px] md:text-[44px] lg:text-[48px] text-center lg:text-left mb-[15px]">Quik simplifica la gestión de tus notas, ideas y proyectos.</h1>
                        <p className="font-medium text-[20px] text-center lg:text-left mb-[30px]">Organiza y mantente organizado para no perderte el día a día.</p>
                    </div>
                    <div>
                        {isAuth ? (
                            <Link to='/tableros'>
                                <button type="button" className="w-full lg:w-auto lg:px-[60px] bg-[#98ff98] text-[#202520] rounded font-medium text-[18px] py-[14px] transition duration-150 hover:bg-[#b8ffb8]">Ir a tus tableros</button>
                            </Link>
                        ) : (
                            <Link to='/registrarse'>
                                <button type="button" className="w-full lg:w-auto lg:px-[60px] bg-[#98ff98] text-[#202520] rounded font-medium text-[18px] py-[14px] transition duration-150 hover:bg-[#b8ffb8]">Crea una cuenta, ¡y organizate!</button>
                            </Link>
                        )}
                    </div>
                </div>
                <div id="img-container" className="p-[20px] lg:pt-[198px] lg:pr-[0] w-full text-center flex justify-center m-auto lg:w-[50%]">
                    <img src={quik} alt="" />
                </div>
            </div>
        </div>
    </section>
  )
};

export default Hero