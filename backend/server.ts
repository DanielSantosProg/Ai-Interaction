import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mssql from 'mssql'

import { analyseDocument } from './requests/documentAnalysis';

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;

interface Response {
    response: string | null;
    error: string | null;
}

app.get('/', (_req, res) => {
    res.send('Servidor de Interação com IA rodando.');
});

app.post('/analyze', async (req, res) => {
    let pool;
    try {
        const { values, userId } = req.body;

        const {
            DB_SERVER,
            DB_DATABASE,
            DB_USER,
            DB_PASSWORD,
            DB_PORT
        } = process.env;

        if (!DB_SERVER || !DB_DATABASE || !DB_USER || !DB_PASSWORD) {
            throw new Error('Variáveis de ambientes não configuradas.');
        }

        pool = await mssql.connect({
            server: DB_SERVER,
            database: DB_DATABASE,
            user: DB_USER,
            password: DB_PASSWORD,
            port: DB_PORT ? parseInt(DB_PORT, 10) : 1433,
            options: {
                encrypt: false,
                trustServerCertificate: true,
            },
        });
        const docPath = "D:\\Users\\Documents\\Code\\AiInteraction\\Relatório de Vendas PayGo.pdf"

        const result = await analyseDocument(docPath, values, userId, pool);
        const response: Response =
            result
                ? {
                    response: result.response,
                    error: result.error !== null && result.error !== undefined ? String(result.error) : null
                }
                : { response: null, error: "Não houve resposta" };
        res.send(response);
    } catch (error) {
        console.error("Erro ao processar a requisição:", error);
        res.status(500).send({ response: null, error: "Erro interno do servidor" });
    } finally {
        if (pool) {
            await pool.close();
            console.log("Conexão com o banco de dados fechada.");
        }
    }    
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});