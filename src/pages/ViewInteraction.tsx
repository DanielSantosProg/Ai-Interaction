// Componentes principais
import History from "../components/History"

// Componentes extras
import { Button } from "@/components/ui/button"

// Libraries/Hooks
import { useState } from "react"
import { useParams, useLocation } from "react-router-dom";
import { Building, Building2, Calendar, CalendarPlus, FileDown, GalleryVerticalEnd, ListFilter, Loader2Icon, ScanText, Sparkles, Wallet } from "lucide-react"

interface ViewInteractionProps {
    isSidebarOpen: boolean;     
}

const ViewInteraction = ({ isSidebarOpen }: ViewInteractionProps) => {
    //const [loading, setLoading] = useState(false)
    const [isHistoryOpen, setIsHistoryOpen] = useState(true);
    const [loading, setLoading] = useState(false);

    const { id } = useParams();
    const location = useLocation();
    const {titulo, dataCriacao, solicitante, prompt, dataInicio, dataFim,
        empresa, estabelecimento, localizacao, retorno
    } = location.state;

    const toggleHistory = () => {
        setIsHistoryOpen(!isHistoryOpen);
    };

    async function onDownload() {
        setLoading(true);
        console.log("Iniciando Download...");
    
        await new Promise(resolve => setTimeout(resolve, 2000));
    
        // 3. Desativa o estado de loading após a conclusão
        setLoading(false);
        console.log("Download finalizado.");
    } 

    return (
    <div className="flex flex-row h-screen">

        {/* Uso do Componente History */}

        <button
            className={`group fixed top-16 left-4 z-50 p-2 rounded-lg bg-white hover:bg-black border-black hover:border-2 focus:outline-none transition-all duration-100 ease-in-out
            ${isSidebarOpen ? "transform translate-x-[72px]" : ""}
            sm:hidden`}          
            onClick={toggleHistory}
        >
            <span className="sr-only">Toggle History</span>
            <GalleryVerticalEnd className='text-[#323232] group-hover:text-white' size={18}/>
        </button>
            
        {/* Passa o estado e a função para o componente History */}
        <div className={`sm:flex-shrink-0 ${isHistoryOpen ? 'w-[200px] sm:w-[285px] xl:w-[400px]' : 'w-0'}`}>
            <History isOpen={isHistoryOpen} />
        </div>

        {/* Conteúdo da página */}

        <div className={`flex flex-col flex-grow items-center py-12 overflow-y-auto scrollbar-thin`}>
            <div className="flex flex-col items-center">
                <h2 className="text-[22px] lg:text-[28px] pb-[12px] text-center">{titulo}</h2>
                <div className="flex flex-row items-center">
                    <CalendarPlus className="text-[#323232]" size={18}/>
                    <p className="px-2">{dataCriacao}</p>
                </div>
            </div>
            <div className="flex flex-col w-full lg:px-17 max-w-4xl items-center my-8">
                <div className="flex flex-row items-center gap-2 mb-4 lg:self-start">
                    <ScanText className="text-[#1F3D58]" size={18} />
                    <p className="font-semibold lg:self-start text-[#1F3D58]">Prompt</p>
                </div>
                <div className="flex flex-col max-w-xs lg:max-w-full text-justify mb-6 lg:self-start lg:ml-7">           
                    <p className="text-[#323232] self-center">{prompt}</p>                                       
                </div>

                <div className="flex flex-row items-center gap-2 mb-4 lg:self-start">
                    <ListFilter className="text-[#1F3D58]" size={18} />
                    <p className="font-semibold lg:self-start text-[#1F3D58]">Filtros Selecionados:</p>
                </div>
                <div className="flex flex-col lg:self-start mb-6 gap-3">
                    <div className="flex flex-row items-center gap-2 lg:ml-7 lg:self-start">
                        <Calendar className="text-[#323232]" size={16}/>
                        <p className="text-[#323232] text-[12px]">{dataInicio} - {dataFim}</p>
                    </div>
                    <div className="flex flex-row items-center  gap-2 lg:ml-7 lg:self-start">
                        <Building2 className="text-[#323232]" size={16}/>
                        <p className="text-[#323232] text-[12px]">{empresa}</p>
                    </div>
                    <div className="flex flex-row items-center  gap-2 lg:ml-7 lg:self-start">
                        <Building className="text-[#323232]" size={16}/>
                        <p className="text-[#323232] text-[12px]">{estabelecimento}</p>
                    </div>
                    <div className="flex flex-row items-center gap-2 lg:ml-7 lg:self-start">
                        <Wallet className="text-[#323232]" size={16}/>
                        <p className="text-[#323232] text-[12px]">{localizacao}</p>
                    </div>                    
                </div>

                <div className="flex flex-row items-center gap-2 mb-4 lg:self-start">
                    <Sparkles className="text-[#1F3D58]" size={18} />
                    <p className="font-semibold lg:self-start text-[#1F3D58]">Resposta da IA</p>
                </div>
                <div className="flex flex-col max-w-xs lg:max-w-full text-justify mb-6 lg:self-start lg:ml-7">           
                    <p className="text-[#323232] self-center whitespace-pre-wrap">{retorno}</p>                                       
                </div>  

                <Button type="button" onClick={onDownload} className="bg-white hover:bg-white  border-1 border-[#323232] hover:border-[#4CAF50] text-[#323232] hover:text-[#4CAF50] mb-4 w-40 hover:w-42 rounded-md shadow-lg hover:shadow-2xl lg:self-start lg:ml-7">
                    {loading ? <Loader2Icon className="animate-spin" />: (<><FileDown size={18}/><p>Baixar Resposta</p></>)}
                </Button>             
            </div> 
        </div>
    </div>
  )
}

export default ViewInteraction