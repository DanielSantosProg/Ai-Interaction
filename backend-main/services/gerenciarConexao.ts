import axios from "axios";
import { Config } from "../models/Relacionamentos";

interface ConnectionProps {
    values: {
        DB_SERVER?: string;
        DB_DATABASE?: string;
        DB_USER?: string;
        DB_PASSWORD?: string;
        DB_PORT?: number;
        fileDirectory?: string;
    }
    id_empresa: number;
    configType: string;
}

export async function updateData(values: ConnectionProps['values'], id_empresa: number, configType: string): Promise<any> {
    try {
        let result = null;
        if (configType == "general") {
            result = await Config.update({
                fileDirectory: values.fileDirectory
            }, 
            {
                where: {id_empresa: id_empresa}
            });
        } else {
            result = await Config.update({
                db_server: values.DB_SERVER, 
                db_database: values.DB_DATABASE, 
                db_user: values.DB_USER,
                db_password: values.DB_PASSWORD, 
                db_port: values.DB_PORT
            }, 
            { 
                where: { id_empresa: id_empresa } 
            });
        }       

        if (result[0] === 0) {
            console.warn(`Nenhuma linha foi atualizada. A empresa de id ${id_empresa} pode não ter uma configuração.`);
        }

        return result;
    } catch (error) {
        console.error("Erro ao atualizar as variáveis de ambiente:", error);
        throw error;
    }
}

export async function sendDataToEndpoint(values: ConnectionProps['values']): Promise<any> {
    const endpointUrl ='http://localhost:3000/update_data';

    try {
        const response = await axios.post(endpointUrl, { values });
        console.log("Dados enviados com sucesso: ", response.data);

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Erro ao enviar dados para o endpoint:", error.message);
            console.error("Detalhes do erro:", error.response?.data);
            throw error.message;
        } else {
            console.error("Erro inesperado:", error);
            throw error;
        }
    }
}