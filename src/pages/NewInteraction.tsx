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
import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { MoveRight, Loader2Icon } from "lucide-react"
import { useForm } from "react-hook-form"


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

const NewInteraction = () => {
  const [loading, setLoading] = useState(false)

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
      <div className="w-[285px] xl:w-[400px] flex-shrink-0 overflow-y-auto">
        <History />
      </div>

      <div className="flex flex-col flex-grow items-center py-12 overflow-y-auto">
        <div className="flex flex-col items-center">
          <h2 className="text-[32px] pb-[12px]">Nova Interação</h2>
          <p>Preencha as informações abaixo para iniciar a interação</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="px-8 xl:px-0 space-y-8">
            <div className="flex flex-col w-2xl xl:w-4xl items-center py-12">
              {/* Título */}
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center w-full">
                    <FormLabel className="font-semibold pr-4">Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o título da interação" className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Filtros */}
              <div className="flex flex-col w-full items-center mb-6 pt-6">
                <FormLabel className="font-semibold self-start">Selecione os filtros:</FormLabel>
                <div className="flex flex-row w-full justify-evenly my-4">
                  {/* Período */}
                  <div className="flex flex-col w-full mr-4 xl:mr-12">
                    <FormLabel className="pb-4 pl-6">Período</FormLabel>
                    <div className="flex flex-row w-full items-center gap-2">
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
                  <div className="flex flex-col w-full">
                    <FormField
                      control={form.control}
                      name="empresa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="pb-4 pl-6">Empresa</FormLabel>
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
                <div className="flex flex-row w-full justify-evenly m-4">
                  <div className="flex flex-col w-full mr-4 xl:mr-12">
                    <FormField
                      control={form.control}
                      name="estabelecimento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="pb-4 pl-6">Estabelecimento</FormLabel>
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

                  <div className="flex flex-col w-full">
                    <FormField
                      control={form.control}
                      name="localizacao"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="pb-4 pl-6">Localização</FormLabel>
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
              <div className="flex flex-col w-full items-center">
                <FormField
                  control={form.control}
                  name="prompt"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="font-semibold self-start">Prompt:</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Digite seu prompt aqui"
                          className="mt-4 max-w-full self-start resize-none"
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