// Componentes principais
import History from "../components/History"

// Componentes extras
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

// Libraries/Hooks
import { useNavigate } from "react-router-dom";
import { LogIn, LogOut, Sparkles } from "lucide-react"
import { LoginModal } from "@/components/LoginDialog";

interface HomeProps {
    isSidebarOpen: boolean;
    isHistoryOpen: boolean;
    toggleHistory: () => void;
    login: (userData: any) => void;
    logout: () => void;
    user: any;
}

const Home = ({ isSidebarOpen, isHistoryOpen, toggleHistory, login, logout, user }: HomeProps) => {
    const navigate = useNavigate();    
    
    return (
    <div className="flex flex-row h-screen">
        <div className={`flex-shrink-0 ${isHistoryOpen ? 'w-[200px] sm:w-[285px] xl:w-[400px]' : 'w-0'}`}>
          {user && <History isSidebarOpen={isSidebarOpen} isOpen={isHistoryOpen} toggleHistory={toggleHistory} user={user} />}
        </div>        

        {/* Conteúdo da página */}

        <div className={`flex flex-col flex-grow bg-[#323232]/3 items-center py-12 overflow-y-auto scrollbar-thin`}>            
            <div className="flex flex-col items-center">
                <div className="flex flex-row items-center gap-2 pb-[12px]">
                    <div className="flex w-[40px] h-[40px] items-center justify-center bg-gradient-to-r rounded-md from-teal-500 via-teal-400 to-teal-200">
                        <Sparkles className="text-white" size={24}/>
                    </div>
                    <h2 className="text-[26px] font-bold sm:text-[32px] text-center bg-gradient-to-r from-[#1F3D58] to-teal-500 text-transparent bg-clip-text">Interação com IA</h2>
                </div>
                <p className="text-[#323232]/85 font-regular text-center">Um sistema de interação com IA para análise de dados.</p>
            </div>
            {!user ? (
                <div className="flex flex-col items-center h-60 w-md bg-white border-2 rounded-md my-8 justify-center gap-6">
                    <div>
                        <p className="text-[#323232]/85 font-regular text-center">Você não está autenticado.</p>
                        <p className="text-[#323232]/85 font-regular text-center">Para entrar clique no botão de login.</p>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <LogIn className="mr-2" size={18} /> Login
                            </Button>
                        </DialogTrigger>
                        <LoginModal login={login} />
                    </Dialog>
                </div>
            ): (    
                <div className="flex flex-col items-center h-60 w-md bg-white border-2 rounded-md my-8 justify-center gap-6">
                    <div>
                        <p className="text-[#323232]/85 font-regular text-center">Olá {user.nome}.</p>
                        <p className="text-[#323232]/85 font-regular text-center">Seja bem-vindo!</p>
                    </div>
                    <Button 
                        className="bg-red-500 hover:bg-red-600" 
                        onClick={() => {
                            isHistoryOpen && toggleHistory();
                            logout()
                        }}
                    >
                        <LogOut />
                        Sair
                    </Button>
                </div>
            )}
        </div>
    </div>
  )
}

export default Home