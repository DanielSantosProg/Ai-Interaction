// Componentes principais
import History from "../components/History"

// Libraries
import { ChevronsLeft, ChevronsRight, GalleryVerticalEnd } from "lucide-react"

interface HistoryToggleProps {
    isSidebarOpen: boolean;
    isHistoryOpen: boolean;
    toggleHistory: () => void;
    user: any;
}

const HistoryToggle = ({ isSidebarOpen, isHistoryOpen, toggleHistory, user }: HistoryToggleProps) => {

  return (
    <div className="flex flex-row h-screen">

      {/* Uso do Componente History */}
      <button
          className={`group fixed top-16 left-4 z-50 p-2 rounded-lg hover:bg-[#1F3D58] border-black hover:border-2 hover:border-white focus:outline-none
          ${isSidebarOpen ? "transform translate-x-[72px]" : ""}
          ${isHistoryOpen && 'fixed left-[230px] xl:left-[330px]'}`}          
          onClick={toggleHistory}
      >
          <span className="sr-only">Toggle History</span>
          <div className="flex flex-row items-center gap-1">
            {isHistoryOpen ? (
                <>
                    <ChevronsLeft className="text-[#323232] group-hover:text-white group-hover:animate-ping" size={14}/>
                    <GalleryVerticalEnd className='text-[#323232] group-hover:text-white' size={18}/>
                </>                
                ) : (
                <>
                    <GalleryVerticalEnd className='text-[#323232] group-hover:text-white' size={18}/>
                    <ChevronsRight className="text-[#323232] group-hover:text-white transition-transform duration-300" size={14}/>
                </>
                )
            }
            
          </div>
      </button>
            
      {/* Passa o estado e a função para o componente History */}
      <div className={`sm:flex-shrink-0 ${isHistoryOpen ? 'w-[200px] sm:w-[285px] xl:w-[400px]' : 'w-0'}`}>
          {user && <History isOpen={isHistoryOpen} user={user} />}
      </div>     
    </div>
  )
}

export default HistoryToggle;