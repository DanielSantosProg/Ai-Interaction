import { z } from "zod"

export const modelo1Schema = z.object({
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

export const modelo2Schema = z.object({
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
  tipo: z.string().optional(),
  prompt: z.string().min(1,{
    message: "O prompt é requerido para que seja feita a interação."
  }).max(1000, {
    message: "Passou do limite de caracteres no prompt, use até 1000 caracteres."
  })
})

export type Modelo1FormValues = z.infer<typeof modelo1Schema>;
export type Modelo2FormValues = z.infer<typeof modelo2Schema>;

// Tipo unificado para o esquema
export type FormValues = Modelo1FormValues | Modelo2FormValues;