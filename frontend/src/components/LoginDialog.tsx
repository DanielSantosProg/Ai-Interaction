// Components
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { CircleX, LogIn } from "lucide-react"

// Libraries/hooks
import z from "zod"
import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

// Components para o formulário
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const formSchema = z.object({
  empresa: z.string().min(1, {message: "Nome da empresa é obrigatório."}).max(100, {message: "Nome da empresa deve ter no máximo 100 caracteres."}),
  username: z.string().min(1, {message: "Nome de usuário é obrigatório."}).max(100, {message: "Nome de usuário deve ter no máximo 100 caracteres."}),
  password: z.string().min(6, {message: "Senha deve ter pelo menos 6 caracteres."}).max(15, {message: "Senha deve ter no máximo 15 caracteres."}),
});

export function LoginModal() {
  const[loading, setLoading] = useState(false);
  const[error, setError] = useState<string | null>(null);
  const[isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  // Inicializa o formulário com useForm e zodResolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      empresa: '',
      username: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);    

    console.log("Submetendo formulário...", values);

    const bodyData = JSON.stringify({ empresa: values.empresa, nome: values.username, senha: values.password });
    console.log("Body Data: ", bodyData)

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Erro ao enviar dados para o servidor.");
      }
      
      localStorage.setItem('authToken', data.token);

      console.log("Login bem-sucedido! Token salvo:", data.token);
      console.log("Dados do usuário:", data.user);      
      
      setIsModalOpen(false);
      navigate(`/`);      
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default"><LogIn /></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle>Login</DialogTitle>
          <DialogDescription>
            Faça login na sua conta.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="empresa"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel>Nome da Empresa</FormLabel>
                  <FormControl>
                    <Input id="empresa" placeholder="Digite o nome da Empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel>Nome de Usuário</FormLabel>
                  <FormControl>
                    <Input id="username" placeholder="Digite o nome de Usuário" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="grid gap-3">
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input id="password" type="password" placeholder="Digite sua senha" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                <CircleX size={20} />
                <span>{error}</span>
              </div>
            )}

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <Button type="submit" disabled={loading}>
                {loading ? "Carregando..." : "Fazer Login"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}