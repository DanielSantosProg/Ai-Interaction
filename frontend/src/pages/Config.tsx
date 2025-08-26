// Componentes
import History from "@/components/History";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Cog, Database, DatabaseZap, GalleryVerticalEnd, KeyRound, Loader2Icon, SaveAll, Server, UserCog } from "lucide-react";

// Libraries/hooks
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { AlertDialogError } from "@/components/AlertDialog";
import axios from "axios";

interface ConfigProps {
  isSidebarOpen: boolean;
  user: any;
}

interface ConfigData {
  DB_SERVER: string;
  DB_DATABASE: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_PORT: number;
}

// Schema de validação Zod
const formSchema = z.object({
    DB_SERVER: z.string().min(1, {message: "Insira o endereço do servidor."}),
    DB_DATABASE: z.string().min(1, {message: "Insira o nome do banco de dados."}),
    DB_USER: z.string().min(1, {message: "Insira o nome do usuário."}),
    DB_PASSWORD: z.string().min(1, {message: "Insira a senha do usuário."}),
    DB_PORT: z.number().min(1, {message: "Insira a porta do banco de dados."}),
})

const Config = ({ isSidebarOpen, user }: ConfigProps) => {
    const [isHistoryOpen, setIsHistoryOpen] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [config, setConfig] = useState<ConfigData | null>(null);

    const navigate = useNavigate();    
    const id_empresa = localStorage.getItem('id_empresa');

    const toggleHistory = () => {
        setIsHistoryOpen(!isHistoryOpen);
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          DB_SERVER: "",
          DB_DATABASE: "",
          DB_USER: "",
          DB_PASSWORD: "",
          DB_PORT: 1433,
        },
      })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setLoading(true);
    
        const payload = {
          DB_SERVER: values.DB_SERVER,
          DB_DATABASE: values.DB_DATABASE,
          DB_USER: values.DB_USER,
          DB_PASSWORD: values.DB_PASSWORD,
          DB_PORT: values.DB_PORT,
        };
    
        console.log("Submetendo formulário...", payload);
    
        try {  
          const response = await fetch("http://localhost:3001/change_config", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ values: payload, id_empresa: id_empresa }),
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
            navigate(`/`);
          }
        } catch (error) {
          console.error(error);
          setError(error instanceof Error ? error.message : String(error));
          setIsAlertOpen(true);
        } finally {
          setLoading(false);
        }
      }

      useEffect(() => {
        const fetchConfig = async () => {
            if (!id_empresa) {
                setLoading(false);
                setError("ID da empresa não fornecido.");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3001/configs?id_empresa=${id_empresa}`);
                setConfig(response.data); 
                console.log("DATA: ", response.data);
                setLoading(false);
            } catch (err) {
                console.error("Erro ao buscar Configuração:", err);
                setLoading(false);
                setError("Não foi possível carregar os dados da configuração.");
            }
        };

        fetchConfig();
    }, [id_empresa]);
    
    useEffect(() => {
      if (config) {
        form.setValue('DB_SERVER', config.DB_SERVER);
        form.setValue('DB_DATABASE', config.DB_DATABASE);
        form.setValue('DB_USER', config.DB_USER);
        form.setValue('DB_PASSWORD', config.DB_PASSWORD);
        form.setValue('DB_PORT', config.DB_PORT);        
      }
    }, [config, form]);

  return (
    <div className={`flex flex-row h-screen ${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-all`}>
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
                {user && <History isOpen={isHistoryOpen} user={user} />}
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
              <Cog className="text-white" size={24}/>
            </div>
            <h2 className="text-[26px] font-bold sm:text-[32px] text-center bg-gradient-to-r from-[#1F3D58] to-teal-500 text-transparent bg-clip-text">Configurações</h2>
          </div>
        </div>
        
        <Tabs defaultValue="general" className="mt-4 w-full items-center">
            <TabsList>
                <TabsTrigger value="general">Gerais</TabsTrigger>
                <TabsTrigger value="connection">Conexão</TabsTrigger>
            </TabsList>
        <TabsContent value="general">
            <p>Configurações gerais</p>
        </TabsContent>
        <TabsContent value="connection">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="px-8 xl:px-0 space-y-8">
                    <div className="flex flex-col w-[300px] md:w-md lg:w-3xl items-center mb-12">
                    {/* Campos */}
                        <div className="flex flex-col bg-white border-2 rounded-md w-full p-4 items-center">
                            <div className="w-full">
                                <div className="flex flex-row mb-3 gap-2 lg:self-start items-center">
                                    <Server className="text-[#1F3D58]" size={18}/>
                                    <FormLabel className="font-semibold lg:mr-4 text-[14px] text-[#323232]">DB_SERVER</FormLabel>
                                </div>
                                <FormField
                                control={form.control}
                                name="DB_SERVER"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col md:flex-row items-center w-full">                    
                                    <FormControl>
                                        <Input placeholder="Digite o endereço do servidor" className="w-2xs md:w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                            <div className="w-full mt-6">
                                <div className="flex flex-row mb-3 gap-2 lg:self-start items-center">
                                    <Database className="text-[#1F3D58]" size={18}/>
                                    <FormLabel className="font-semibold lg:mr-4 text-[14px] text-[#323232]">DB_DATABASE</FormLabel>
                                </div>
                                <FormField
                                control={form.control}
                                name="DB_DATABASE"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col md:flex-row items-center w-full">                    
                                    <FormControl>
                                        <Input placeholder="Digite o nome do banco de dados" className="w-2xs md:w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                            <div className="w-full mt-6">
                                <div className="flex flex-row mb-3 gap-2 lg:self-start items-center">
                                    <UserCog className="text-[#1F3D58]" size={18}/>
                                    <FormLabel className="font-semibold lg:mr-4 text-[14px] text-[#323232]">DB_USER</FormLabel>
                                </div>
                                <FormField
                                control={form.control}
                                name="DB_USER"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col md:flex-row items-center w-full">                    
                                    <FormControl>
                                        <Input placeholder="Digite o nome do usuário no banco" className="w-2xs md:w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>
                            <div className="w-full mt-6">
                                <div className="flex flex-row mb-3 gap-2 lg:self-start items-center">
                                    <KeyRound className="text-[#1F3D58]" size={18}/>
                                    <FormLabel className="font-semibold lg:mr-4 text-[14px] text-[#323232]">DB_PASSWORD</FormLabel>
                                </div>
                                <FormField
                                control={form.control}
                                name="DB_PASSWORD"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col md:flex-row items-center w-full">                    
                                    <FormControl>
                                        <Input type="password" placeholder="Digite a senha do usuário no banco" className="w-2xs md:w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>   
                            <div className="w-full mt-6">
                                <div className="flex flex-row mb-3 gap-2 lg:self-start items-center">
                                    <DatabaseZap className="text-[#1F3D58]" size={18}/>
                                    <FormLabel className="font-semibold lg:mr-4 text-[14px] text-[#323232]">DB_PORT</FormLabel>
                                </div>
                                <FormField
                                control={form.control}
                                name="DB_PORT"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col md:flex-row items-center w-full">                    
                                    <FormControl>
                                        <Input placeholder="Digite a porta do banco de dados" className="w-2xs md:w-full" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                            </div>                                                           
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
                                <SaveAll className="mr-2" size={20} />
                                    Salvar
                                </>
                            )}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </TabsContent>
        </Tabs>        
      </div>
    </div>
  );
};

export default Config;
