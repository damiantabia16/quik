import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"
import { Button } from "../ui/button/Button";
import quik from '/img/quik-hero.webp';

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
                                    <Button className="register-login-button">Ir a tus tableros</Button>
                                </Link>
                            ) : (
                                <Link to='/registrarse'>
                                    <Button className="register-login-button">Crea una cuenta, ¡y organizate!</Button>
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