import express from "express";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from 'url';
import si from "systeminformation";
import { exec } from "child_process";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
const port = "6060"; //Porta do servidor

app.get("/", (req, res) => {
    fs.readFile(__dirname + '/public/pages/Pagina Inicio/index.html', 'utf8', (err, text) => {
        if (err) {
            res.status(500).send("Erro ao carregar a página.");
            return;
        }
        res.send(text);
    });
});


//162.168.0.1:6060/players
app.post("/api", (req, res) => {//Quando eu dou um POST ou seja, envio informações para o site no 192.168.1.15:6060/api 
    let body = "";
    req.on("data", chunk => {
        body += chunk.toString();
    });
    req.on("end", () => {
        const jsonData = JSON.parse(body);

        //Ele pega as informações enviadas, e salva dentro da pasta public/db/(Tipo de entidade)/(ID da entidade).json ou seja /public/db/Player/UUID.json
        fs.writeFile(`public/db/${jsonData.Type}/${jsonData.EntityInfo.id}.json`, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error("Error writing to file", err);
                res.statusCode = 500;
                res.end("Error saving data");
                return;
            }
            console.log("[Received Data]", jsonData);
        });
        res.end("POST data received");
    });
});


app.get("/players", (req, res) => { //Quando eu acesso o 192.168.1.15:6060/players ele vai me retornar todos os players salvos na pasta /public/db/Player
    //Eu faço isso pra conseguir ter uma lista da pasta, é uma forma mais fácil de resolver um outro problema que eu tive
    const directoryPath = __dirname + "\\public\\db\\Player";

    fs.readdir(directoryPath, (err, files) => {
        if (err) { //Caso dê erro
            console.error("Error reading directory", err);
            res.statusCode = 500;
            return res.end("Error reading directory");
        }
        //Isso resolve um erro chamado CORS, pesquisem se quiserem saber mais
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setHeader("Content-Type", "text/plain");


        const fileContents = files.map(file => {//Ele lê os arquivos e salva dentro de um array
            const filePath = `${directoryPath}\\${file}`;
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        });
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(fileContents));//Devolve o nome dos arquivos dentro da pasta /public/db/Player
    });
});

app.get("/npcs", (req, res) => { //Quando eu acesso o 192.168.1.15:6060/npcs ele vai me retornar todos os players salvos na pasta /public/db/Npc
    //Eu faço isso pra conseguir ter uma lista da pasta, é uma forma mais fácil de resolver um outro problema que eu tive
    const directoryPath = __dirname + "\\public\\db\\Npc";

    fs.readdir(directoryPath, (err, files) => {
        if (err) { //Caso dê erro
            console.error("Error reading directory", err);
            res.statusCode = 500;
            return res.end("Error reading directory");
        }
        //Isso resolve um erro chamado CORS, pesquisem se quiserem saber mais
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setHeader("Content-Type", "text/plain");


        const fileContents = files.map(file => {//Ele lê os arquivos e salva dentro de um array
            const filePath = `${directoryPath}\\${file}`;
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        });
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(fileContents));//Devolve o nome dos arquivos dentro da pasta /public/db/Player
    });
});

// Middleware para servir arquivos estáticos
app.use(express.static(__dirname + '/public'));

// Redirecionador: sempre envia para landing
app.get('/go', (req, res) => {
    res.redirect('/pages/landing/index.html');
});

app.get('/api/serverinfo', async (req, res) => {
    try {
        const cpu = await si.currentLoad();
        const mem = await si.mem();
        const disks = await si.fsSize();
        const uptime = si.time().uptime;

        // Filtrar o disco montado em "/"
        const rootDisk = disks.find(disk => disk.mount === '/');
        let diskTotal = 0;
        let diskUsed = 0;

        if (rootDisk) {
            diskTotal = (rootDisk.size / (1024 ** 3)).toFixed(1); // Total em GB
            diskUsed = (rootDisk.used / (1024 ** 3)).toFixed(1); // Usado em GB
        }

        res.json({
            cpu: cpu.currentLoad.toFixed(1),
            ram: ((mem.active / mem.total) * 100).toFixed(1),
            ramTotal: (mem.total / (1024 ** 3)).toFixed(1),
            ramUsed: (mem.active / (1024 ** 3)).toFixed(1),
            diskTotal: diskTotal,
            diskUsed: diskUsed,
            uptime: uptime
        });
    } catch (err) {
        console.error("Erro ao obter informações do servidor:", err);
        res.status(500).json({ error: "Erro ao obter informações do servidor." });
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${port}`);
});

