//World
function sendToServer(payload) {
    var url = "http://localhost:6060/api"; //<--- Ip do servidor node
    API.postJsonHTTP(url, JSON.stringify(payload));//<--- Função que envia o json para o servidor
    return "[Enviado]";
}




function tick(e) {//o Evento "TICK" é um evento que ocorre a cada tick do servidor, ou seja, a cada 50 milisegundos
    // Função para enviar dados ao servidor

    var allPlayers = e.player.getWorld().getPlayerNames();
    var result = []
    for (var i = 0; i < allPlayers.length; i++) {
        var playerName = allPlayers[i];
        var player = e.player.getWorld().getPlayer(playerName);
        if (player) {
            result.push(player.getName());
        }
    }
    sendToServer({
        Type: "World", // Especifica o tipo de evento (relacionado ao jogador)
        Evento: "tick", // Indica o tipo de evento (evento de tick)
        EntityInfo: {
            id: e.player.getWorld().getDimensionID(),
        },
        allPlayers: result.toString(),
        time: e.player.getWorld().getTime(),
        age: e.player.getWorld().getTotalTime(),
        isDay: e.player.getWorld().isDay(),
        isRaining: e.player.getWorld().isRaining(),

    });
}




