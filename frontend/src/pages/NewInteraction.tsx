// Componentes principais
import History from "../components/History"

// Componentes extras
import { DatePicker } from "@/components/DatePicker"
import { SelectScrollable } from "@/components/Select2"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialogError } from "@/components/AlertDialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Libraries/Hooks
import React from "react"
import { z } from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { MoveRight, Loader2Icon, GalleryVerticalEnd, Sparkles, Pen, Funnel, Text, ClipboardMinus } from "lucide-react"
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom';
import axios from "axios"

interface NewInteractionProps {
  isSidebarOpen: boolean;
}

// Schema de validação Zod
const formSchema = z.object({
  titulo: z.string().min(1, {
    message: "É necessário inserir algo no título.",
  }).max(100, {
    message: "Título tem que ter no máximo 100 caracteres."
  }),
  modelo: z.string().min(1, {
    message: "É necessário selecionar um modelo.",
  }),
  dataInicio: z.string().optional(),
  dataFim: z.string().optional(),
  empresa: z.string().optional(),
  estabelecimento: z.string().optional(),
  localizacao: z.string().optional(),
  prompt: z.string().min(1,{
    message: "O prompt é requerido para que seja feita a interação."
  }).max(1000, {
    message: "Passou do limite de caracteres no prompt, use até 1000 caracteres."
  })
})

type Empresa = {
  id: number;
  nome: string;
};

type Estabelecimento = {
  id: number;
  nome: string;
  empresaId: number;
}

type Localizacao = {
  id: number;
  nome: string;
}

type Modelo = {
  id: number;
  nome: string;
}

const NewInteraction = ({ isSidebarOpen }: NewInteractionProps) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [selectedEstabelecimento, setSelectedEstabelecimento] = useState<Estabelecimento | null>(null);
  const [localizacoes, setLocalizacoes] = useState<Localizacao[]>([]);
  const [selectedLocalizacao, setSelectedLocalizacao] = useState<Localizacao | null>(null);
  const [selectedModelo, setSelectedModelo] = useState<Modelo | null>(null);


  const userId = 11
  const URL_EMPRESAS = "http://localhost:3000/empresas"
  const URL_ESTABELECIMENTOS = "http://localhost:3000/estabelecimentos"
  const URL_LOCALIZACOES = "http://localhost:3000/localizacoes"
  const navigate = useNavigate();

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      dataInicio: "",
      dataFim: "",
      empresa: "",
      estabelecimento: "",
      localizacao: "",
      prompt: "",
    },
  })

  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    const formattedDataInicio = values.dataInicio ? formatDate(values.dataInicio) : undefined;
    const formattedDataFim = values.dataFim ? formatDate(values.dataFim) : undefined;

    const payload = {
      titulo: values.titulo,
      modelo: selectedModelo?.nome,
      dataInicio: formattedDataInicio,
      dataFim: formattedDataFim,
      empresa: selectedEmpresa?.id,
      estabelecimento: selectedEstabelecimento?.id,
      localizacao: selectedLocalizacao?.id,
      prompt: values.prompt,
      dataInicioDB: values.dataInicio,
      dataFimDB: values.dataFim,
      empresaDB: values.empresa,
      estabelecimentoDB: values.estabelecimento,
      localizacaoDB: values.localizacao,
    };

    console.log("Submetendo formulário...", payload);

    try {  
      const response = await fetch("http://localhost:3000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({values: payload, userId}),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar dados para o servidor.");
      }

      const data = await response.json();
      
      if (data.error) {
        console.error(data.error);
        setError(data.error);
        setIsAlertOpen(true);
      } else {
        console.log("Resposta do servidor:", data);
        navigate(`/interaction/${data.id}`);
      }
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : String(error));
      setIsAlertOpen(true);
    } finally {
      setLoading(false);
    }
  } 

  React.useEffect(() => {
    async function getEmpresas() {
      try {
        const response = await axios.get(URL_EMPRESAS);
        console.log("Dados brutos das empresas: ", response.data);

        const empresasFormatadas = response.data.map((empresa: { GER_EMP_ID: number; GER_EMP_NOME_FANTASIA: string }) => ({
          id: empresa.GER_EMP_ID,
          nome: empresa.GER_EMP_NOME_FANTASIA
        }));

        setEmpresas(empresasFormatadas);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Erro ao buscar as empresas:", error.message);
        } else {
          console.error("Erro ao buscar as empresas:", error);
        }
        throw error;
      }
    }
    getEmpresas();
  }, []); 

  React.useEffect(() => {
    async function getEstabelecimentos() {
      if (!selectedEmpresa) {
        setEstabelecimentos([]);
        form.setValue("estabelecimento", "");
        return;
      }
      try {
        const response = await axios.get(URL_ESTABELECIMENTOS, {
          params: {
            emp_id: selectedEmpresa.id
          }
        });
        console.log("Dados brutos dos estabelecimentos: ", response.data);

        const estabelecimentosFormatados = response.data.map((estabelecimento: { COP_EST_ID: number; COP_EST_DESCRICAO: string, GER_EMP_ID: number }) => ({
          id: estabelecimento.COP_EST_ID,
          nome: estabelecimento.COP_EST_DESCRICAO,
          empresaId: estabelecimento.GER_EMP_ID
        }));

        setEstabelecimentos(estabelecimentosFormatados);
        
      } catch (error) {
        if (error instanceof Error) {
          console.error("Erro ao buscar os estabelecimentos:", error.message);
        } else {
          console.error("Erro ao buscar os estabelecimentos:", error);
        }
      }
    }
    getEstabelecimentos();
}, [selectedEmpresa]);

  React.useEffect(() => {
    async function getLocalizacoes() {
      try {
        const response = await axios.get(URL_LOCALIZACOES);
        console.log("Dados brutos das localizações: ", response.data);

        const localizacoesFormatadas = response.data.map((localizacao: { COP_LOC_ID: number; COP_LOC_DESCRICAO: string }) => ({
          id: localizacao.COP_LOC_ID,
          nome: localizacao.COP_LOC_DESCRICAO
        }));

        setLocalizacoes(localizacoesFormatadas);
        
      } catch (error) {
        if (error instanceof Error) {
          console.error("Erro ao buscar as localizações:", error.message);
        } else {
          console.error("Erro ao buscar as localizações:", error);
        }
        throw error;
      }
    }
    getLocalizacoes();
  }, []); 

  return (
    <div className="flex flex-row h-screen">

      {/* Uso do Componente History */}

      <button
          className={`group fixed top-16 left-4 z-50 p-2 rounded-lg hover:bg-black border-black hover:border-2 focus:outline-none transition-all duration-100 ease-in-out
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

      <div className="flex justify-center absolute top-1/2 left-1/2 z-50">
        {isAlertOpen && error && (
          <AlertDialogError isOpen={isAlertOpen} message={error} onClose={() => setIsAlertOpen(false)} />
        )}
      </div>

      {/* Conteúdo da página */}

      <div className={`flex flex-col bg-[#323232]/3 flex-grow items-center py-12 overflow-y-auto scrollbar-thin`}>
        <div className="flex flex-col items-center">
          <div className="flex flex-row items-center gap-2 pb-[12px]">
            <div className="flex w-[40px] h-[40px] items-center justify-center bg-gradient-to-r rounded-md from-teal-500 via-teal-400 to-teal-200">
              <Sparkles className="text-white" size={24}/>
            </div>
            <h2 className="text-[26px] font-bold sm:text-[32px] text-center bg-gradient-to-r from-[#1F3D58] to-teal-500 text-transparent bg-clip-text">Nova Interação</h2>
          </div>
          <p className="text-[#323232]/85 font-regular text-center">Preencha as informações abaixo para iniciar a interação</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-8 xl:px-0 space-y-8">
            <div className="flex flex-col w-[300px] md:w-md lg:w-3xl items-center my-12">
              {/* Título */}
              <div className="flex flex-col bg-white border-2 rounded-md w-full p-4 items-center">
                <div className="flex flex-row mb-3 gap-2 lg:self-start items-center">
                  <Pen className="text-[#1F3D58]" size={18}/>
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

              <div className="flex flex-col bg-white border-2 rounded-md w-full p-4 mt-8 justify-center items-center">
                <div className="flex flex-row mb-3 gap-2 lg:self-start items-center">
                  <ClipboardMinus className="text-[#1F3D58]" size={18}/>
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
                              items={[{ value: 'modelo1', label: 'Modelo 1' }]}
                              onValueChange={(value: string) => {
                                field.onChange(value);
                                setSelectedModelo({ id: 1, nome: value });
                                form.setValue("modelo", value);
                              }}
                              defaultValue={field.value}
                            />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Filtros */}
              <div className="flex flex-col bg-white border-2 rounded-md w-full p-4 items-center mt-8">
                <div className="flex flex-row mb-3 gap-2 lg:self-start items-center">
                  <Funnel className="text-[#1F3D58]" size={18}/>
                  <FormLabel className="font-semibold lg:mr-4 text-[14px] text-[#323232]">Selecione os filtros:</FormLabel>
                </div>
                <div className="flex flex-col lg:flex-row justify-center w-full lg:items-center mt-2">
                  {/* Período */}
                  <div className="flex flex-col w-full items-center lg:items-baseline lg:mr-4 xl:mr-12">
                    <FormLabel className="mb-3 lg:ml-4">Período</FormLabel>
                    <div className="flex flex-row w-full justify-center sm:justify-baseline items-center gap-2">
                      <FormField
                        control={form.control}
                        name="dataInicio"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <DatePicker
                              valor={field.value}
                              placeholder="Data Inicial"
                              onSelect={(date: Date | undefined) => {
                                // Converte a data para string
                                field.onChange(date ? date.toLocaleDateString("pt-BR") : "");
                              }}
                            />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <MoveRight size={18} />
                      <FormField
                        control={form.control}
                        name="dataFim"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <DatePicker
                              valor={field.value}
                              placeholder="Data Final"
                              onSelect={(date: Date | undefined) => {
                                // Converte a data para string
                                field.onChange(date ? date.toLocaleDateString("pt-BR") : "");
                              }}
                            />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Empresa */}
                  <div className="flex flex-col w-full items-center lg:items-baseline lg:mr-4 xl:mr-12">
                    <FormLabel className="m-3 lg:mb-3 lg:mt-0 self-center lg:self-baseline lg:ml-4">Empresa</FormLabel>
                    <FormField
                      control={form.control}
                      name="empresa"
                      render={({ field }) => (
                        <FormItem>                          
                          <FormControl>
                            <SelectScrollable
                              placeholder="Selecione a empresa"
                              items={empresas.map((empresa) => ({
                                value: empresa.nome,
                                label: empresa.nome,
                                id: empresa.id
                              }))}
                              onValueChange={(value: string) => {
                                field.onChange(value);
                                const empresaObj = empresas.find((empresa) => empresa.nome === value) || null;
                                setSelectedEmpresa(empresaObj);
                                form.setValue("estabelecimento", "");
                              }}
                              defaultValue={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Estabelecimento e Localização */}
                <div className="flex flex-col lg:flex-row w-full justify-evenly mt-4">
                  <div className="flex flex-col w-full items-center lg:items-baseline lg:mr-4 xl:mr-12">
                    <FormLabel className="mb-3 self-center lg:self-baseline lg:ml-4">Estabelecimento</FormLabel>
                    <FormField
                      control={form.control}
                      name="estabelecimento"
                      render={({ field }) => (
                        <FormItem>                          
                          <FormControl>
                            <SelectScrollable
                              placeholder="Selecione o estabelecimento"
                              items={estabelecimentos.map(est => ({
                                  id: est.id,
                                  value: est.nome,
                                  label: est.nome
                              }))}
                              onValueChange={(value: string) => {
                                field.onChange(value);
                                const estabelecimentoObj = estabelecimentos.find((estabelecimento) => estabelecimento.nome === value) || null;
                                setSelectedEstabelecimento(estabelecimentoObj);                                
                              }}
                              defaultValue={field.value}
                          />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex flex-col w-full items-center lg:items-baseline lg:mr-4 xl:mr-12">
                    <FormLabel className="m-3 lg:mb-3 lg:mt-0 self-center lg:self-baseline lg:ml-4">Localização</FormLabel>
                    <FormField
                      control={form.control}
                      name="localizacao"
                      render={({ field }) => (
                        <FormItem>                          
                          <FormControl>
                            <SelectScrollable
                              placeholder="Selecione a localização"
                              items={localizacoes.map(localizacao => ({
                                id: localizacao.id,
                                value: localizacao.nome,
                                label: localizacao.nome
                              }))}                              
                              onValueChange={(value: string) => {
                                field.onChange(value);
                                const localizacaoObj = localizacoes.find((localizacao) => localizacao.nome === value) || null;
                                setSelectedLocalizacao(localizacaoObj);                                
                              }}
                              defaultValue={field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Prompt */}
              <div className="flex flex-col bg-white border-2 rounded-md w-full p-4 mt-8 justify-center items-center">
                <div className="flex flex-row mb-3 gap-2 lg:self-start items-center">
                  <Text className="text-[#1F3D58]" size={18}/>
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
                  className="
                        bg-gradient-to-r from-[#1F3D58] to-teal-500 mt-8 mb-4 
                        w-32 lg:w-40 lg:h-12 shadow-lg rounded-md 
                        text-white text-[12px] lg:text-[16px] 
                        transition-all duration-300
                        hover:shadow-xs hover:shadow-teal-500
                        hover:border-1 hover:border-white
                        hover:w-36
                      " 
                      disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2Icon className="animate-spin mr-2" size={20} />
                      Processando...
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
  )
}

export default NewInteraction