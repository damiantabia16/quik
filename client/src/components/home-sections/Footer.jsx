import { Link } from "react-router-dom"

function Footer() {
    return (
        <footer className="w-full bg-[#202520]">
            <section id="footer" className="md:max-w-[720px] lg:max-w-[1140px] mx-auto">
                <div className="p-[20px] w-full mx-auto">
                    <div className="flex flex-wrap items-start justify-start">
                        <div className="flex flex-row py-[20px] items-center cursor-default">
                            <img className="w-[60px] h-[60px]" src="/public/quik-logo.png" alt="" />
                            <h3 className="text-[48px] font-bold pl-[10px]">Quik</h3>
                        </div>
                        <div className="p-[20px]"></div>
                    </div>
                </div>
            </section>
            <div className="border-t border-t-solid border-[#404540] w-[98%] mx-auto bg-[#eee]"></div>
            <section className="md:max-w-[720px] lg:max-w-[1140px] mx-auto">
                <div className="p-[20px] w-full mx-auto">
                    <div className='text-white opacity-[50%] text-[14px] flex flex-col md:flex-row md:justify-between'>
                        <span>
                            &copy;2023. Hecho por <Link to='https://damiantabia.vercel.app/' target="_blank" className='transition duration-300 hover:text-[#ffdc00]'>Damián Tabia</Link>.
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