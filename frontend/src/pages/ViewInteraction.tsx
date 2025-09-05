// Componentes principais
import History from "../components/History"

// Componentes extras
import { Button } from "@/components/ui/button"

// Libraries/Hooks
import jsPDF from 'jspdf';
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import { ArrowDownWideNarrow, Building, Building2, Calendar, CalendarPlus, FileDown, ListFilter, Loader2Icon, Paperclip, ScanText, Sparkles, TriangleAlert, Wallet } from "lucide-react"
import axios from "axios";
import React from "react";

interface ViewInteractionProps {
    isSidebarOpen: boolean;
    isHistoryOpen: boolean;
    toggleHistory: () => void;
    user: any;
}

interface InteractionData {
    TITULO: string;
    DT_CRIACAO: string;
    USR_NOME: string;
    PROMPT: string;
    FILTROS: string;
    RETORNO: string;
    MODELO: string;
}

const ViewInteraction = ({ isSidebarOpen, isHistoryOpen, toggleHistory, user }: ViewInteractionProps) => {
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [interaction, setInteraction] = useState<InteractionData | null>(null);

    const { id } = useParams();
    
    useEffect(() => {
        const fetchInteraction = async () => {
            if (!id) {
                setPageLoading(false);
                setError("ID da interação não fornecido.");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3001/proxy/interactions/${id}?id_empresa=${user.id_empresa}`);
                setInteraction(response.data);
                setPageLoading(false);
            } catch (err) {
                console.error("Erro ao buscar interação:", err);
                setPageLoading(false);
                setError("Não foi possível carregar os dados da interação.");
            }
        };
        fetchInteraction();
        
    }, [id]);

    const separatedFilters = interaction?.FILTROS
        ? interaction.FILTROS.split(",").map(item => item.trim())
        : [];

    const dataCriacaoFormat = new Date(interaction?.DT_CRIACAO ?? '').toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

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

            // Função para adicionar texto com quebra de linha
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
            yPosition = addText(`${interaction?.TITULO ?? ''}`, margin, yPosition);
            
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

            const dataInicioFormat = separatedFilters[0] ? separatedFilters[0] : " ";
            const dataFimFormat = separatedFilters[1] ? separatedFilters[1] : " ";
            const empresaFormat = separatedFilters[2] ? separatedFilters[2] : "-";
            const estabelecimentoFormat = separatedFilters[3] ? separatedFilters[3] : "-";
            const localizacaoFormat = separatedFilters[4] ? separatedFilters[4] : "-";

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
            
            yPosition = addText(interaction?.PROMPT ?? '', margin, yPosition);
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

            addText(interaction?.RETORNO ?? '', margin, yPosition);

            doc.save(`relatorio_${interaction?.TITULO.replace(/\s/g, '_')}.pdf`);
            setLoading(false);
            console.log("Download finalizado.");
        } catch (error) {
            console.error("Erro ao gerar PDF:", error);
            setLoading(false);
        }
    }  

    React.useEffect(() => {
        if (error) {
            setError(null);
        }
    }, [location.pathname]);

    if (error){
        return (
        <div className="flex flex-row h-screen">
            <div className={`flex-shrink-0 ${isHistoryOpen ? 'w-[200px] sm:w-[285px] xl:w-[400px]' : 'w-0'}`}>
                {user && <History isSidebarOpen={isSidebarOpen} isOpen={isHistoryOpen} toggleHistory={toggleHistory} user={user} />}
            </div>         
            <div className="flex flex-row w-full h-full items-center justify-center text-lg gap-2"><TriangleAlert className="text-red-500 " /><span className="text-red-500">Erro:</span> {error}</div>
        </div>
        )
    }

    if (pageLoading){
        return (
            <div className='flex h-screen justify-center items-center'>
                <Loader2Icon className="animate-spin mr-2" size={20} />
                Carregando...
            </div>
        )
    }

    return (
    <div className="flex flex-row h-screen">
        <div className={`flex-shrink-0 ${isHistoryOpen ? 'w-[200px] sm:w-[285px] xl:w-[400px]' : 'w-0'}`}>
            {user && <History isSidebarOpen={isSidebarOpen} isOpen={isHistoryOpen} toggleHistory={toggleHistory} user={user} />}
        </div> 

        {/* Conteúdo da página */}
        <div className={`flex flex-col flex-grow bg-[#323232]/3 items-center py-12 overflow-y-auto scrollbar-thin`}>            
            <div className="flex flex-col items-center">
                <h2 className="text-[26px] font-bold sm:text-[32px] text-center bg-gradient-to-r from-[#1F3D58] to-teal-500 text-transparent bg-clip-text">{interaction?.TITULO}</h2>
                <div className="flex flex-row justify-center gap-8 mt-2">
                    <div className="flex flex-row items-center">
                        <CalendarPlus className="text-[#323232]" size={18}/>
                        <p className="px-2 text-[#323232]/85 font-medium">{dataCriacaoFormat}</p>
                    </div>
                    <div className="flex flex-row items-center">
                        <Paperclip className="text-[#323232]" size={18}/>
                        <p className="px-2 text-[#323232]/85 font-regular">{interaction?.TITULO}.pdf</p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col bg-white border-2 rounded-md w-sm lg:w-full px-4 py-10 lg:px-17 max-w-4xl items-center my-8">
                <div className="flex flex-row items-center gap-2 mb-4 lg:self-start">
                    <ScanText className="text-[#1F3D58]" size={18} />
                    <p className="font-semibold lg:self-start text-[#1F3D58]">Prompt</p>
                </div>
                <div className="flex flex-col max-w-xs lg:max-w-full text-justify mb-6 lg:self-start lg:ml-7">           
                    <p className="text-[#323232] self-center">{interaction?.PROMPT}</p>                                       
                </div>

                
                <div className="flex flex-row items-center gap-2 mb-4 lg:self-start">
                    <ListFilter className="text-[#1F3D58]" size={18} />
                    <p className="font-semibold lg:self-start text-[#1F3D58]">Filtros Selecionados</p>
                </div>
                <div className="flex flex-col lg:self-start mb-6 gap-3">
                    <div className="flex flex-row items-center gap-2 lg:ml-7 lg:self-start">
                        <Calendar className="text-[#323232]" size={16}/>
                        <p className="text-[#323232] text-[12px]">
                            {(separatedFilters[0] || separatedFilters[1]) ? `${separatedFilters[0] || 'Não informado'} - ${separatedFilters[1] || 'Não informado'}` : '-'}
                        </p>
                    </div>
                    <div className="flex flex-row items-center gap-2 lg:ml-7 lg:self-start">
                        <Building2 className="text-[#323232]" size={16}/>
                        <p className="text-[#323232] text-[12px]">{separatedFilters[2] || '-'}</p>
                    </div>
                    <div className="flex flex-row items-center gap-2 lg:ml-7 lg:self-start">
                        <Building className="text-[#323232]" size={16}/>
                        <p className="text-[#323232] text-[12px]">{separatedFilters[3] || '-'}</p>
                    </div>
                    <div className="flex flex-row items-center gap-2 lg:ml-7 lg:self-start">
                        {interaction?.MODELO == "modelo1" && <Wallet className="text-[#323232]" size={16}/>}
                        {interaction?.MODELO == "modelo2" && <ArrowDownWideNarrow className="text-[#323232]" size={16}/>}
                        <p className="text-[#323232] text-[12px]">{separatedFilters[4] || '-'}</p>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-2 mb-4 lg:self-start">
                    <Sparkles className="text-[#1F3D58]" size={18} />
                    <p className="font-semibold lg:self-start text-[#1F3D58]">Resposta da IA</p>
                </div>
                <div className="flex flex-col max-w-xs lg:max-w-full text-justify mb-6 lg:self-start lg:ml-7">           
                    <p className="text-[#323232] self-center whitespace-pre-wrap">{interaction?.RETORNO}</p>                                       
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