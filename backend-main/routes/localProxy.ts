import express, { Request, Response } from "express";
import axios from "axios";
import { Config } from "../models/Relacionamentos";

const router = express.Router();

// Pega as interações (proxy para o local)
router.get("/interactions", async (req: Request, res: Response) => {
  try {
    const empresaId = req.query.id_empresa as string;
    const userId = req.query.id as string;

    const config = await Config.findOne({ where: { id_empresa: empresaId } });

    if (!config) {
      return res.status(404).json({ error: "Configuração não encontrada" });
    }

    const localUrl = `http://localhost:3000/interactions${userId ? `?userId=${userId}` : ""}`;

    // Faz a chamada ao local, adicionando a api_key
    const response = await axios.get(localUrl, {
      headers: {
        "x-api-key": config.api_key,
      },
    });

    res.json(response.data);
  } catch (error: any) {
    console.error("Erro ao buscar histórico no local:", error.message);
    res.status(500).json({ error: "Erro ao buscar histórico no local" });
  }
});

// Pega uma interação (proxy para o local)
router.get("/interactions/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;    
    const empresaId = req.query.id_empresa as string;

    const config = await Config.findOne({ where: { id_empresa: empresaId } });

    if (!config) {
      return res.status(404).json({ error: "Configuração não encontrada" });
    }

    const localUrl = `http://localhost:3000/interactions/${id}`;

    // Faz a chamada ao local, adicionando a api_key
    const response = await axios.get(localUrl, {
      headers: {
        "x-api-key": config.api_key,
      },
    });

    res.json(response.data);
  } catch (error: any) {
    console.error("Erro ao buscar histórico no local:", error.message);
    res.status(500).json({ error: "Erro ao buscar histórico no local" });
  }
});

// Cria nova interação (proxy para o local)
router.post("/analyze", async (req: Request, res: Response) => {
  try {
    const { values, userId, id_empresa } = req.body;

    const config = await Config.findOne({ where: { id_empresa: id_empresa } });

    if (!config) {
      return res.status(404).json({ error: "Configuração não encontrada" });
    }

    const localUrl = `http://localhost:3000/analyze`;

    // Faz a chamada ao local, adicionando a api_key
    const response = await axios.post(localUrl, {values, userId}, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.api_key,
      },      
    });

    res.json(response.data);
  } catch (error: any) {
    console.error("Erro ao criar interação no local:", error.message);
    res.status(500).json({ error: "Erro ao criar interação no local" });
  }
});

// Pega as empresas (proxy para o local)
router.get("/empresas", async (req: Request, res: Response) => {
  try {
    const empresaId = req.query.id_empresa as string;
    
    const config = await Config.findOne({ where: { id_empresa: empresaId } });

    if (!config) {
      return res.status(404).json({ error: "Configuração não encontrada" });
    }

    const localUrl = `http://localhost:3000/empresas`;

    // Faz a chamada ao local, adicionando a api_key
    const response = await axios.get(localUrl, {
      headers: {
        "x-api-key": config.api_key,
      },
    });

    res.json(response.data);
  } catch (error: any) {
    console.error("Erro ao buscar empresas no local:", error.message);
    res.status(500).json({ error: "Erro ao buscar empresas no local" });
  }
});

// Pega os estabelecimentos (proxy para o local)
router.get("/estabelecimentos", async (req: Request, res: Response) => {
  try {
    const empresaId = req.query.id_empresa as string;
    const selectedEmpresa = req.query.emp_id as string;
    
    const config = await Config.findOne({ where: { id_empresa: empresaId } });

    if (!config) {
      return res.status(404).json({ error: "Configuração não encontrada" });
    }

    const localUrl = `http://localhost:3000/estabelecimentos?emp_id=${selectedEmpresa}`;

    // Faz a chamada ao local, adicionando a api_key
    const response = await axios.get(localUrl, {
      headers: {
        "x-api-key": config.api_key,
      },
    });

    res.json(response.data);
  } catch (error: any) {
    console.error("Erro ao buscar estabelecimentos no local:", error.message);
    res.status(500).json({ error: "Erro ao buscar estabelecimentos no local" });
  }
});

// Pega as localizações (proxy para o local)
router.get("/localizacoes", async (req: Request, res: Response) => {
  try {
    const empresaId = req.query.id_empresa as string;
    
    const config = await Config.findOne({ where: { id_empresa: empresaId } });

    if (!config) {
      return res.status(404).json({ error: "Configuração não encontrada" });
    }

    const localUrl = `http://localhost:3000/localizacoes`;

    // Faz a chamada ao local, adicionando a api_key
    const response = await axios.get(localUrl, {
      headers: {
        "x-api-key": config.api_key,
      },
    });

    res.json(response.data);
  } catch (error: any) {
    console.error("Erro ao buscar localizações no local:", error.message);
    res.status(500).json({ error: "Erro ao buscar localizações no local" });
  }
});

export default router;
