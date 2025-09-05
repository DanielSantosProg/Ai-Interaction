import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mssql from 'mssql'

import { analyseDocument } from './requests/documentAnalysis';
import { analyseDocumentWithFunctionCall } from './requests/documentAnalysisWithChart';
import { updateData } from './services/gerenciarConexao';
import gerarDocumento from './services/gerarDocumento';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;


interface Response {
    response: string | null | undefined;
    error: string | null;
    id: number | null;
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

// Middleware para validação da chave de API
const validateApiKey = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const mainBackendApiKey = req.headers['x-api-key'];
    const localApiKey = process.env.api_key;

    if (!mainBackendApiKey || mainBackendApiKey !== localApiKey) {
        console.error("Acesso não autorizado: Chave de API inválida ou ausente.");
        return res.status(401).send({ error: 'Acesso não autorizado.' });
    }
    
    console.log("Acesso Autorizado.");
    next(); // Permite que a requisição continue
};


app.get('/', validateApiKey, (_req, res) => {
    res.send('Servidor de Interação com IA rodando.');
});

app.post('/analyze', validateApiKey, async (req, res) => {
    try {
        if (!sqlPool) {
            throw new Error('Pool de conexões não inicializado.');
        }
        const { values, userId } = req.body;       
        
        const documento = await gerarDocumento(values, sqlPool);
             

        let path: string | undefined;
        if (documento?.success === true) {
            path = documento.path;
        }

        if (!path) {
            res.status(400).send({ response: null, error: "Caminho do documento não gerado." });
            throw new Error("Caminho do documento não gerado.");
        }

        const result = await analyseDocument(path, values, userId, sqlPool);
        const response: Response =
            result
                ? {
                    response: result.response,
                    error: result.error !== null && result.error !== undefined ? String(result.error) : null,
                    id: result.id
                }
                : { response: null, error: "Não houve resposta", id: null };
        res.send(response);
    } catch (error) {
        console.error("Erro: ", error);
        res.status(500).send({ response: null, error: "Erro interno do servidor" });
    }  
});

app.get('/interactions', validateApiKey, async (req, res) => {
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
                            H.ID, H.COD_USUARIO, H.PROMPT, H.TITULO, H.DT_CRIACAO, H.FILTROS, H.RETORNO, H.MODELO, F.USR_NOME 
                            FROM HISTORICO H WITH (NOLOCK)
                            INNER JOIN FR_USUARIO F WITH (NOLOCK) ON H.COD_USUARIO = F.USR_CODIGO
                            WHERE COD_USUARIO = @userId`);
        } else {
            result = await sqlPool.request()
                .query(`SELECT 
                            H.ID, H.COD_USUARIO, H.PROMPT, H.TITULO, H.DT_CRIACAO, H.FILTROS, H.RETORNO, H.MODELO, F.USR_NOME 
                            FROM HISTORICO H WITH (NOLOCK)
                            INNER JOIN FR_USUARIO F WITH (NOLOCK) ON H.COD_USUARIO = F.USR_CODIGO`);
        }

        const data = result.recordset;
        res.send(data);
    } catch (error) {
        console.error("Erro ao buscar o histórico:", error);
        res.status(500).send({ error: "Erro ao buscar o histórico" });
    }  
});

app.get('/interactions/:id', validateApiKey, async (req, res) => {
    try {
        const { id } = req.params;

        if (!sqlPool) {
            throw new Error('Pool de conexões não inicializado.');
        }

        const result = await sqlPool.request()
            .input('id', mssql.Int, id)
            .query(`SELECT 
                    H.ID, H.COD_USUARIO, H.PROMPT, H.TITULO, H.DT_CRIACAO, H.FILTROS, H.RETORNO, H.MODELO, F.USR_NOME 
                    FROM HISTORICO H WITH (NOLOCK)
                    INNER JOIN FR_USUARIO F WITH (NOLOCK) ON H.COD_USUARIO = F.USR_CODIGO
                    WHERE H.ID = @id`);

        if (result.recordset.length > 0) {
            const data = result.recordset[0];            
            res.send(data);
        } else {
            res.status(404).send({ error: "Interação não encontrada." });
        }
    } catch (error) {
        console.error("Erro ao buscar a interação:", error);
        res.status(500).send({ error: "Erro interno do servidor ao buscar a interação." });
    }
});

app.get('/empresas', validateApiKey, async (req, res) => {
    try {        
        let result;
        
        result = await sqlPool.request()
            .query(`SELECT GER_EMP_ID, GER_EMP_NOME_FANTASIA FROM GER_EMPRESA`);

        const data = result.recordset;
        res.send(data);
    } catch (error) {
        console.error("Erro ao buscar as empresas:", error);
        res.status(500).send({ error: "Erro ao buscar as empresas" });
    } 
});

app.get('/estabelecimentos', validateApiKey, async (req, res) => {
    try {
        const { emp_id } = req.query;
                
        let result;

        result = await sqlPool.request()
            .input('empresaId', mssql.Int, emp_id)
            .query(`SELECT COP_EST_ID, COP_EST_DESCRICAO, GER_EMP_ID FROM COP_ESTABELECIMENTO WHERE GER_EMP_ID = @empresaId`);

        const data = result.recordset;
        res.send(data);
    } catch (error) {
        console.error("Erro ao buscar os estabelecimentos:", error);
        res.status(500).send({ error: "Erro ao buscar os estabelecimentos" });
    }  
});

app.get('/localizacoes', validateApiKey, async (req, res) => {
    try {
        
        let result;
        
        result = await sqlPool.request()
            .query(`SELECT COP_LOC_ID,COP_LOC_DESCRICAO FROM COP_LOCALIZACAO_CORE_E_COPA`);

        const data = result.recordset;
        res.send(data);
    } catch (error) {
        console.error("Erro ao buscar as localizações:", error);
        res.status(500).send({ error: "Erro ao buscar as localizações" });
    } 
});

app.get('/document_data', validateApiKey, async (req, res) => {
    try {
        const { dataInicial, dataFinal, empId, estabelecimentoId, localizacaoId } = req.query;

        let stringFilters = "";

        if (dataInicial) {
            stringFilters += ` AND COR_DUP_DATA_VENCIMENTO >= @dataInicial`;
        }
        if (dataFinal) {
            stringFilters += ` AND COR_DUP_DATA_VENCIMENTO <= @dataFinal`;
        }
        if (empId) {
            stringFilters += ` AND GER_EMP_ID = @empId`;
        }
        if (estabelecimentoId) {
            stringFilters += ` AND COR_DUP_ESTABELECIMENTO = @estabelecimentoId`;
        }
        if (localizacaoId) {
            stringFilters += ` AND COR_DUP_LOCALIZACAO = @localizacaoId`;
        }

        let result;

        result = await sqlPool.request()
            .input('stringFilters', mssql.VarChar(250), stringFilters)
            .query(`SELECT [COR_DUP_DATA_EMISSAO] 
                    ,[COR_DUP_VALOR_DUPLICATA] 
                    ,[COR_DUP_TIPO_FATURA] 
                    ,[COR_DUP_DATA_VENCIMENTO] 
                    ,[COR_DUP_DATA_PRORROGACAO]
                    ,[COR_DUP_DATA_CADASTRO]
                    ,[COR_DUP_LOCALIZACAO]
                    ,[COR_DUP_ESTABELECIMENTO]
                    ,[COR_DUP_DATA_BAIXA]
                    ,[COR_DUP_VALOR_BAIXA]
                    ,e.GER_EMP_NOME_FANTASIA
            FROM COR_CADASTRO_DE_DUPLICATAS with(nolock) INNER JOIN GER_EMPRESA e with (nolock)
            ON e.GER_EMP_ID = COR_CADASTRO_DE_DUPLICATAS.COR_DUP_IDEMPRESA WHERE 1=1 ${stringFilters}`);

        const data = result.recordset;
        res.send(data);
    } catch (error) {
        console.error("Erro ao buscar os Dados:", error);
        res.status(500).send({ error: "Erro ao buscar os Dados" });
    }  
});

app.post('/update_data', async (req, res) => {
    try {
        if (!sqlPool) {
            throw new Error('Pool de conexões não inicializado.');
        }
        const { values } = req.body;

        const result = await updateData(values);        

        console.log("Configurações atualizadas com sucesso!");

        res.send({ response: result, error: null });
    } catch (error) {
        console.error("Erro: ", error);
        res.status(500).send({ response: null, error: "Erro interno do servidor" });
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