import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Empresa } from '../models/Relacionamentos';

import 'dotenv/config';

const router = Router();

// Login de usuário
router.post('/login', async (req: Request, res: Response) => {
  const { empresa, nome, senha } = req.body;
  if (!nome || !senha || !empresa) {
    return res.status(400).json({ message: 'Nome de usuário, senha e ID da empresa são obrigatórios' });
  }

  try {
    const empresaFound = await Empresa.findOne({ where: { razao_social: empresa } });
    if (!empresaFound) {
      return res.status(401).json({ message: 'Empresa não encontrada' });
    }
    
    const userFound = await User.findOne({ where: { nome, id_empresa: empresaFound?.id } });

    if (!userFound) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const validPass = await bcrypt.compare(senha, userFound.senha);
    if (!validPass) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: userFound.id, nome: userFound.nome, tipo_usuario: userFound.tipo_usuario, id_empresa: userFound.id_empresa },
      process.env.JWT_SECRET as string,
      { expiresIn: '8h' }
    );

    const { senha: _, ...userWithoutSenha } = userFound.get({ plain: true });
    res.json({ token, user: userWithoutSenha });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no login', error: err });
  }
});

// Cadastro de usuário
router.post('/register', async (req: Request, res: Response) => {
  const { nome, senha, id_empresa, cargo, tipo_usuario } = req.body;
  if (!nome || !senha || !id_empresa || !tipo_usuario) {
    return res.status(400).json({ message: 'Dados incompletos' });
  }

  try {
    // Verifica se o nome de usuário já existe na empresa
    const existingUser = await User.findOne({ where: { nome, id_empresa } });
    if (existingUser) {
      return res.status(409).json({ message: 'Nome de usuário já existe para esta empresa' });
    }

    const hash = await bcrypt.hash(senha, 10);

    await User.create({
      nome,
      senha: hash,
      id_empresa,
      cargo,
      tipo_usuario,
    });

    res.status(201).json({ message: 'Usuário criado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no registro', error: err });
  }
});

export default router;