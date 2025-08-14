import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mssql from 'mssql'

import { analyseDocument } from './requests/documentAnalysis';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;


interface Response {
    response: string | null;
    error: string | null;
}

let sqlPool: mssql.ConnectionPool;

async function initializePool() {
    try {
        const {
            DB_SERVER,
            DB_DATABASE,
            DB_USER,
            DB_PASSWORD,
            DB_PORT
        } = process.env;

        if (!DB_SERVER || !DB_DATABASE || !DB_USER || !DB_PASSWORD) {
            throw new Error('Variáveis de ambiente não configuradas.');
        }

        sqlPool = await mssql.connect({
            server: DB_SERVER,
            database: DB_DATABASE,
            user: DB_USER,
            password: DB_PASSWORD,
            port: DB_PORT ? parseInt(DB_PORT, 10) : 1433,
            options: {
                encrypt: false,
                trustServerCertificate: true,
            },
            pool: {
                max: 10,
                min: 0,
                idleTimeoutMillis: 30000
            }
        });

        console.log("Pool de conexões com o banco de dados inicializado com sucesso!");
    } catch (error) {
        console.error("Erro ao inicializar o pool de conexões:", error);
        process.exit(1);
    }
}

// Inicialização do pool
initializePool();


app.get('/', (_req, res) => {
    res.send('Servidor de Interação com IA rodando.');
});

app.post('/analyze', async (req, res) => {
    try {
        if (!sqlPool) {
            throw new Error('Pool de conexões não inicializado.');
        }
        const { values, userId } = req.body;

        const docPath = "D:\\Users\\Documents\\Code\\AiInteraction\\Relatório de Vendas PayGo.pdf"

        const result = await analyseDocument(docPath, values, userId, sqlPool);
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
    }  
});

app.get('/interactions', async (req, res) => {
    try {
        const { userId } = req.query;

        if (!sqlPool) {
            throw new Error('Pool de conexões não inicializado.');
        }
        
        let result;
        if (userId){
            result = await sqlPool.request()
                .input('userId', mssql.Int, userId)
                .query(`SELECT 
                            H.ID, H.COD_USUARIO, H.PROMPT, H.TITULO, H.DT_CRIACAO, H.FILTROS, H.RETORNO, F.USR_NOME 
                            FROM HISTORICO H WITH (NOLOCK)
                            INNER JOIN FR_USUARIO F WITH (NOLOCK) ON H.COD_USUARIO = F.USR_CODIGO
                            WHERE COD_USUARIO = @userId`);
            console.log("Dados do histórico:", result.recordset);
        } else {
            result = await sqlPool.request()
                .query(`SELECT 
                            H.ID, H.COD_USUARIO, H.PROMPT, H.TITULO, H.DT_CRIACAO, H.FILTROS, H.RETORNO, F.USR_NOME 
                            FROM HISTORICO H WITH (NOLOCK)
                            INNER JOIN FR_USUARIO F WITH (NOLOCK) ON H.COD_USUARIO = F.USR_CODIGO`);
            console.log("Dados do histórico (todos):", result.recordset);
        }

        const data = result.recordset;
        res.send(data);
    } catch (error) {
        console.error("Erro ao buscar o histórico:", error);
        res.status(500).send({ error: "Erro ao buscar o histórico" });
    }  
});

app.get('/empresas', async (req, res) => {
    try {        
        let result;
        
        result = await sqlPool.request()
            .query(`SELECT GER_EMP_ID, GER_EMP_NOME_FANTASIA FROM GER_EMPRESA`);
        console.log("Empresas:", result.recordset);

        const data = result.recordset;
        res.send(data);
    } catch (error) {
        console.error("Erro ao buscar as empresas:", error);
        res.status(500).send({ error: "Erro ao buscar as empresas" });
    } 
});

app.get('/estabelecimentos', async (req, res) => {
    try {
        const { emp_id } = req.query;
        
        let result;

        result = await sqlPool.request()
            .input('empresaId', mssql.Int, emp_id)
            .query(`SELECT COP_EST_ID, COP_EST_DESCRICAO, GER_EMP_ID FROM COP_ESTABELECIMENTO WHERE GER_EMP_ID = @empresaId`);
        console.log("Estabelecimentos:", result.recordset);

        const data = result.recordset;
        res.send(data);
    } catch (error) {
        console.error("Erro ao buscar os estabelecimentos:", error);
        res.status(500).send({ error: "Erro ao buscar os estabelecimentos" });
    }  
});

app.get('/localizacoes', async (req, res) => {
    try {
        
        let result;
        
        result = await sqlPool.request()
            .query(`SELECT COP_LOC_ID,COP_LOC_DESCRICAO FROM COP_LOCALIZACAO_CORE_E_COPA`);
        console.log("Localizações:", result.recordset);

        const data = result.recordset;
        res.send(data);
    } catch (error) {
        console.error("Erro ao buscar as localizações:", error);
        res.status(500).send({ error: "Erro ao buscar as localizações" });
    } 
});

process.on('SIGINT', async () => {
    console.log("Servidor recebendo sinal de encerramento. Fechando o pool de conexões...");
    if (sqlPool) {
        await sqlPool.close();
    }
    console.log("Pool de conexões fechado. Encerrando o servidor.");
    process.exit(0);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});