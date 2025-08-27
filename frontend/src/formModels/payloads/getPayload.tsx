import { type FormValues, type Modelo1FormValues } from "../models";

const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
};

export const getPayload = (values: FormValues, selectedModelo: { nome: string } | null, selectedEmpresa: any, selectedEstabelecimento: any, selectedLocalizacao: any) => {
    const basePayload = {
        titulo: values.titulo,
        modelo: selectedModelo?.nome,
        prompt: values.prompt,
    };
    const modelo1Values = values as Modelo1FormValues;
    if (selectedModelo?.nome === 'modelo1') {
        
        return {
            ...basePayload,
            dataInicio: modelo1Values.dataInicio ? formatDate(modelo1Values.dataInicio) : undefined,
            dataFim: modelo1Values.dataFim ? formatDate(modelo1Values.dataFim) : undefined,
            empresa: selectedEmpresa?.id,
            estabelecimento: selectedEstabelecimento?.id,
            localizacao: selectedLocalizacao?.id,
            dataInicioDB: modelo1Values.dataInicio,
            dataFimDB: modelo1Values.dataFim,
            empresaDB: modelo1Values.empresa,
            estabelecimentoDB: modelo1Values.estabelecimento,
            localizacaoDB: modelo1Values.localizacao,
        };
    } else if (selectedModelo?.nome === 'modelo2') {
        return {
            ...basePayload,
            dataInicio: modelo1Values.dataInicio ? formatDate(modelo1Values.dataInicio) : undefined,
            dataFim: modelo1Values.dataFim ? formatDate(modelo1Values.dataFim) : undefined,
            empresa: selectedEmpresa?.id,
            estabelecimento: selectedEstabelecimento?.id,
            localizacao: selectedLocalizacao?.id,
            dataInicioDB: modelo1Values.dataInicio,
            dataFimDB: modelo1Values.dataFim,
            empresaDB: modelo1Values.empresa,
            estabelecimentoDB: modelo1Values.estabelecimento,
            localizacaoDB: modelo1Values.localizacao,
        };
    }

    return basePayload;
};