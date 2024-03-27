import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"
import quik from './quik-hero.png';

function Hero() {

    const { isAuth } = useAuth();

    return (
        <section id="hero">
            <div className="hero-container">
                <div className="items-container">
                    <div className="text-container">
                        <h1>Quik simplifica la gestión de tus notas, ideas y proyectos.</h1>
                        <p>Organiza y mantente organizado para no perderte el día a día.</p>
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
                    <div className="img-container">
                        <img src={quik} alt="Presentación de Quik" />
                    </div>
                </div>
            </div>
        </section>
    )
};

export default Hero