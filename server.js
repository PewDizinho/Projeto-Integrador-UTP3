
import express from "express";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from 'url';
import multer from "multer";

const upload = multer({ dest: 'uploads/' });
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)
const port = "6060";
/*app.post('/stats', upload.any('uploaded_file'), async function (req, res) {
    await merge.mergeAssetsInfo(res);
});
*/
app.get("/", (req, res) => {
    fs.readFile(__dirname + '/public/index.html', 'utf8', (err, text) => {
        res.send(text);
    });
});


//TODO: Puxar informações do mine
app.post("/api", (req, res) => {
    let body = "";
    req.on("data", chunk => {
        body += chunk.toString();
    });
    req.on("end", () => {
        const jsonData = JSON.parse(body);

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
app.get("/players", (req, res) => {
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
        const fileContents = files.map(file => {
            const filePath = `${directoryPath}\\${file}`;
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        });
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(fileContents));
    });
});





app.listen(port, () => {
    console.log("Funcionando");
})