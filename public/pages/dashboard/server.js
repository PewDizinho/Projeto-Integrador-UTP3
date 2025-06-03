const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 6060; // Ou 3000, dependendo da sua escolha

app.use(cors()); // Permite requisições de diferentes origens (importante para o navegador)
app.use(express.json()); // Habilita o Express a ler JSON no corpo da requisição

// Armazenamento temporário dos dados do jogo
let serverData = {
    status: "Desconhecido",
    playerCount: 0,
    name: "Aguardando Dados",
    description: "Aguardando Dados",
    ping: "N/A"
};
let playersData = {}; // Usaremos um objeto para facilitar o acesso por ID
let npcsData = {};    // Usaremos um objeto para facilitar o acesso por ID

// Endpoint para receber dados do jogo
app.post('/api', (req, res) => {
    const payload = req.body;
    console.log("Dados recebidos:", payload.Type); // Para debug

    if (payload.Type === "Server") { // Se você conseguir enviar dados do servidor também
        serverData = {
            status: payload.status,
            playerCount: payload.playerCount,
            name: payload.name,
            description: payload.description,
            ping: payload.ping
        };
    } else if (payload.Type === "Player") {
        playersData[payload.EntityInfo.id] = payload.EntityInfo;
    } else if (payload.Type === "Npc") {
        npcsData[payload.EntityInfo.id] = payload.EntityInfo;
    }

    res.status(200).send("[Recebido]");
});

// Endpoint para o dashboard buscar dados
app.get('/data/server', (req, res) => {
    res.json(serverData);
});

app.get('/data/players', (req, res) => {
    // Retorna os jogadores como um array para facilitar a iteração no frontend
    res.json(Object.values(playersData));
});

app.get('/data/npcs', (req, res) => {
    // Retorna os NPCs como um array
    res.json(Object.values(npcsData));
});

// Opcional: Adicione um endpoint para remover jogadores/NPCs inativos se sua API de jogo notificar a saída
// Por exemplo:
// app.post('/api/player/disconnected', (req, res) => {
//     delete playersData[req.body.playerId];
//     res.status(200).send("Player removed");
// });


app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Use uma única porta e URL para o seu servidor backend
var serverApiUrl = "http://192.168.1.105:6060/api"; // Escolha uma porta e mantenha consistente

function sendToServer(payload) {
    API.postJsonHTTP(serverApiUrl, JSON.stringify(payload));
    return "[Enviado]";
}

// A função 'tick' é um evento que ocorre a cada tick do servidor (aprox. 50 milissegundos)
function tick(e) {
    // Verifica se o evento 'e' possui informações de jogador
    if (e.player) {
        sendToServer({
            Type: "Player",
            Evento: "tick",
            EntityInfo: {
                id: e.player.getUniqueID(),
                name: e.player.getName(),
                health: e.player.getHealth(),
                maxHealth: e.player.getMaxHealth(),
                isAlive: e.player.isAlive(),
                age: e.player.getAge(),
                lastAttacker: e.player.getLastAttacker() != null ? e.player.getLastAttacker().getName() : "None",
                lookingAt: e.player.getLookingAtBlock(64) != null ? e.player.getLookingAtBlock(64).getName() : "Air",
                PlayerInfo: {
                    hunger: e.player.getHunger(),
                    exp: e.player.getExpLevel(),
                    gamemode: e.player.getMode(),
                    screenSize: e.player.getScreenSize().getHeight() + "x" + e.player.getScreenSize().getWidth(),
                },
                Inventory: {
                    heldItem: e.player.getHeldItem() != null ? e.player.getHeldItem().getName() : "Air",
                    // Atenção: e.player.getInventory() pode retornar um objeto complexo que talvez não seja ideal para enviar diretamente.
                    // Você pode precisar iterar e extrair apenas os nomes dos itens ou IDs.
                    // Por simplicidade, vou omitir 'itens' por enquanto, ou você pode ajustá-lo.
                    // itens: e.player.getInventory(),
                    armor: {
                        head: e.player.getArmor(3) != null ? e.player.getArmor(3).getName() : "Air",
                        chest: e.player.getArmor(2) != null ? e.player.getArmor(2).getName() : "Air",
                        legs: e.player.getArmor(1) != null ? e.player.getArmor(1).getName() : "Air",
                        feet: e.player.getArmor(0) != null ? e.player.getArmor(0).getName() : "Air"
                    }
                },
                position: {
                    dimension: e.player.getDimension(),
                    x: e.player.getX(),
                    y: e.player.getY(),
                    z: e.player.getZ()
                },
            }
        });
    }

    // Verifica se o evento 'e' possui informações de NPC
    if (e.npc) {
        sendToServer({
            Type: "Npc",
            Evento: "tick",
            EntityInfo: {
                id: e.npc.getUniqueID(),
                name: e.npc.getName(),
                health: e.npc.getHealth(),
                maxHealth: e.npc.getMaxHealth(),
                isAlive: e.npc.isAlive(),
                age: e.npc.getAge(),
                lastAttacker: e.npc.getLastAttacker() != null ? e.npc.getLastAttacker().getName() : "None",
                lookingAt: e.npc.getLookingAtBlock(64) != null ? e.npc.getLookingAtBlock(64).getName() : "Air",
                position: {
                    dimension: e.npc.getDimension(),
                    x: e.npc.getX(),
                    y: e.npc.getY(),
                    z: e.npc.getZ()
                },
            }
        });
    }

    // Se você tiver dados do mundo/servidor para enviar, pode adicioná-los aqui também.
    // Ex:
    // if (e.world) {
    //    sendToServer({
    //        Type: "Server",
    //        Evento: "tick",
    //        status: "Ligado", // Ou e.world.getServerStatus() se houver
    //        playerCount: e.world.getPlayers().length, // Ou e.world.getPlayerCount()
    //        name: "Meu Servidor",
    //        description: "Servidor incrível!",
    //        ping: 50
    //    });
    // }
}