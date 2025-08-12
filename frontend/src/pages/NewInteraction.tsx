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
import { z } from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { MoveRight, Loader2Icon, GalleryVerticalEnd, Sparkles, Pen, Funnel, Text } from "lucide-react"
import { useForm } from "react-hook-form"

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

const NewInteraction = ({ isSidebarOpen }: NewInteractionProps) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const userId = 11

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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    console.log("Submetendo formulário...", values);

    try {  
      const response = await fetch("http://localhost:3000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({values, userId}),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar dados para o servidor.");
      }

      const data = await response.json();
      console.log("Resposta do servidor:", data);
      if (data.error) {
        console.error(data.error);
        setError(data.error);
        setIsAlertOpen(true);
      }
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : String(error));
      setIsAlertOpen(true);
    } finally {
      setLoading(false);
    }
  } 

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
                    <div className="flex flex-row w-full justify-center lg:justify-baseline items-center gap-2">
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
                              items={[{ value: "Rei Informática", label: "Rei Informática" }, { value: "Empresa 2", label: "Empresa 2" }]}
                              onValueChange={field.onChange}
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
                              items={[{ value: "Filial", label: "Filial" }, { value: "Filial 2", label: "Filial 2" }]}
                              onValueChange={field.onChange}
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
                              items={[{ value: "Carteira", label: "Carteira" }, { value: "Caixa", label: "Caixa" }]}
                              onValueChange={field.onChange}
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