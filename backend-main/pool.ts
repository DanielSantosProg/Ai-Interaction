import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();
let pool: pkg.Pool | null = null;

// Configurações do banco de dados
export default async function getPool(){
    if (pool) return pool
    pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    });
    return pool
}

export async function closePool(): Promise<void>{
    if (pool) {
        console.log("Fechando pool de conexões com o banco de dados.");
        await pool.end();
        pool = null;
    }
}