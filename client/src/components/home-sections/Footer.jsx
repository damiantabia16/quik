function Footer() {
    return (
        <footer>
            <section id="footer">
                <div className="footer-container">
                    <div className="footer-content">
                        <div className="info">
                            <img src="/quik-logo.png" alt="Quik Logo - Footer" />
                            <h3>Quik</h3>
                        </div>
                    </div>
                </div>
            </section>
            <div className="footer-line" />
            <section className="author-rights-container">
                <div className="author-rights">
                    <div className='author-rights-content'>
                        <span>
                            &copy;2023. Hecho por <a href='https://damiantabia.vercel.app/' target="_blank" className='transition duration-200 hover:text-[#ffdc00]'>Damián Tabia</a>.
                        </span>
                        <span>
                            Todos los derechos reservados.
                        </span>
                    </div>
                </div>
            </section>
        </footer>
    )
}

export default Footer