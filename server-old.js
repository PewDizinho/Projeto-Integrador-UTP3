import http from "http";
import fs from "fs";


const server = http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
});

const PORT = 3000;
server.listen(PORT, () => {
    if (req.method === "OPTIONS") {
        res.writeHead(204);
        return res.end();
    }

    if (req.method === "POST") {}
});

server.on("request", (req, res) => {
    if (req.method === "POST") {
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
    }

    if (req.method === "GET" && req.url === "/players") {
        const directoryPath = "public/db/Player";

        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                console.error("Error reading directory", err);
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
                res.setHeader("Access-Control-Allow-Headers", "Content-Type");
                res.statusCode = 500;
                res.setHeader("Content-Type", "text/plain");
                return res.end("Error reading directory");
            }

            const fileNames = files.map(file => file.replace(".json", ""));
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(fileNames));
        });
    }
});

