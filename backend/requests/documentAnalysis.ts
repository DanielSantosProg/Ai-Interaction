import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import path from "path";
import fs from "fs";
import mssql from 'mssql'

const ai = new GoogleGenAI({});

async function analyseDocument(docPath: string, values: any, userId: number, pool: any) {
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
        console.log(response);
        console.log("Gemini: ", response.text);
        response.usageMetadata && console.log("Tokens usados: ", response.usageMetadata.totalTokenCount);
        const inputTokens = response.usageMetadata ? response.usageMetadata.promptTokenCount : 0;
        const outputTokens = response.usageMetadata ? response.usageMetadata.candidatesTokenCount : 0;
        const thoughtTokens = response.usageMetadata ? response.usageMetadata.thoughtsTokenCount : 0;

        // Formatação dos filtros
        let filters = "";
        if (values.modelo === "modelo1") filters = `${values.dataInicioDB}, ${values.dataFimDB}, ${values.empresaDB}, ${values.estabelecimentoDB}, ${values.localizacaoDB}`;
        if (values.modelo === "modelo2") filters = `${values.dataInicioDB}, ${values.dataFimDB}, ${values.empresaDB}, ${values.estabelecimentoDB}, ${values.tipo}`;

        if (response.text) {
            // Operações de inserção no banco
            const request = new mssql.Request(pool);
            
            // Adiciona os inputs
            request
                .input('userId', mssql.Int, userId)
                .input('prompt', mssql.VarChar(1000), values.prompt)
                .input('titulo', mssql.VarChar(100), values.titulo)
                .input('filtros', mssql.VarChar(500), filters)
                .input('retorno', mssql.VarChar(8000), response.text)
                .input('inputTokens', mssql.Int, inputTokens)
                .input('outputTokens', mssql.Int, outputTokens)
                .input('thoughtTokens', mssql.Int, thoughtTokens)
                .input('modelo', mssql.VarChar(100), values.modelo);
            // Executa a query de INSERT e CAPTURA o ID da linha inserida
            const insertResult = await request.query(`
                INSERT INTO HISTORICO (COD_USUARIO, PROMPT, TITULO, DT_CRIACAO, FILTROS, RETORNO,
                TOKENS_REQUISICAO, TOKENS_RETORNO, TOKENS_PENSAMENTO, MODELO)
                OUTPUT INSERTED.ID
                VALUES (@userId, @prompt, @titulo, GETDATE(), @filtros, @retorno, @inputTokens, @outputTokens, @thoughtTokens, @modelo)
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