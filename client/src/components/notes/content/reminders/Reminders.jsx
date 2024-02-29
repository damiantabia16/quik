import { FaSearch } from 'react-icons/fa';

function Searcher() {
  return (
    <div className='relative mt-[20px] w-full max-w-[600px] px-[20px] mb-[8px] flex items-center justify-center mx-auto'>
      <div className='w-full relative flex shadow-lg'>
        <FaSearch className='absolute top-[30%] text-[#404540] right-3' />
        <input className='w-full outline-none rounded px-[15px] py-[10px] text-[#202520]' type="text" placeholder='Buscar en recordatorios... ' />
      </div>
    </div>
  )
};

function Reminders() {
  return (
    <section id="reminders" className="pt-[12px] pl-[70px] flex flex-col flex-1 overflow-y-auto w-full">
      <Searcher />
    </section>
  )
}

export default Reminders