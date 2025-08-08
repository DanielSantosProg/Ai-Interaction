import logo from "../assets/logo.png"
import HoverCardComponent from "./HoverCard"
import SelectComponent from "./Select"

// Interfaces
interface HistoryProps {
    isOpen: boolean;
}

interface CardData {
    id: number;
    title: string;
    date: string;
    owner: string;
    prompt: string;
    filters: string;
    retorno: string;
}

const History = ({ isOpen }: HistoryProps) => { 
  const cards: CardData[] = [
      {id: 1, title: "Análise de KPIs por relatório", date: "31/07/2025", owner: "João da Silva", prompt: "Com base nos dados enviados, me forneça indicadores por tipo de operação.", filters: "01/07/2025,30/07/2025,Rei Informática,Filial,Local 1", retorno: `Com base nos dados enviados para o período de 15/06/2025, segue uma análise dos indicadores por tipo de operação:
---

### **Resumo Geral das Operações (15/06/2025)**

*   **Total de Transações:** 69
*   **Valor Total Processado:** R$ 17.273,85
*   **Valor Total Autorizado:** R$ 16.356,57
*   **Taxa de Sucesso Geral:** 86,96% (60 transações autorizadas de 69)

---
`},
      {id: 2, title: "Análise de KPIs por relatório", date: "31/07/2025", owner: "João da Silva", prompt: "Com base nos dados enviados, me forneça indicadores por tipo de operação.", filters: "01/07/2025,30/07/2025,Rei Informática,Filial,Local 1", retorno: ""},
      {id: 3, title: "Análise de KPIs por relatório", date: "31/07/2025", owner: "João da Silva", prompt: "Com base nos dados enviados, me forneça indicadores por tipo de operação.", filters: "01/07/2025,30/07/2025,Rei Informática,Filial,Local 1", retorno: ""},
      {id: 4, title: "Análise de KPIs por relatório", date: "31/07/2025", owner: "João da Silva", prompt: "Com base nos dados enviados, me forneça indicadores por tipo de operação.", filters: "01/07/2025,30/07/2025,Rei Informática,Filial,Local 1", retorno: ""},
      {id: 5, title: "Análise de KPIs por relatório", date: "31/07/2025", owner: "João da Silva", prompt: "Com base nos dados enviados, me forneça indicadores por tipo de operação.", filters: "01/07/2025,30/07/2025,Rei Informática,Filial,Local 1", retorno: ""},
      {id: 6, title: "Análise de KPIs por relatório", date: "31/07/2025", owner: "João da Silva", prompt: "Com base nos dados enviados, me forneça indicadores por tipo de operação.", filters: "01/07/2025,30/07/2025,Rei Informática,Filial,Local 1", retorno: ""},
      {id: 7, title: "Análise de KPIs por relatório", date: "31/07/2025", owner: "João da Silva", prompt: "Com base nos dados enviados, me forneça indicadores por tipo de operação.", filters: "01/07/2025,30/07/2025,Rei Informática,Filial,Local 1", retorno: ""},
      {id: 8, title: "Análise de KPIs por relatório", date: "31/07/2025", owner: "João da Silva", prompt: "Com base nos dados enviados, me forneça indicadores por tipo de operação.", filters: "01/07/2025,30/07/2025,Rei Informática,Filial,Local 1", retorno: ""},
  ] 

  return (
        <div className={`w-full flex-col items-center h-full flex transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <img src={logo} className="w-26 sm:w-40 self-center max-h-30" alt="" />
            {isOpen && 
            <div className="self-baseline p-4 flex-shrink-0">
                <SelectComponent placeholder="Interações" items={[{value:"todas", label:"Todas"}, {value:"minhas", label:"Minhas"}]} />
            </div>}            
            <div className="flex flex-col items-center w-full scrollbar-thin overflow-y-auto flex-grow">
                {cards.map((card) => (
                    <HoverCardComponent key={card.id} id={card.id} title={card.title} date={card.date} owner={card.owner} prompt={card.prompt} filters={card.filters} retorno={card.retorno}/>
                ))}
            </div>
        </div>
    );
}

export default History