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
import { Label } from "@/components/ui/label"
import { LogIn } from "lucide-react"

export function LoginModal() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="default"><LogIn /></Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>
              Faça login na sua conta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Nome de Usuário</Label>
              <Input id="name-1" name="username" defaultValue="Digite seu nome" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Senha</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Fazer Login</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
