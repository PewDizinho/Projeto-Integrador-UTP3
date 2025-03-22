import http from "http";
import fs from "fs";


const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello World\n");
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
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
    } else if (req.method == "GET") {
        if (req.url === "/getPlayerFiles") {
            fs.readdir("public/db/Player", (err, files) => {
                if (err) {
                    console.error("Error reading files", err);
                    res.statusCode = 500;
                    res.end("Error reading files");
                    return;
                }
                res.end(JSON.stringify(files));
            });
        }
    }
});

