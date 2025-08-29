// Funções
import { modelo1Schema, modelo2Schema, type FormValues } from "@/formModels/models";
import { getPayload } from "@/formModels/payloads/getPayload";
import { Modelo1Fields } from "@/formModels/fields/modelo1";
import { Modelo2Fields } from "@/formModels/fields/modelo2";

// Componentes
import History from "@/components/History";
import { SelectScrollable } from "@/components/Select2";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialogError } from "@/components/AlertDialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Libraries/hooks
import { z } from "zod";
import { useState, useMemo, useEffect, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, Sparkles, Pen, ClipboardMinus, TriangleAlert, Text } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

// Definições de tipos
interface NewInteractionProps {
    isSidebarOpen: boolean;
    isHistoryOpen: boolean;
    toggleHistory: () => void;
    user: any;
}

type Empresa = { id: number; nome: string; };
type Estabelecimento = { id: number; nome: string; empresaId: number; };
type Localizacao = { id: number; nome: string; };
type Modelo = { id: number; nome: string; };

const NewInteraction = ({ isSidebarOpen, isHistoryOpen, toggleHistory, user }: NewInteractionProps) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [empresas, setEmpresas] = useState<Empresa[]>([]);
    const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
    const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
    const [selectedModelo, setSelectedModelo] = useState<Modelo | null>(null);

    const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
    const [selectedEstabelecimento, setSelectedEstabelecimento] = useState<Estabelecimento | null>(null);
    const [selectedLocalizacao, setSelectedLocalizacao] = useState<Localizacao | null>(null);

    const userId = user?.id ?? 11;
    const URL_EMPRESAS = "http://localhost:3000/empresas";
    const URL_ESTABELECIMENTOS = "http://localhost:3000/estabelecimentos";
    const URL_LOCALIZACOES = "http://localhost:3000/localizacoes";
    const navigate = useNavigate();

    const currentSchema = useMemo(() => {
        if (selectedModelo?.nome === 'modelo2') {
            return modelo2Schema;
        }
        return modelo1Schema;
    }, [selectedModelo]);

    const form = useForm<z.infer<typeof currentSchema>>({
        resolver: zodResolver(currentSchema),
        defaultValues: {
            titulo: "",
            modelo: "",
            prompt: "",
            ...(selectedModelo?.nome === 'modelo1' ? { dataInicio: "", dataFim: "", empresa: "", estabelecimento: "", localizacao: "" } : {}),
            ...(selectedModelo?.nome === 'modelo2' ? { campoNovo1: "", campoNovo2: "" } : {})
        },
    });

    const getEmpresas = useCallback(async () => {
        try {
            const response = await axios.get(URL_EMPRESAS);
            const empresasFormatadas = response.data.map((empresa: { GER_EMP_ID: number; GER_EMP_NOME_FANTASIA: string }) => ({
                id: empresa.GER_EMP_ID,
                nome: empresa.GER_EMP_NOME_FANTASIA
            }));
            setEmpresas(empresasFormatadas);
        } catch (error) {
            console.error("Erro ao buscar as empresas:", error);
        }
    }, []);

    const getLocalizacoes = useCallback(async () => {
        try {
            const response = await axios.get(URL_LOCALIZACOES);
            const localizacoesFormatadas = response.data.map((localizacao: { COP_LOC_ID: number; COP_LOC_DESCRICAO: string }) => ({
                id: localizacao.COP_LOC_ID,
                nome: localizacao.COP_LOC_DESCRICAO
            }));
            setLocalizacoes(localizacoesFormatadas);
        } catch (error) {
            console.error("Erro ao buscar as localizações:", error);
        }
    }, []);

    const getEstabelecimentos = useCallback(async (empresaId: number | null) => {
        if (!empresaId) {
            setEstabelecimentos([]);
            return;
        }
        try {
            const response = await axios.get(URL_ESTABELECIMENTOS, { params: { emp_id: empresaId } });
            const estabelecimentosFormatados = response.data.map((est: { COP_EST_ID: number; COP_EST_DESCRICAO: string, GER_EMP_ID: number }) => ({
                id: est.COP_EST_ID,
                nome: est.COP_EST_DESCRICAO,
                empresaId: est.GER_EMP_ID
            }));
            setEstabelecimentos(estabelecimentosFormatados);
        } catch (error) {
            console.error("Erro ao buscar os estabelecimentos:", error);
        }
    }, []);

    useEffect(() => {
        getEmpresas();
        getLocalizacoes();
    }, [getEmpresas, getLocalizacoes]);

    useEffect(() => {
        if (selectedEmpresa) {
            getEstabelecimentos(selectedEmpresa.id);
        } else {
            setEstabelecimentos([]);
        }
    }, [selectedEmpresa, getEstabelecimentos]);

    const handleModeloChange = (value: string) => {
        const newModel = { id: 1, nome: value };
        setSelectedModelo(newModel);
        form.setValue("modelo", value);
        
        // Reseta o formulário com os valores padrão do novo schema
        if (newModel.nome === 'modelo1') {
            form.reset({
                ...form.getValues(),
                dataInicio: "", dataFim: "", empresa: "", estabelecimento: "", localizacao: ""
            });
            setSelectedEmpresa(null);
            setSelectedEstabelecimento(null);
            setSelectedLocalizacao(null);
            setEstabelecimentos([]);
        } else if (newModel.nome === 'modelo2') {
            form.reset({
                ...form.getValues(),
                dataInicio: "", dataFim: "", empresa: "", estabelecimento: "", localizacao: ""
            });
            setSelectedEmpresa(null);
            setSelectedEstabelecimento(null);
            setSelectedLocalizacao(null);
            setEstabelecimentos([]);
        }
    };
    
    async function onSubmit(values: FormValues) {
        setLoading(true);
        try {
            const payload = getPayload(values, selectedModelo, selectedEmpresa, selectedEstabelecimento, selectedLocalizacao);
            
            const response = await fetch("http://localhost:3000/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ values: payload, userId }),
            });

            if (!response.ok) {
                throw new Error("Erro ao enviar dados para o servidor.");
            }
            const data = await response.json();
            if (data.error) {
                setError(data.error);
                setIsAlertOpen(true);
            } else {
                navigate(`/interaction/${data.id}`);
            }
        } catch (error) {
            setError(error instanceof Error ? error.message : String(error));
            setIsAlertOpen(true);
        } finally {
            setLoading(false);
        }
    }

    if (error) {
        return (
            <div className="flex flex-row h-screen">
                <div className={`flex-shrink-0 ${isHistoryOpen ? 'w-[200px] sm:w-[285px] xl:w-[400px]' : 'w-0'}`}>
                    {user && <History isSidebarOpen={isSidebarOpen} isOpen={isHistoryOpen} toggleHistory={toggleHistory} user={user} />}
                </div>
                <div className="flex flex-row w-full h-full items-center justify-center text-lg gap-2"><TriangleAlert className="text-red-500" /><span className="text-red-500">Erro:</span> {error}</div>
            </div>
        );
    }

    return (
        <div className="flex flex-row h-screen">
            <div className={`flex-shrink-0 ${isHistoryOpen ? 'w-[200px] sm:w-[285px] xl:w-[400px]' : 'w-0'}`}>
                {user && <History isSidebarOpen={isSidebarOpen} isOpen={isHistoryOpen} toggleHistory={toggleHistory} user={user} />}
            </div>
            <div className="flex justify-center absolute top-1/2 left-1/2 z-50">
                {isAlertOpen && error && (
                    <AlertDialogError isOpen={isAlertOpen} message={error} onClose={() => setIsAlertOpen(false)} />
                )}
            </div>
            <div className={`flex flex-col bg-[#323232]/3 flex-grow items-center py-12 overflow-y-auto scrollbar-thin`}>
                <div className="flex flex-col items-center">
                    <div className="flex flex-row items-center gap-2 pb-[12px]">
                        <div className="flex w-[40px] h-[40px] items-center justify-center bg-gradient-to-r rounded-md from-teal-500 via-teal-400 to-teal-200">
                            <Sparkles className="text-white" size={24} />
                        </div>
                        <h2 className="text-[26px] font-bold sm:text-[32px] text-center bg-gradient-to-r from-[#1F3D58] to-teal-500 text-transparent bg-clip-text">Nova Interação</h2>
                    </div>
                    <p className="text-[#323232]/85 font-regular text-center">Preencha as informações abaixo para iniciar a interação</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="px-8 xl:px-0 space-y-8">
                        <div className="flex flex-col w-[300px] md:w-md lg:w-3xl items-center my-12">
                            {/* Modelo (Campo comum) */}
                            <div className="flex flex-col bg-white border-2 rounded-md w-full p-4 justify-center items-center">
                                <div className="flex flex-row mb-3 gap-2 lg:self-start items-center">
                                    <ClipboardMinus className="text-[#1F3D58]" size={18} />
                                    <FormLabel className="font-semibold lg:mr-4 text-[14px] text-[#323232]">Modelo de Relatório</FormLabel>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="modelo"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <SelectScrollable
                                                    placeholder="Selecione o Modelo"
                                                    items={[{ value: 'modelo1', label: 'Modelo 1' }, { value: 'modelo2', label: 'Modelo 2' }]}
                                                    onValueChange={handleModeloChange}
                                                    defaultValue={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Título (Campo comum) */}
                            <div className="flex flex-col bg-white border-2 rounded-md w-full mt-8 p-4 items-center">
                                <div className="flex flex-row mb-3 gap-2 lg:self-start items-center">
                                    <Pen className="text-[#1F3D58]" size={18} />
                                    <FormLabel className="font-semibold lg:mr-4 text-[14px] text-[#323232]">Título</FormLabel>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="titulo"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col md:flex-row items-center w-full">
                                            <FormControl>
                                                <Input placeholder="Digite o título da interação" className="w-2xs md:w-full" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                            {/* Renderização condicional dos filtros */}
                            {selectedModelo?.nome === 'modelo1' && (
                                <Modelo1Fields
                                    form={form}
                                    empresas={empresas}
                                    estabelecimentos={estabelecimentos}
                                    localizacoes={localizacoes}
                                    selectedEmpresa={selectedEmpresa}
                                    selectedEstabelecimento={selectedEstabelecimento}
                                    selectedLocalizacao={selectedLocalizacao}
                                    setSelectedEmpresa={setSelectedEmpresa}
                                    setSelectedEstabelecimento={setSelectedEstabelecimento}
                                    setSelectedLocalizacao={setSelectedLocalizacao}
                                />
                            )}
                            {selectedModelo?.nome === 'modelo2' && (
                                <Modelo2Fields
                                    form={form}
                                    empresas={empresas}
                                    estabelecimentos={estabelecimentos}
                                    localizacoes={localizacoes}
                                    selectedEmpresa={selectedEmpresa}
                                    selectedEstabelecimento={selectedEstabelecimento}
                                    selectedLocalizacao={selectedLocalizacao}
                                    setSelectedEmpresa={setSelectedEmpresa}
                                    setSelectedEstabelecimento={setSelectedEstabelecimento}
                                    setSelectedLocalizacao={setSelectedLocalizacao}
                                />
                            )}
                            {/* Prompt (Campo comum) */}
                            <div className="flex flex-col bg-white border-2 rounded-md w-full p-4 mt-8 justify-center items-center">
                                <div className="flex flex-row mb-3 gap-2 lg:self-start items-center">
                                    <Text className="text-[#1F3D58]" size={18} />
                                    <FormLabel className="font-semibold lg:mr-4 text-[14px] text-[#323232]">Prompt:</FormLabel>
                                </div>
                                <FormField
                                    control={form.control}
                                    name="prompt"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Digite seu prompt aqui"
                                                    className="max-w-full self-start resize-none min-h-28 overflow-y-auto scrollbar-thin"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="flex justify-center pt-4">
                                <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-[#1F3D58] to-teal-500 mt-8 mb-4 w-32 lg:w-40 lg:h-12 shadow-lg rounded-md text-white text-[12px] lg:text-[16px] transition-all duration-300 hover:shadow-xs hover:shadow-teal-500 hover:border-1 hover:border-white hover:w-36"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2Icon className="animate-spin mr-2" size={20} />
                                            Enviando...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2" size={20} />
                                            Enviar
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default NewInteraction;