import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { MoveRight, Funnel } from "lucide-react";
import { DatePicker } from "@/components/DatePicker";
import { SelectScrollable } from "@/components/Select2";
import type { UseFormReturn } from "react-hook-form";
import type { Modelo2FormValues } from "../models";

type Empresa = { id: number; nome: string; };
type Estabelecimento = { id: number; nome: string; empresaId: number; };
type Localizacao = { id: number; nome: string; };

interface Modelo2FieldsProps {
    form: UseFormReturn<Modelo2FormValues>;
    empresas: Empresa[];
    estabelecimentos: Estabelecimento[];
    localizacoes: Localizacao[];
    selectedEmpresa: Empresa | null;
    selectedEstabelecimento: Estabelecimento | null;
    selectedLocalizacao: Localizacao | null;
    setSelectedEmpresa: (empresa: Empresa | null) => void;
    setSelectedEstabelecimento: (estabelecimento: Estabelecimento | null) => void;
    setSelectedLocalizacao: (localizacao: Localizacao | null) => void;
}

export const Modelo2Fields: React.FC<Modelo2FieldsProps> = ({
    form,
    empresas,
    estabelecimentos,
    localizacoes,
    setSelectedEmpresa,
    setSelectedEstabelecimento,
    setSelectedLocalizacao,
}) => (
    <div className="flex flex-col items-center lg:items-stretch bg-white border-2 rounded-md w-full p-4 mt-8">
            <div className="flex flex-row mb-3 gap-2 lg:self-start items-center">
                <Funnel className="text-[#1F3D58]" size={18} />
                <FormLabel className="font-semibold lg:mr-4 text-[14px] text-[#323232]">Selecione os filtros:</FormLabel>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2'>
                {/* Período */}
                <div className='mt-4'>
                    <FormLabel className="mb-3 lg:ml-4 self-center">Período</FormLabel>
                    <div className="flex flex-row w-full items-center gap-2">
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
                <div className='mt-4'>
                    <FormLabel className="mb-3 lg:ml-4">Empresa</FormLabel>
                    <FormField
                        control={form.control}
                        name="empresa"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <SelectScrollable
                                        placeholder="Selecione a empresa"
                                        items={empresas.map((empresa) => ({ value: empresa.nome, label: empresa.nome, id: empresa.id }))}
                                        onValueChange={(value: string) => {
                                            field.onChange(value);
                                            const empresaObj = empresas.find((empresa) => empresa.nome === value) || null;
                                            setSelectedEmpresa(empresaObj);
                                        }}
                                        defaultValue={field.value}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {/* Estabelecimento e Localização */}
                <div className='mt-4'>
                    <FormLabel className="mb-3 lg:ml-4">Estabelecimento</FormLabel>
                    <FormField
                        control={form.control}
                        name="estabelecimento"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <SelectScrollable
                                        placeholder="Selecione o estabelecimento"
                                        items={estabelecimentos.map(est => ({ id: est.id, value: est.nome, label: est.nome }))}
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
                <div className='mt-4'>
                    <FormLabel className="mb-3 lg:ml-4">Localização</FormLabel>
                    <FormField
                        control={form.control}
                        name="localizacao"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <SelectScrollable
                                        placeholder="Selecione a localização"
                                        items={localizacoes.map(localizacao => ({ id: localizacao.id, value: localizacao.nome, label: localizacao.nome }))}
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
);