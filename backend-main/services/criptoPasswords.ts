import { sequelize } from '../config/db';
import { User } from '../models/Relacionamentos';
import bcrypt from 'bcryptjs';

async function updatePasswords() {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    const users = await User.findAll(); // Busca todos os usuários

    for (const user of users) {
      if (user.senha && !user.senha.startsWith('$2a$')) { // Verifica se a senha não é um hash bcrypt
        console.log(`Criptografando senha para o usuário: ${user.nome}`);
        const hashedPassword = await bcrypt.hash(user.senha, 10);
        user.senha = hashedPassword;
        await user.save();
      }
    }

    console.log('Todas as senhas foram atualizadas com sucesso.');
  } catch (error) {
    console.error('Erro ao atualizar as senhas:', error);
  } finally {
    await sequelize.close();
  }
}

updatePasswords();