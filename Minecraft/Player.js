
function sendToServer(payload) {
    var url = "http://localhost:6060/api"; //<--- Ip do servidor node
    API.postJsonHTTP(url, JSON.stringify(payload));//<--- Função que envia o json para o servidor
    return "[Enviado]";
}




function tick(e) {//o Evento "TICK" é um evento que ocorre a cada tick do servidor, ou seja, a cada 50 milisegundos
    // Função para enviar dados ao servidor
    sendToServer({
        Type: "Player", // Especifica o tipo de evento (relacionado ao jogador)
        Evento: "tick", // Indica o tipo de evento (evento de tick)
        EntityInfo: { // Contém informações detalhadas sobre a entidade do jogador
            id: e.player.getUniqueID(), // ID único do jogador
            name: e.player.getName(), // Nome do jogador
            health: e.player.getHealth(), // Saúde atual do jogador
            maxHealth: e.player.getMaxHealth(), // Saúde máxima do jogador
            isAlive: e.player.isAlive(), // Booleano indicando se o jogador está vivo
            age: e.player.getAge(), // Idade do jogador
            lastAttacker: e.player.getLastAttacker() != null ? e.player.getLastAttacker().getName() : "None", // Último atacante do jogador
            lookingAt: e.player.getLookingAtBlock(64) != null ? e.player.getLookingAtBlock(64).getName() : "Air", // Bloco que o jogador está olhando
            PlayerInfo: {
                hunger: e.player.getHunger(), // Fome do jogador
                exp: e.player.getExpLevel(), // Nível de experiência do jogador
                gamemode: e.player.getMode(), // Modo de jogo do jogador
                screenSize: e.player.getScreenSize().getHeight() + "x" + e.player.getScreenSize().getWidth(), // Tamanho da tela do jogador
            },
            Inventory: {
                heldItem: e.player.getHeldItem() != null ? e.player.getHeldItem().getName() : "Air", // Item segurado pelo jogador
                itens: e.player.getInventory(), // Inventário do jogador
                armor: {
                    head: e.player.getArmor(3) != null ? e.player.getArmor(3).getName() : "Air", // Armadura na cabeça
                    chest: e.player.getArmor(2) != null ? e.player.getArmor(2).getName() : "Air", // Armadura no peito
                    legs: e.player.getArmor(1) != null ? e.player.getArmor(1).getName() : "Air", // Armadura nas pernas
                    feet: e.player.getArmor(0) != null ? e.player.getArmor(0).getName() : "Air" // Armadura nos pés
                }
            },
            position: {
                dimension: e.player.getDimension(), // Dimensão em que o jogador está
                x: e.player.getX(), // Coordenada X do jogador
                y: e.player.getY(), // Coordenada Y do jogador
                z: e.player.getZ() // Coordenada Z do jogador
            },
        }
    });
}
/**
 * Eventos:
 * NPC
 * Player
 * World
 */



