import { Router } from 'express';
import { Config } from '../models/Relacionamentos';

const router = Router();

router.get('/', async (req, res) => {
  const id_empresa = req.query.id_empresa as string;
  let config;
  if (!id_empresa) {
    config = await Config.findAll();
    console.log("Config: ", config);
    return res.send(config);
  }
  
  config = await Config.findOne({ where: { id_empresa: id_empresa } });
  res.send({
    DB_SERVER: config?.db_server || "",
    DB_DATABASE: config?.db_database || "",
    DB_USER: config?.db_user || "",
    DB_PASSWORD: config?.db_password || "",
    DB_PORT: config?.db_port || "",
    fileDirectory: config?.fileDirectory || "",
    api_key: config?.api_key || "",
  });
});

export default router;