import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import crypto from 'crypto';

import { Empresa, User, Config } from './models/Relacionamentos';

import { sequelize, connectToDatabase } from './config/db';

// Importa as rotas
import authRoutes from './routes/authRoutes';
import empresasRoutes from './routes/empresaRoutes';
import usuariosRoutes from './routes/usuarioRoutes';
import configsRoutes from './routes/configRoutes';
import { sendDataToEndpoint, updateData } from './services/gerenciarConexao';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Rota de checagem do status da API
app.get('/', (req: Request, res: Response) => {
    res.send('Servidor rodando...');
});

app.get('/data', async (req: Request, res: Response) => {
    try {
        const result = await Empresa.findAll({
            include: [
                {
                    model: User,
                    as: 'usuarios',
                    attributes: { exclude: ['senha'] }
                },
                {
                    model: Config,
                    as: 'configuracao',
                }
            ]
        });
        res.json({ response: result, error: null });
    } catch (error) {
        console.error("Erro na rota /data:", error);
        res.status(500).json({ response: null, error: 'Erro ao buscar dados.' });
    }
});

app.post('/change_config', async (req: Request, res: Response) => {
    try {
        const { values, id_empresa, configType } = req.body;

        // Gera uma chave de API aleatória e segura
        const apiKey = crypto.randomBytes(32).toString('hex');

        let result;
        const [config, created] = await Config.findOrCreate({
            where: { id_empresa: id_empresa },
            defaults: {
                id_empresa: id_empresa,
                db_database: values.DB_DATABASE,
                db_user: values.DB_USER,
                db_password: values.DB_PASSWORD,
                db_port: values.DB_PORT,
                db_server: values.DB_SERVER,
                fileDirectory: "",
                api_key: apiKey // Salva a chave de API na criação
            }
        });

        const valuesToSend = {
                ...values,
                api_key: apiKey
            }

        if (!created) {
            result = await updateData(values, id_empresa, configType, apiKey);
        } else {
            result = config;            
        }

        // Adiciona a chave de API no cabeçalho da requisição para o backend local
        const response = await sendDataToEndpoint(valuesToSend);

        console.log("Dados de conexão:", result);

        res.send({ response: result, localDBResponse: response, error: null });
    } catch (error) {
        console.error("Erro: ", error);
        res.status(500).send({ response: null, localDBResponse: null, error: "Erro interno do servidor" });
    }
});


// Usa as rotas existentes
app.use("/auth", authRoutes);
app.use("/empresas", empresasRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/configs", configsRoutes);

async function startServer() {
    try {
        // Testa a conexão com o banco de dados antes de iniciar o servidor
        await connectToDatabase();
        
        // Sincroniza os modelos com o banco de dados
        await sequelize.sync({ alter: true });
        
        // Inicia o servidor apenas se a conexão for bem-sucedida
        app.listen(port, () => {
            console.log(`A API está rodando em http://localhost:${port}`);
        });

    } catch (error) {
        console.error('Falha ao iniciar o servidor:', error);
    }
}

// Inicia o servidor
startServer();
