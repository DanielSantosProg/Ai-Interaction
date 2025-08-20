import express from 'express';
import type { Request, Response } from 'express';
import empresasRoutes from './routes/empresaRoutes';
import usuariosRoutes from './routes/usuarioRoutes';
import configsRoutes from './routes/configRoutes';

const app = express();
const port = 3001;

app.use(express.json());

// Rota para checar o status da API
app.get('/', (req: Request, res: Response) => {
  res.send('Servidor rodando...');
});

app.use("/empresas", empresasRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/configs", configsRoutes);

// Inicia o servidor na porta definida
app.listen(port, () => {
  console.log(`A API está rodando em http://localhost:${port}`);
});