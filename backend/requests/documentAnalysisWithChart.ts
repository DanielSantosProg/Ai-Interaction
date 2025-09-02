import { Content, GoogleGenAI, Type } from "@google/genai";
import "dotenv/config";
import path from "path";
import fs from "fs";
import mssql from 'mssql'

const createChartFunctionDeclaration = {
  name: 'generateChartData',
  description: 'Creates a bar chart given a title, labels, and corresponding values.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      title: {
        type: Type.STRING,
        description: 'The title for the chart.',
      },
      chartType: {
        type: Type.STRING,
        description: 'The type of chart to be generated. It can be one of the following: "bar", "line", "pie"',
      },
      labels: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: 'List of labels for the data points (e.g., ["Q1", "Q2", "Q3"]).',
      },
      values: {
        type: Type.ARRAY,
        items: { type: Type.NUMBER },
        description: 'List of numerical values corresponding to the labels (e.g., [50000, 75000, 60000]).',
      },
    },
    required: ['title', 'chartType', 'labels', 'values'],
  },
};

function generateChartData(title: string, charttype: string, labels: any, values: any) {
    let resultString = `${title}, ${charttype}, ${labels}, ${values}`
    return resultString;
}

const ai = new GoogleGenAI({});

async function analyseDocumentWithFunctionCall(docPath: string, values: any, userId: number, pool: any) {
    if (!fs.existsSync(docPath)) {
        let erro = ("Arquivo PDF não encontrado:" + docPath)
        console.error(erro);
        return { response: null, error: erro };
    }
    const fileExtension = path.extname(docPath).toLowerCase();
    let contents: Content[] | null = null;
    const config = {
        tools: [{
            functionDeclarations: [createChartFunctionDeclaration]
        }]
    };

    if (fileExtension === ".pdf") {
        contents = [
            {
                role: "user",
                parts: [{text: values.prompt}]
            }            
        ];
    } else {
        let erro = `Tipo de arquivo não suportado: ${fileExtension}. Suportados: .pdf`;
        console.error(erro);
        return { response: null, error: erro };
    }

    if (contents === null) {
        let erro = `Conteúdo não suportado.`;
        return { response: null, error: erro };
    }

    try {
        // Primeira requisição ao Gemini
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: config
        });

        let functionCall = null;
        let functionResult = null;

        if (result.functionCalls && result.functionCalls.length > 0) {
            functionCall = result.functionCalls[0];
            console.log(`Function to call: ${functionCall.name}`);
            console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
            if (functionCall.name === "generateChartData")
                functionResult = generateChartData("Titulo", "Tipo", "ArrayLabels", "ArrayValues");
                console.log(functionResult);
        } else {
            console.log("No function call found in the response.");
            console.log(result.text);
        }

        let function_response_part;

        if (functionCall){            
            function_response_part = {
                name: functionCall.name,
                response: { functionResult }
            }
        }

        if (result.candidates && result.candidates.length > 0 && result.candidates[0].content) {
            contents.push(result.candidates[0].content);
        }
        contents.push({ role: 'user', parts: [{ functionResponse: function_response_part }] });

        const final_response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                tools: [{
                    functionDeclarations: [createChartFunctionDeclaration]
                }]
            }
        });

        const responseText = final_response.text;
        // Extração dos tokens
        const inputTokens = final_response.usageMetadata ? final_response.usageMetadata.promptTokenCount : 0;
        const outputTokens = final_response.usageMetadata ? final_response.usageMetadata.candidatesTokenCount : 0;
        const thoughtTokens = final_response.usageMetadata ? final_response.usageMetadata.thoughtsTokenCount : 0;
        
        const responseToSave = {
            text: responseText,
            chartData: functionResult // Salva os dados do gráfico
        }

        const filters = values.modelo === "modelo1" ? `${values.dataInicioDB}, ${values.dataFimDB}, ${values.empresaDB}, ${values.estabelecimentoDB}, ${values.localizacaoDB}` : "";

        // Salva no banco de dados
        const request = new mssql.Request(pool);
        request
            .input('userId', mssql.Int, userId)
            .input('prompt', mssql.VarChar(1000), values.prompt)
            .input('titulo', mssql.VarChar(100), values.titulo)
            .input('filtros', mssql.VarChar(500), filters)
            .input('retorno', mssql.VarChar(8000), JSON.stringify(responseToSave)) // Salva o texto e os dados do gráfico
            .input('inputTokens', mssql.Int, inputTokens)
            .input('outputTokens', mssql.Int, outputTokens)
            .input('thoughtTokens', mssql.Int, thoughtTokens)
            .input('modelo', mssql.VarChar(100), values.modelo);

        const insertResult = await request.query(`
            INSERT INTO HISTORICO (COD_USUARIO, PROMPT, TITULO, DT_CRIACAO, FILTROS, RETORNO,
            TOKENS_REQUISICAO, TOKENS_RETORNO, TOKENS_PENSAMENTO, MODELO)
            OUTPUT INSERTED.ID
            VALUES (@userId, @prompt, @titulo, GETDATE(), @filtros, @retorno, @inputTokens, @outputTokens, @thoughtTokens, @modelo)
        `);
        
        const newId = insertResult.recordset[0].ID;
        return { response: responseText, error: null, id: newId };
                    
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            return { response: null, error: error.message, id: null };
        } else if (typeof error === 'object' && error !== null && 'response' in error) {
            console.error(error.response);
            return { response: null, error: error.response, id: null };
        } else {
            console.error(`Houve um erro desconhecido: ${String(error)}`);
            return { response: null, error: `Houve um erro desconhecido: ${String(error)}`, id: null };
        }
    }
}

export { analyseDocumentWithFunctionCall };