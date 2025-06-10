
import express from "express";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from 'url';
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
const port = "6060"; //Porta do servidor

app.get("/", (req, res) => { //Rota principal, ou seja, no 192.168.1.15:6060/ ele vai mostrar o index.html
    fs.readFile(__dirname + '/public/index.html', 'utf8', (err, text) => {
        res.send(text);//Envia o index.html
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

        if (jsonData.Type == "Chat") {
            const chatFilePath = __dirname + '/public/db/Chat/chat.json';
            let chatData = [];
            if (fs.existsSync(chatFilePath)) {
                const fileContent = fs.readFileSync(chatFilePath, 'utf8');
                try {
                    chatData = JSON.parse(fileContent);
                    if (!Array.isArray(chatData)) chatData = [];
                } catch (e) {
                    chatData = [];
                }
            }
            chatData.push(jsonData);
            fs.writeFileSync(chatFilePath, JSON.stringify(chatData, null, 2));
            res.end("Chat data saved");
            return;
        }
        //Ele pega as informações enviadas, e salva dentro da pasta public/db/(Tipo de entidade)/(ID da entidade).json ou seja /public/db/Player/UUID.json
        fs.writeFile(`public/db/${jsonData.Type}/${jsonData.EntityInfo.id}.json`, JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                console.error("Error writing to file", err);
                res.statusCode = 500;
                res.end("Error saving data");
                return;
            }
            //  console.log("[Received Data]", jsonData);
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
app.get("/playersQuantity", (req, res) => {
    const directoryPath = __dirname + "\\public\\db\\Player";

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error("Error reading directory", err);
            res.statusCode = 500;
            return res.end("Error reading directory");
        }

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setHeader("Content-Type", "text/plain");

        const playerCount = files.length; // Conta o número de arquivos na pasta
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ quantity: playerCount })); // Retorna a quantidade de jogadores
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

app.get("/world", (req, res) => {
    const directoryPath = __dirname + "\\public\\db\\World";

    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error("Error reading directory", err);
            res.statusCode = 500;
            return res.end("Error reading directory");
        }

        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");
        res.setHeader("Content-Type", "text/plain");


        const fileContents = files.map(file => {
            const filePath = `${directoryPath}\\${file}`;
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        });
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(fileContents));
    });
});

app.get("/chat", (req, res) => {

    const chatFilePath = __dirname + '/public/db/Chat/chat.json';
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Content-Type", "text/plain");
    if (!fs.existsSync(chatFilePath)) {
        res.setHeader("Content-Type", "application/json");
        return res.end(JSON.stringify([])); // Retorna um array vazio se o arquivo não existir
    }
    fs.readFile(chatFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading chat file", err);
            res.statusCode = 500;
            return res.end("Error reading chat file");
        }
        let chatData = [];
        try {
            chatData = JSON.parse(data);
        } catch (e) {
            console.error("Error parsing chat data", e);
        }
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(chatData));
    });
});




app.listen(port, () => {
    console.log("Funcionando");
})
