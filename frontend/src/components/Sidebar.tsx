import { Plus, Bot, Ellipsis, Wrench, Menu } from 'lucide-react';
import UserIcon from '../assets/UserIcon.png'

interface SidebarProps {
  handleSidebarOpen: () => void;
  isSidebarOpen: boolean; // Adicione esta tipagem também
}

const Sidebar = ({ handleSidebarOpen, isSidebarOpen }: SidebarProps) => {
  
  return (
    <>
      {/* Botão para mobile */}
      <button 
        className={`
          group fixed top-4 z-50 p-2 rounded-lg sm:hidden bg-white hover:bg-[#1F3D58] border-[#1F3D58] hover:border-2 focus:outline-none transition-all duration-100 ease-in-out
          ${isSidebarOpen ? 'left-[85px]' : 'left-4'}
        `}
        onClick={handleSidebarOpen}
      >
        <span className="sr-only">Toggle sidebar</span>
        <Menu className='text-black group-hover:text-white' size={18}/>
      </button>

      {/* Overlay para mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-[#323232]/50 sm:hidden"
          onClick={handleSidebarOpen}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          flex flex-col justify-between fixed z-40 w-22 min-h-screen max-h-screen transition-transform duration-300 ease-in-out bg-[#495057]
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
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
          
          <nav className='py-4 lg:py-8'>
            <ul className="space-y-1 lg:space-y-2 justify-center font-medium">
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
        <nav className='py-4 mt-auto lg:py-8'>
          <ul className="space-y-1 justify-center font-medium lg:space-y-2">
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