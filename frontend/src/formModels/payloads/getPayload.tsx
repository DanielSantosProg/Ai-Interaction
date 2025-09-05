import { type FormValues, type Modelo1FormValues, type Modelo2FormValues } from "../models";

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

    let modeloValues;
    if (selectedModelo?.nome == "duplicatas") {
        modeloValues = values as Modelo1FormValues;

        return {
            ...basePayload,
            dataInicio: modeloValues.dataInicio ? formatDate(modeloValues.dataInicio) : undefined,
            dataFim: modeloValues.dataFim ? formatDate(modeloValues.dataFim) : undefined,
            empresa: selectedEmpresa?.id,
            estabelecimento: selectedEstabelecimento?.id,
            localizacao: selectedLocalizacao?.id,
            dataInicioDB: modeloValues.dataInicio,
            dataFimDB: modeloValues.dataFim,
            empresaDB: modeloValues.empresa,
            estabelecimentoDB: modeloValues.estabelecimento,
            localizacaoDB: modeloValues.localizacao,
        };
    } else {
        modeloValues = values as Modelo2FormValues;

        return {
            ...basePayload,
            dataInicio: modeloValues.dataInicio ? formatDate(modeloValues.dataInicio) : undefined,
            dataFim: modeloValues.dataFim ? formatDate(modeloValues.dataFim) : undefined,
            empresa: selectedEmpresa?.id,
            estabelecimento: selectedEstabelecimento?.id,
            dataInicioDB: modeloValues.dataInicio,
            dataFimDB: modeloValues.dataFim,
            empresaDB: modeloValues.empresa,
            estabelecimentoDB: modeloValues.estabelecimento,
            tipo: modeloValues.tipo
        };
    }    
};