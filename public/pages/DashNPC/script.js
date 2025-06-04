import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Pasta onde estão os arquivos JSON
const dbPath = path.join(__dirname, "db/Npc");

// Endpoint para buscar o NPC pelo nome
app.get("/npc/:name", (req, res) => {
  const npcName = req.params.name;

  // Lista todos arquivos da pasta
  fs.readdir(dbPath, (err, files) => {
    if (err) return res.status(500).send("Erro ao ler diretório");

    let found = false;
    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(dbPath, file)));
      if (data.EntityInfo.name === npcName) {
        res.json(data);
        found = true;
        break;
      }
    }
    if (!found) res.status(404).send("NPC não encontrado");
  });
});

app.listen(6060, () => {
  console.log("API rodando na porta 6060");
});

