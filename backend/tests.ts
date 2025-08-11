import mssql from 'mssql'
import dotenv from 'dotenv';

dotenv.config();

async function connectToDatabase() {
    try {
        const {
            DB_SERVER,
            DB_DATABASE,
            DB_USER,
            DB_PASSWORD,
            DB_PORT
        } = process.env;

        if (!DB_SERVER || !DB_DATABASE || !DB_USER || !DB_PASSWORD) {
            throw new Error('Variáveis de ambiente não configuradas. Verifique o arquivo .env');
        }

        const pool = await mssql.connect({
            server: DB_SERVER,
            database: DB_DATABASE,
            user: DB_USER,
            password: DB_PASSWORD,
            port: DB_PORT ? parseInt(DB_PORT, 10) : 1433,
            options: {
                encrypt: false, // Pode ser necessário dependendo da sua configuração
                trustServerCertificate: true, // Pode ser necessário dependendo da sua configuração
            },
        });

        console.log("Conexão com o banco de dados estabelecida com sucesso!");
        return pool;

    } catch (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
        // Você pode re-lançar o erro ou retornar um valor nulo, dependendo da sua necessidade.
        throw err;
    }
}

// Exemplo de uso
(async () => {
    let conn;
    try {
        conn = await connectToDatabase();
        
        // Se a conexão for bem-sucedida, o código aqui será executado.
        let id = 8955;
        const request7 = new mssql.Request(conn); // Passando a conexão
        const dadosDup = await request7.input("id", mssql.Int, id).query(`
            SELECT
            COR_DUP_ID AS duplicataId,
            COR_CLI_BANCO AS codBanco,
            COR_DUP_VALOR_DUPLICATA AS dupValor
            FROM COR_CADASTRO_DE_DUPLICATAS
            WHERE COR_DUP_ID = @id;
        `);

        if (dadosDup.recordset.length > 0) {
            const data = dadosDup.recordset[0];
            console.log("Dados: ", data);
        } else {
            console.log("Nenhum registro encontrado para o ID: ", id);
        }

    } catch (err) {
        // Se a conexão falhar, o erro será capturado aqui.
        console.error("Falha fatal na aplicação:", err);
    } finally {
        // Opcional: fechar a conexão no final
        if (conn) {
            await conn.close();
            console.log("Conexão com o banco de dados fechada.");
        }
    }
})();