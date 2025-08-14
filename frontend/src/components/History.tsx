import React from "react";
import logo from "../assets/logo.png"
import HoverCardComponent from "./HoverCard"
import SelectComponent from "./Select"
import axios from "axios"

// Interfaces
interface HistoryProps {
    isOpen: boolean;
}

interface CardData {
    ID: number;
    USR_NOME: string;
    PROMPT: string;
    TITULO: string;
    DT_CRIACAO: string;
    FILTROS: string;
    RETORNO: string;
}

const History = ({ isOpen }: HistoryProps) => {
    const userId = 11;
    const API_URL = "http://localhost:3000/interactions"
    const [cards, setCards] = React.useState<CardData[]>([]);
    
    React.useEffect(() => {
        async function getHistory() {
            try {
                const response = await axios.get(`${API_URL}?userId=${userId}`);

                console.log("Dados do histórico: ", response.data);
                
                setCards(response.data);
                
            } catch (error) {
                if (error instanceof Error) {
                console.error("Erro ao buscar o histórico:", error.message);
                } else {
                console.error("Erro ao buscar o histórico:", error);
                }
                throw error;
            }
        }
        getHistory();
    }, []);  

  return (
        <div className={`w-full flex-col items-center h-full flex transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <img src={logo} className="w-26 sm:w-40 self-center max-h-30" alt="" />
            {isOpen && 
            <div className="self-baseline p-4 flex-shrink-0">
                <SelectComponent placeholder="Interações" items={[{value:"todas", label:"Todas"}, {value:"minhas", label:"Minhas"}]} />
            </div>}            
            <div className="flex flex-col items-center w-full scrollbar-thin overflow-y-auto flex-grow">
                {cards.map((card) => (
                    <HoverCardComponent key={card.ID} id={card.ID} title={card.TITULO} date={card.DT_CRIACAO} owner={card.USR_NOME} prompt={card.PROMPT} filters={card.FILTROS} retorno={card.RETORNO}/>
                ))}
            </div>
        </div>
    );
}

export default History