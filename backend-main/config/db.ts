import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  logging: false,
});

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados PostgreSQL estabelecida com sucesso!');
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados:', error);
    process.exit(1); 
  }
}

export { sequelize, connectToDatabase };