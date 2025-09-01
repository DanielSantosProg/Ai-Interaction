import { HoverCard } from "radix-ui";
import { Card } from "./Card";
import { Building, Building2, Calendar, CopyPlus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';

interface CardData {
    id: number;
    title: string;
    date: string;
    owner: string;
    prompt: string;
    filters: string;
    retorno: string;
    modelo: string;
}

const HoverCardComponent = ({ id, title, date, owner, prompt, filters, retorno, modelo }: CardData) => {
    const navigate = useNavigate();
    const separatedFilters = filters
        .split(",")
        .map(item => item.trim());
    
    const dataCriacao = new Date(date).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });

    const handleCopyClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); 

        const stateData = {
            id,
            title,
            date,
            owner,
            prompt,
            filters,
            retorno,
            modelo,
        };
        navigate('/new-interaction', { state: stateData });
    };

    return (
        <HoverCard.Root>
            <HoverCard.Trigger asChild>
                <Link
                    to={`/interaction/${id}`}                    
                    className="group inline-block max-w-full cursor-pointer rounded-full shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] outline-none focus:shadow-[0_0_0_2px_white]"
                >
                    <Card className="my-1 h-20 w-2 sm:h-26">
                        <h2 className="text-[10px] group-hover:text-white sm:text-sm font-bold sm:mb-2 text-[#3A3939] truncate overflow-hidden whitespace-nowrap">{title}</h2>
                        <p className="text-[8px] group-hover:text-white sm:text-xs text-[#3A3939] py-1"><span className="font-semibold">Data de Criação: </span>{dataCriacao}</p>
                        <div className="flex flex-row items-center w-full">
                            <p className="text-[8px] w-[175px] group-hover:text-white sm:text-xs text-[#3A3939]">                        
                                <span className="font-semibold">Solicitante:</span> {owner}                                                       
                            </p>                            
                            <Button
                                type="button"
                                onClick={handleCopyClick}
                                className="relative left-8 xl:left-38 bg-gray-100 hover:bg-gray-100 hover:animate-in w-10 h-6 xl:h-7 shadow-sm rounded-lg text-[12px] transition-all duration-300 shadow-gray-700 hover:shadow-white hover:border-1 hover:border-gray-500"                                    
                            >                                                                    
                                <CopyPlus className="text-gray-700" size={20} />                                                                      
                            </Button>    
                        </div>                                               
                    </Card>
                </Link>
            </HoverCard.Trigger>
            <HoverCard.Portal>
                <HoverCard.Content
                    className="w-[300px] xl:w-[400px] relative right-12 sm:right-0 rounded-md bg-[#1F3D58] sm:ml-2 p-5 shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade data-[state=open]:transition-all"
                    side="right"
                    sideOffset={5}
                >
                    <div className="flex flex-col gap-[7px]">
                        <div className="flex flex-col gap-[15px]">
                            <div>
                                <div className="m-0 text-[14px] font-medium text-white">
                                    <span className="font-semibold">{title}</span>
                                </div>
                                <div className="m-0 pt-2 flex items-center text-[14px] text-white">
                                    <Calendar className="m-2" size={14} />
                                    <p className="text-[12px]">
                                        {dataCriacao}
                                    </p>
                                </div>
                            </div>
                            <div className="m-0 text-[14px] text-white">
                                <span className="font-semibold">Solicitante:</span>
                                <p className="py-2 text-[12px]">{owner}</p>
                            </div>

                            <div className="m-0 text-[14px] text-white">
                                <span className="font-semibold">Filtros utilizados:</span>
                                {(separatedFilters[0] && separatedFilters[0] !== '') || (separatedFilters[1] && separatedFilters[1] !== '') ? (
                                    <div className="flex flex-row items-center gap-1 mt-2">
                                        <Calendar size={14} />
                                        <span className="text-white rounded-full py-1 text-[12px]">
                                            {separatedFilters[0] || 'Não informado'} - {separatedFilters[1] || 'Não informado'}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex flex-row items-center gap-1 mt-2">
                                        <Calendar size={14} />
                                        <span className="text-white rounded-full py-1 text-[12px]">-</span>
                                    </div>
                                )}

                                {separatedFilters[2] && separatedFilters[2] !== '' ? (
                                    <div className="flex flex-row items-center gap-1 mt-2">
                                        <Building2 size={14} />
                                        <span className="text-white rounded-full py-1 text-[12px]">
                                            {separatedFilters[2]}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex flex-row items-center gap-1 mt-2">
                                        <Building2 size={14} />
                                        <span className="text-white rounded-full py-1 text-[12px]">-</span>
                                    </div>
                                )}

                                {separatedFilters[3] && separatedFilters[3] !== '' ? (
                                    <div className="flex flex-row items-center gap-1 mt-2">
                                        <Building size={14} />
                                        <span className="text-white rounded-full py-1 text-[12px]">
                                            {separatedFilters[3]}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex flex-row items-center gap-1 mt-2">
                                        <Building size={14} />
                                        <span className="text-white rounded-full py-1 text-[12px]">-</span>
                                    </div>
                                )}

                                {separatedFilters[4] && separatedFilters[4] !== '' ? (
                                    <div className="flex flex-row items-center gap-1 mt-2">
                                        <Wallet size={14} />
                                        <span className="text-white rounded-full py-1 text-[12px]">
                                            {separatedFilters[4]}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex flex-row items-center gap-1 mt-2">
                                        <Wallet size={14} />
                                        <span className="text-white rounded-full py-1 text-[12px]">-</span>
                                    </div>
                                )}
                            </div>
                            <div className="m-0 text-[14px] text-white">
                                <span className="font-semibold">Prompt Utilizado:</span>
                                <p className="py-2 text-[12px]">{prompt.substring(0, 200)}...</p>
                            </div>
                            <Button type="button" onClick={handleCopyClick} className="bg-white shadow-gray-700 hover:shadow-white hover:bg-white hover:border-1 hover:border-[#1F3D58] text-[#323232] hover:text-[#1F3D58] w-40 hover:w-42 rounded-md hover:shadow-sm lg:self-start lg:ml-7">
                                <><CopyPlus size={18}/><p>Replicar Interação</p></>
                            </Button> 
                        </div>
                    </div>

                    <HoverCard.Arrow className="fill-white" />
                </HoverCard.Content>
            </HoverCard.Portal>
        </HoverCard.Root>
    );
};

export default HoverCardComponent;