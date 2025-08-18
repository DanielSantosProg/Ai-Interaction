import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import path from "path";
import fs from "fs";
import mssql from 'mssql'

const ai = new GoogleGenAI({});

interface InteractionFields {
    titulo: string,
    dataInicioDB: string,
    dataFimDB: string,
    empresaDB: string,
    estabelecimentoDB: string,
    localizacaoDB: string,
    prompt: string;
}

async function analyseDocument(docPath: string, values: InteractionFields, userId: number, pool: any) {
    if (!fs.existsSync(docPath)) {
        let erro = ("Arquivo PDF não encontrado:" + docPath)
        console.error(erro);
        return {response: null, error: erro};
    }
    const fileExtension = path.extname(docPath).toLowerCase(); // Pega a extensão do arquivo
    let contents = null;

    if (fileExtension === ".pdf") {
        contents = [
        { text: values.prompt },
        {
            inlineData: {
            mimeType: "application/pdf",
            data: Buffer.from(fs.readFileSync(docPath)).toString("base64"),
            },
        },
        ];
    } else {
        let erro = `Tipo de arquivo não suportado: ${fileExtension}. Suportados: .pdf`;
        console.error(erro);
        return {response: null, error: erro};
    }

    if (contents === null) {
        let erro = `Conteúdo não suportado.`;
        return {response: null, error: erro};
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
        });
        console.log("Gemini: ", response.text);
        response.usageMetadata && console.log("Tokens usados: ", response.usageMetadata.totalTokenCount);

        // Formatação dos filtros
        const filters = `${values.dataInicioDB}, ${values.dataFimDB}, ${values.empresaDB}, ${values.estabelecimentoDB}, ${values.localizacaoDB}`;

        if (response.text) {
            // Operações de inserção no banco
            const request = new mssql.Request(pool);
            
            // Adiciona os inputs
            request
                .input('userId', mssql.Int, userId)
                .input('prompt', mssql.VarChar(1000), values.prompt)
                .input('titulo', mssql.VarChar(100), values.titulo)
                .input('filtros', mssql.VarChar(500), filters)
                .input('retorno', mssql.VarChar(8000), response.text);

            // Executa a query de INSERT e CAPTURA o ID da linha inserida
            const insertResult = await request.query(`
                INSERT INTO HISTORICO (COD_USUARIO, PROMPT, TITULO, DT_CRIACAO, FILTROS, RETORNO)
                OUTPUT INSERTED.ID
                VALUES (@userId, @prompt, @titulo, GETDATE(), @filtros, @retorno)
            `);
            
            // Extrai o ID do resultado
            const newId = insertResult.recordset[0].ID;

            // Retorna o ID junto com a resposta da IA
            return { response: response.text, id: newId, error: null };
        }
    } catch (error) {
        if (error instanceof Error) {            
            console.error(error.message);
            return {response: null, error: error.message};
        } else if (typeof error === 'object' && error !== null && 'response' in error) {
            console.error(error.response);
            return {response: null, error: error.response};
        } else {
            console.error(`Houve um erro desconhecido: ${String(error)}`);
            return {response: null, error: `Houve um erro desconhecido: ${String(error)}`};
        }
    }  
}

export { analyseDocument };