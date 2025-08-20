import {Router} from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.send('Rota GET para Usuarios.');
});

export default router;