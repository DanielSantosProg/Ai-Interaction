// Componentes principais
import History from "../components/History"

// Componentes extras
import { Button } from "@/components/ui/button"

// Libraries/Hooks
import jsPDF from 'jspdf';
import { useState } from "react"
import { useParams, useLocation } from "react-router-dom";
import { Building, Building2, Calendar, CalendarPlus, FileDown, GalleryVerticalEnd, ListFilter, Loader2Icon, Paperclip, ScanText, Sparkles, Wallet } from "lucide-react"

interface ViewInteractionProps {
    isSidebarOpen: boolean;     
}

const ViewInteraction = ({ isSidebarOpen }: ViewInteractionProps) => {
    const [isHistoryOpen, setIsHistoryOpen] = useState(true);
    const [loading, setLoading] = useState(false);

    const { id } = useParams();
    const location = useLocation();
    const {titulo, dataCriacao, solicitante, prompt, dataInicio, dataFim,
        empresa, estabelecimento, localizacao, retorno
    } = location.state;

    const dataCriacaoFormat = new Date(dataCriacao).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const toggleHistory = () => {
        setIsHistoryOpen(!isHistoryOpen);
    };

    async function onDownload() {
        setLoading(true);
        console.log("Iniciando Download...");

        try {
            const doc = new jsPDF();
            const margin = 16;
            const lineHeight = 7;
            let yPosition = margin;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10); 

            const addText = (text: string, x: number, y: number, options = {}) => {
                const textLines = doc.splitTextToSize(text, 210 - 2 * margin);
                let currentY = y;

                textLines.forEach((line: string | string[]) => {
                    if (currentY > 297 - margin) {
                        doc.addPage();
                        currentY = margin;
                    }
                    doc.text(line, x, currentY, options);
                    currentY += lineHeight;
                });
                return currentY;
            };

            // Título
            doc.setFontSize(14);
            doc.setTextColor("#1F3D58"); 
            doc.setFont('helvetica', 'bold');
            yPosition = addText(`${titulo}`, margin, yPosition);
            
            doc.setTextColor("#000000");
            doc.setFont('helvetica', 'normal');

            // Separador
            doc.line(margin, yPosition, 210 - margin, yPosition);
            yPosition += lineHeight;

            // Título da seção de Filtros Selecionados
            yPosition += lineHeight;
            doc.setFontSize(12);
            doc.setTextColor("#1F3D58");
            doc.setFont('helvetica', 'bold');
            yPosition = addText("Filtros Selecionados:", margin, yPosition);
            
            // Texto dos Filtros
            doc.setTextColor("#000000");
            doc.setFont('helvetica', 'normal'); 
            doc.setFontSize(10); 
            yPosition += lineHeight;

            const dataInicioFormat = dataInicio ? dataInicio : " ";
            const dataFimFormat = dataFim ? dataFim : " ";
            const empresaFormat = empresa ? empresa : "-";
            const estabelecimentoFormat = estabelecimento ? estabelecimento : "-";
            const localizacaoFormat = localizacao ? localizacao : "-";

            const filters = [
                `Data: ${dataInicioFormat} - ${dataFimFormat}`,
                `Empresa: ${empresaFormat}`,
                `Estabelecimento: ${estabelecimentoFormat}`,
                `Localização: ${localizacaoFormat}`
            ];
            filters.forEach(filter => {
                yPosition = addText(filter, margin, yPosition);
            });
            yPosition += lineHeight;

            // Título da seção de Prompt
            doc.setFontSize(12);
            doc.setTextColor("#1F3D58");
            doc.setFont('helvetica', 'bold');
            yPosition = addText(`Prompt:`, margin, yPosition);
            
            // Texto do prompt
            doc.setTextColor("#000000");
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            yPosition += lineHeight;
            
            yPosition = addText(prompt, margin, yPosition);
            yPosition += lineHeight;

            // Título da seção de Resposta
            doc.setFontSize(12);
            doc.setTextColor("#1F3D58");
            doc.setFont('helvetica', 'bold');
            yPosition = addText("Resposta da IA:", margin, yPosition);
            
            // Texto da resposta
            doc.setTextColor("#000000");
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            yPosition += lineHeight;

            addText(retorno, margin, yPosition);

            doc.save(`relatorio_${titulo.replace(/\s/g, '_')}.pdf`);
            setLoading(false);
            console.log("Download finalizado.");
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            setLoading(false);
        }
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

        <div className={`flex flex-col flex-grow bg-[#323232]/3 items-center py-12 overflow-y-auto scrollbar-thin`}>            
            <div className="flex flex-col items-center">
                <h2 className="text-[26px] font-bold sm:text-[32px] text-center bg-gradient-to-r from-[#1F3D58] to-teal-500 text-transparent bg-clip-text">{titulo}</h2>
                <div className="flex flex-row justify-center gap-8 mt-2">
                    <div className="flex flex-row items-center">
                        <CalendarPlus className="text-[#323232]" size={18}/>
                        <p className="px-2 text-[#323232]/85 font-medium">{dataCriacaoFormat}</p>
                    </div>
                    <div className="flex flex-row items-center">
                        <Paperclip className="text-[#323232]" size={18}/>
                        <p className="px-2 text-[#323232]/85 font-regular">Relatório gerado.pdf</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col bg-white border-2 rounded-md w-sm lg:w-full px-4 py-10 lg:px-17 max-w-4xl items-center my-8">
                <div className="flex flex-row items-center gap-2 mb-4 lg:self-start">
                    <ScanText className="text-[#1F3D58]" size={18} />
                    <p className="font-semibold lg:self-start text-[#1F3D58]">Prompt</p>
                </div>
                <div className="flex flex-col max-w-xs lg:max-w-full text-justify mb-6 lg:self-start lg:ml-7">           
                    <p className="text-[#323232] self-center">{prompt}</p>                                       
                </div>

                <div className="flex flex-row items-center gap-2 mb-4 lg:self-start">
                    <ListFilter className="text-[#1F3D58]" size={18} />
                    <p className="font-semibold lg:self-start text-[#1F3D58]">Filtros Selecionados</p>
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

                <Button type="button" onClick={onDownload} disabled={loading} className="bg-white hover:bg-white  border-1 border-[#323232] hover:border-[#4CAF50] text-[#323232] hover:text-[#4CAF50] w-40 hover:w-42 rounded-md shadow-lg hover:shadow-2xl lg:self-start lg:ml-7">
                    {loading ? <Loader2Icon className="animate-spin" />: (<><FileDown size={18}/><p>Baixar Resposta</p></>)}
                </Button>             
            </div> 
        </div>
    </div>
  )
}

export default ViewInteraction