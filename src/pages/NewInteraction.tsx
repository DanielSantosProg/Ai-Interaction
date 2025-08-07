// Componentes principais
import History from "../components/History"

// Componentes extras
import { DatePicker } from "@/components/DatePicker"
import { SelectScrollable } from "@/components/Select2"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

// Libraries/Hooks
import { z } from "zod"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { MoveRight, Loader2Icon, GalleryVerticalEnd } from "lucide-react"
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
  const [isHistoryOpen, setIsHistoryOpen] = useState(true);

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

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Desativa o estado de loading após a conclusão
    setLoading(false);
    console.log("Dados enviados:");
    console.log(values)
  } 

  return (
    <div className="flex flex-row h-screen">
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
      <div className={`flex flex-col flex-grow items-center py-12 overflow-y-auto scrollbar-thin`}>
        <div className="flex flex-col items-center">
          <h2 className="text-[26px] sm:text-[32px] pb-[12px] text-center">Nova Interação</h2>
          <p className="text-[#1F3D58] text-center">Preencha as informações abaixo para iniciar a interação</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-8 xl:px-0 space-y-8">
            <div className="flex flex-col max-w-4xl items-center my-12">
              {/* Título */}
              <FormLabel className="font-semibold mb-3 lg:self-start lg:mr-4 text-[#1F3D58]">Título</FormLabel>
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem className="flex flex-col lg:flex-row items-center w-full">                    
                    <FormControl>
                      <Input placeholder="Digite o título da interação" className="w-2xs lg:w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Filtros */}
              <div className="flex flex-col w-full items-center mt-8">
                <FormLabel className="font-semibold lg:self-start text-[#1F3D58]">Selecione os filtros:</FormLabel>
                <div className="flex flex-col lg:flex-row justify-center w-full lg:items-center mt-4">
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
                              items={[{ value: "rei", label: "Rei Informática" }, { value: "empresa 2", label: "Empresa 2" }]}
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
                              items={[{ value: "filial", label: "Filial" }, { value: "filial 2", label: "Filial 2" }]}
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
                              items={[{ value: "local 1", label: "Local 1" }, { value: "local 2", label: "Local 2" }]}
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
              <div className="flex flex-col w-full mt-8 justify-center items-center">
                <FormLabel className="font-semibold mb-3 lg:self-start text-[#1F3D58]">Prompt:</FormLabel>
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

              <Button type="submit" className="bg-slate-600 mt-8 mb-4 w-32 shadow-lg rounded-md hover:shadow-2xl text-white hover:bg-slate-500 hover:w-36">
                {loading ? <Loader2Icon className="animate-spin" />: "Enviar"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default NewInteraction