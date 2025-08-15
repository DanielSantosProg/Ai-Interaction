import mssql from 'mssql';
import gerarDocumento from './services/gerarDocumento';
import dotenv from 'dotenv';
import { path } from 'pdfkit';

dotenv.config();

const port = process.env.PORT || 3000;

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


const config = {
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
};

async function main() {
    let sqlPool;
    const dir = 'D:\\Users\\Documents';
    try {
        sqlPool = await mssql.connect(config);
        console.log("Conexão com o banco de dados estabelecida com sucesso.");

        
        const tituloRelatorio = 'RelatorioDeDuplicatas';
        const modelo = 'modelo1';
        const dataInicial = '2025-01-01'; 
        const dataFinal = '2026-12-31';
        const empId = 1; 
        const estabelecimentoId = 1; 
        const localizacaoId = 1; 

        const resultado = await gerarDocumento(
            dir,
            tituloRelatorio,
            modelo,
            sqlPool,
            dataInicial,
            dataFinal,
            empId,
            estabelecimentoId,
            localizacaoId
        );

        if (resultado.success) {
            console.log(`Relatório gerado com sucesso! Arquivo: ${resultado.path}`);
        } else {
            console.log("Falha ao gerar o relatório.");
        }

    } catch (err) {
        console.error("Erro no processo de teste:", err);
    } finally {
        if (sqlPool) {
            await sqlPool.close();
            console.log("Conexão com o banco de dados encerrada.");
        }
    }
}

main();