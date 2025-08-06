import History from "../components/History"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const NewInteraction = () => {
  return (
    <div className="flex flex-row h-screen">
        <div className="h-full w-[285px] xl:w-[400px]">
            <History />
        </div>
        
        <div className="flex flex-col flex-grow items-center p-12">
          <div className="flex flex-col items-center">
            <h2 className="text-[32px] pb-[12px]">Nova Interação</h2>
            <p>Preencha as informações abaixo para iniciar a interação</p>
          </div>

          <div className="flex flex-row items-baseline m-12">
            <p className="font-semibold pr-4">Título</p>
            <Input className="w-xl" placeholder="Digite o título da interação" />
          </div>
          <Button className="bg-slate-600 shadow-lg hover:shadow-2xl text-white hover:bg-slate-500 hover:w-20">Enviar</Button>          
        </div>
    </div>
  )
}

export default NewInteraction