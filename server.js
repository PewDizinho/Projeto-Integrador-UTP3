import express from "express";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import si from "systeminformation";
import { Rcon } from "rcon-client";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = "6060";

// --- Leitura dos arquivos de mods e plugins ---
const modsPath = '/home/ubuntu/MineServer/mods';
let mods = [];
try {
    mods = fs.readdirSync(modsPath).filter(file => file.endsWith('.jar'));
} catch (err) {
    console.error('Erro ao listar mods:', err);
}

const pluginsPath = '/home/ubuntu/MineServer/plugins';
let plugins = [];
try {
    plugins = fs.readdirSync(pluginsPath).filter(file => file.endsWith('.jar'));
} catch (err) {
    console.error('Erro ao listar plugins:', err);
}

// --- Página inicial ---
app.get("/", (req, res) => {
    fs.readFile(__dirname + "/public/pages/Pagina Inicio/index.html", "utf8", (err, text) => {
        if (err) return res.status(500).send("Erro ao carregar a página.");
        res.send(text);
    });
});

// --- API para salvar dados de entidades (Player/NPC) ---
app.post("/api", (req, res) => {
    let body = "";
    req.on("data", chunk => (body += chunk.toString()));
    req.on("end", () => {
        const jsonData = JSON.parse(body);
        const path = `public/db/${jsonData.Type}/${jsonData.EntityInfo.id}.json`;

        fs.writeFile(path, JSON.stringify(jsonData, null, 2), err => {
            if (err) {
                console.error("Error writing to file", err);
                res.status(500).end("Error saving data");
                return;
            }
            console.log("[Received Data]", jsonData);
            res.end("POST data received");
        });
    });
});

// --- Listar arquivos de players e NPCs ---
const listJsonFiles = (res, dirPath) => {
    fs.readdir(dirPath, (err, files) => {
        if (err) return res.status(500).end("Erro ao ler diretório");
        const data = files.map(file => JSON.parse(fs.readFileSync(`${dirPath}/${file}`, "utf8")));
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
    });
};

app.get("/players", (req, res) => listJsonFiles(res, __dirname + "/public/db/Player"));
app.get("/npcs", (req, res) => listJsonFiles(res, __dirname + "/public/db/Npc"));

// --- Arquivos estáticos ---
app.use(express.static(__dirname + "/public"));

// --- Redirecionamento para landing ---
app.get("/go", (req, res) => res.redirect("/pages/landing/index.html"));

// --- Informações do sistema ---
app.get("/api/serverinfo", async (req, res) => {
    try {
        const cpu = await si.currentLoad();
        const mem = await si.mem();
        const disks = await si.fsSize();
        const uptime = si.time().uptime;
        const rootDisk = disks.find(d => d.mount === "/") || {};

        const tempoDeJogo = `${Math.floor(uptime / 86400)} dias, ${Math.floor((uptime % 86400) / 3600)} horas, ${Math.floor((uptime % 3600) / 60)} minutos`;

        res.json({
            cpu: cpu.currentLoad.toFixed(1),
            ram: ((mem.active / mem.total) * 100).toFixed(1),
            ramTotal: (mem.total / 1024 ** 3).toFixed(1),
            ramUsed: (mem.active / 1024 ** 3).toFixed(1),
            diskTotal: ((rootDisk.size || 0) / 1024 ** 3).toFixed(1),
            diskUsed: ((rootDisk.used || 0) / 1024 ** 3).toFixed(1),
            uptime,
            tempoDeJogo
        });
    } catch (err) {
        console.error("Erro ao obter info do sistema:", err);
        res.status(500).json({ error: "Erro ao obter informações do servidor." });
    }
});

// --- Informações do servidor Minecraft via RCON ---
app.get("/api/minecraftinfo", async (req, res) => {
    const rcon = new Rcon({
        host: "127.0.0.1",
        port: 25575,
        password: "g987tsguho"
    });

    try {
        await rcon.connect();

        // --- JOGADORES ONLINE (NOVO MÉTODO) ---
        // Usando o comando 'list' padrão do Minecraft para maior compatibilidade
        const listResp = await rcon.send("list");
        // A resposta geralmente é "There are x/y players online: player1, player2"
        const playersMatch = listResp.match(/online:\s*(.*)/);
        const playersOnline = (playersMatch && playersMatch[1].length > 0)
            ? playersMatch[1].split(',').map(p => p.trim())
            : [];

        // --- TPS (REGEX MELHORADO) ---
        const tpsResp = await rcon.send("fe tps");
        // Tenta encontrar "Overall TPS: 20.0" ou "TPS from last 1m...: 20.0"
        const tpsMatch = tpsResp.match(/(?:Overall TPS|TPS from last 1m, 5m, 15m): ([\d\.]+)/);
        const tps = tpsMatch ? parseFloat(tpsMatch[1]).toFixed(1) : "N/A";

        // --- VERSÃO (JÁ CORRIGIDO) ---
        const versionResp = await rcon.send("fe version");
        const versionMatch = versionResp.match(/Minecraft: ([\d\.]+)/);
        const version = versionMatch ? versionMatch[1] : "1.7.10";

        res.json({
            playersOnline,
            tps,
            mods,
            plugins,
            version
        });
    } catch (err) {
        console.error("Erro RCON:", err);
        res.status(500).json({ error: "Erro ao obter informações do Minecraft." });
    } finally {
        rcon.end();
    }
});

// --- Iniciar o servidor Express ---
app.listen(port, "0.0.0.0", () => {
    console.log(`Servidor rodando na porta ${port}`);
});