import { GoogleGenAI } from "@google/genai";
import "dotenv/config";
import path from "path";
import fs from "fs";

const ai = new GoogleGenAI({});

async function analyseDocument(docPath: string, prompt: string) {
    if (!fs.existsSync(docPath)) {
        console.error("Arquivo PDF não encontrado:", docPath);
        return "Arquivo PDF não encontrado."
    }
    const fileExtension = path.extname(docPath).toLowerCase(); // Pega a extensão do arquivo
    let contents = null;

    if (fileExtension === ".pdf") {
        contents = [
        { text: prompt },
        {
            inlineData: {
            mimeType: "application/pdf",
            data: Buffer.from(fs.readFileSync(docPath)).toString("base64"),
            },
        },
        ];
    } else {
        console.error(
        `Tipo de arquivo não suportado: ${fileExtension}. Suportados: .pdf`
        );
        return null
    }

    if (contents === null) {
        return null;
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
        });
        console.log("Gemini: ", response.text);
        response.usageMetadata && console.log("Tokens usados: ", response.usageMetadata.totalTokenCount);

        if (response.text) {
            // Operações de inserção no banco
            console.log("Funcionou!")

            return response.text
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Houve um erro na interação: ${error.message}`);
        } else if (typeof error === 'object' && error !== null && 'response' in error) {
            console.error(`Houve um erro na interação: ${error.response}`);
        } else {
            console.error(`Houve um erro desconhecido: ${String(error)}`);
        }
    }  
}

export { analyseDocument };