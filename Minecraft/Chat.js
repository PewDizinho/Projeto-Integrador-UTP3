
function sendToServer(payload) {
    var url = "http://localhost:6060/api"; //<--- Ip do servidor node
    API.postJsonHTTP(url, JSON.stringify(payload));//<--- Função que envia o json para o servidor
    return "[Enviado]";
}




function chat(e) {
    sendToServer({
        Type: "Chat", // Especifica o tipo de evento (relacionado ao jogador)
        Evento: "Chat", // Indica o tipo de evento (evento de tick)
       
        Message: e.message, // Mensagem do chat
        player: {
            id: e.player.getUniqueID(), // ID único do jogador
            name: e.player.getName(), // Nome do jogador

        }
    });
}
/**
 * Eventos:
 * NPC
 * Player
 * World
 */



