import { useState } from 'react'
import { Plus, Bot, Ellipsis, Wrench } from 'lucide-react';
import UserIcon from '../assets/UserIcon.png'

const Sidebar = () => {
      const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      {/* Botão para mobile */}
      <button 
        className="fixed top-4 left-4 z-50 p-2 text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <span className="sr-only">Toggle sidebar</span>
      </button>

      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 sm:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          flex flex-col justify-between fixed z-40 w-22 min-h-screen max-h-screen transition-transform duration-300 ease-in-out bg-[#495057] border-r border-gray-200
          ${isOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
          flex-shrink-0
        `}
        aria-label="Sidebar"
      >
        <div className="h-full py-8">
            <div className="flex justify-center">
                <a href="/" className="flex justify-center mb-8 w-12 h-12 bg-white rounded-full">
                    <img src={UserIcon} className="mt-2 w-8 h-8" alt="" />            
                </a>
            </div>          
          
          <nav className='py-8'>
            <ul className="space-y-2 justify-center font-medium">
              <li className='hover:border-l-4 hover:border-l-[#D9D9D9]'>
                <a 
                  href="/" 
                  className="flex justify-center py-3 text-gray-900 hover:bg-white/15 hover:text-emerald-700 transition-colors group"
                >
                  <Plus className="text-[#4CAF50]" size={22} />
                </a>
              </li>
              
              <li className='hover:border-l-4 hover:border-l-[#D9D9D9]'>
                <a 
                  href="/" 
                  className="flex justify-center py-3 text-gray-900 hover:bg-white/15 hover:text-emerald-700 transition-colors group"
                >
                  <Bot className="text-[#4CAF50]" size={22} /> 
                </a>
              </li>                       
              
              <li className='hover:border-l-4 hover:border-l-[#D9D9D9]'>
                <a 
                  href="/" 
                  className="flex justify-center py-3 text-gray-900 hover:bg-white/15 hover:text-emerald-700 transition-colors group"
                >
                  <Ellipsis className="text-[#4CAF50]" size={22} />
                </a>
              </li>              
            </ul>
          </nav>          
        </div>
        <nav className='py-8 mt-auto'>
            <ul className="space-y-2 justify-center font-medium">
                <li className='hover:border-l-4 hover:border-l-[#D9D9D9]'>
                <a 
                    href="/" 
                    className="flex justify-center py-3 text-gray-900 hover:bg-white/15 hover:text-emerald-700 transition-colors group"
                >
                    <Wrench className="text-[#4CAF50]" size={22} />
                </a>
                </li>
            </ul>
        </nav>       
      </aside>
    </>
  )
}

export default Sidebar