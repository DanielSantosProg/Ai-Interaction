import React from "react";
import logo from "../assets/reisoflogo.jpg"
import HoverCardComponent from "./HoverCard"
import SelectComponent from "./Select"
import axios from "axios"
import { ChevronFirst, ChevronLast, FileStack, Loader2Icon } from "lucide-react";

// Interfaces
interface HistoryProps {
    isSidebarOpen: boolean;
    isOpen: boolean;
    toggleHistory: () => void;
    user: any;
}

interface CardData {
    ID: number;
    USR_NOME: string;
    PROMPT: string;
    TITULO: string;
    DT_CRIACAO: string;
    FILTROS: string;
    RETORNO: string;
    MODELO: string;
}

const History = ({ isOpen, toggleHistory, user }: HistoryProps) => {
    const [loading, setLoading] = React.useState(true);
    const userId = user ? user.id : null;
    const API_URL = "http://localhost:3001/proxy/interactions"
    const [cards, setCards] = React.useState<CardData[]>([]);
    const [showAll, setShowAll] = React.useState<boolean>(true);

    const handleSelectChange = (value: string) => {
        setShowAll(value === "todas");
    };

    function historyGet() {
        console.log("Dados carregados.");
    }

    React.useEffect(() => {
        async function getHistory() {
            try {
                setLoading(true);
                const response = showAll ?  await axios.get(`${API_URL}?id_empresa=${user.id_empresa}`) : await axios.get(`${API_URL}?id_empresa=${user.id_empresa}&id=${userId}`);
                await setTimeout(historyGet, 5000);
                console.log("Dados do histórico carregados com sucesso.");
                
                setCards(response.data);
                setLoading(false);
                
            } catch (error) {
                if (error instanceof Error) {
                console.error("Erro ao buscar o histórico:", error.message);
                } else {
                console.error("Erro ao buscar o histórico:", error);
                }
                setLoading(false);
                throw error;
            }
        }
        getHistory();
    }, [showAll]);  

  return (
        <div className={`w-full flex-col items-center h-full flex transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            {!isOpen ?
            (
                <div className="group relative right-10 top-16 z-50 py-2 rounded-sm bg-gray-200 hover:bg-gray-300 w-[40px] focus:outline-none
                      transform translate-x-[72px]">
                    <button                               
                      onClick={toggleHistory}
                    >
                      <span className="sr-only">Toggle History</span>
                      <div className="flex flex-row items-center gap-1 pl-[12px] pt-1">   
                        <FileStack className="text-[#323232]" size={18}/>                     
                        <ChevronLast className="relative left-3 text-[#323232] group-hover:text-black group-hover:translate-x-[5px] transition-transform duration-300 group-hover:animate-pulse" size={16}/>                            
                      </div>
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex w-full justify-center h-40">
                        <img src={logo} className="max-w-26 sm:max-w-48 self-center max-h-30" alt="" />
                    </div>
                    <div className="flex flex-row w-full items-center justify-between py-4 flex-shrink-0">
                        <SelectComponent placeholder="Interações" onValueChange={handleSelectChange} items={[{ value: "todas", label: "Todas" }, { value: "minhas", label: "Minhas" }]} />
                        <button
                        className={`group relative z-50 p-2 bg-gradient-to-r from-white to-gray-200 hover:to-gray-300 w-[40px] focus:outline-none
                        transform`}          
                        onClick={toggleHistory}
                        >
                            <span className="sr-only">Toggle History</span>                       
                            <ChevronFirst className="text-[#323232] group-hover:text-black group-hover:translate-x-[-5px] transition-transform duration-300 group-hover:animate-pulse" size={16}/>                        
                        </button>
                    </div>
                </>
            )
            }
                      
            <div className="flex flex-col items-center w-full scrollbar-thin overflow-y-auto flex-grow">
                {loading && 
                    <div className='flex absolute top-1/2 text-white text-center bg-[#323232] rounded-sm z-55 w-50 h-10 justify-center items-center '>
                        <Loader2Icon className="animate-spin mr-2" size={20} />
                        Carregando...
                    </div>
                }
                {cards.map((card: any) => (
                    <HoverCardComponent key={card.ID} id={card.ID} title={card.TITULO} date={card.DT_CRIACAO} owner={card.USR_NOME} prompt={card.PROMPT} filters={card.FILTROS} retorno={card.RETORNO} modelo={card.MODELO}/>
                ))}
            </div>
        </div>
    );
}

export default History