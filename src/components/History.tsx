import logo from "../assets/logo.png"
import HoverCardComponent from "./HoverCard"
import SelectComponent from "./Select"

const History = () => {
  interface CardData {
    title: string;
    date: string;
    owner: string;
    prompt: string;
    filters: string;
  }
  const cards: CardData[] = [
      {title: "Análise de KPIs por relatório", date: "31/07/2025", owner: "João da Silva", prompt: "Com base nos dados enviados, me forneça indicadores por tipo de operação.", filters: "01/07/2025 - 30/07/2025,Rei Informática,Filial,Local 1"},
      {title: "Análise de KPIs por relatório", date: "31/07/2025", owner: "João da Silva", prompt: "Com base nos dados enviados, me forneça indicadores por tipo de operação.", filters: "01/07/2025 - 30/07/2025,Rei Informática,Filial,Local 1"},
      {title: "Análise de KPIs por relatório", date: "31/07/2025", owner: "João da Silva", prompt: "Com base nos dados enviados, me forneça indicadores por tipo de operação.", filters: "01/07/2025 - 30/07/2025,Rei Informática,Filial,Local 1"},
      {title: "Análise de KPIs por relatório", date: "31/07/2025", owner: "João da Silva", prompt: "Com base nos dados enviados, me forneça indicadores por tipo de operação.", filters: "01/07/2025 - 30/07/2025,Rei Informática,Filial,Local 1"},
      {title: "Análise de KPIs por relatório", date: "31/07/2025", owner: "João da Silva", prompt: "Com base nos dados enviados, me forneça indicadores por tipo de operação.", filters: "01/07/2025 - 30/07/2025,Rei Informática,Filial,Local 1"},
      {title: "Análise de KPIs por relatório", date: "31/07/2025", owner: "João da Silva", prompt: "Com base nos dados enviados, me forneça indicadores por tipo de operação.", filters: "01/07/2025 - 30/07/2025,Rei Informática,Filial,Local 1"},
      {title: "Análise de KPIs por relatório", date: "31/07/2025", owner: "João da Silva", prompt: "Com base nos dados enviados, me forneça indicadores por tipo de operação.", filters: "01/07/2025 - 30/07/2025,Rei Informática,Filial,Local 1"},
      {title: "Análise de KPIs por relatório", date: "31/07/2025", owner: "João da Silva", prompt: "Com base nos dados enviados, me forneça indicadores por tipo de operação.", filters: "01/07/2025 - 30/07/2025,Rei Informática,Filial,Local 1"},
  ]
  return (
    <div className='w-full flex flex-col h-full'>
        <img src={logo} className="w-40 max-h-30" alt="" />
        <div className="self-baseline p-4 flex-shrink-0">
          <SelectComponent placeholder="Interações" items={[{value:"todas", label:"Todas"}, {value:"minhas", label:"Minhas"}]} />
        </div>
        <div className="flex flex-col items-center w-full scrollbar-thin overflow-y-auto flex-grow">
          {cards.map((card, index) => (
            <HoverCardComponent key={index} title={card.title} date={card.date} owner={card.owner} prompt={card.prompt} filters={card.filters} />
          ))}          
        </div>
    </div>
  )
}

export default History