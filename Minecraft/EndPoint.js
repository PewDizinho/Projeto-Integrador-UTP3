//End Point
var HTTP = {
    get: function (url) {
        var URL = java.net.URL;
        var HttpURLConnection = java.net.HttpURLConnection;
        var BufferedReader = java.io.BufferedReader;
        var InputStreamReader = java.io.InputStreamReader;
        var InputStream = java.io.InputStream;

        var obj = new URL(url);
        var con = obj.openConnection();
        con.setRequestMethod("GET");
        con.setRequestProperty("User-Agent", "Mozilla/5.0");

        var responseCode = con.getResponseCode();
        var stream;

        // Mesmo que dê erro, tenta ler o corpo da resposta
        try {
            stream = new BufferedReader(new InputStreamReader(con.getInputStream()));
        } catch (err) {
            stream = new BufferedReader(new InputStreamReader(con.getErrorStream()));
        }

        var inputLine;
        var response = "";

        while ((inputLine = stream.readLine()) != null) {
            response = response + inputLine;
        }

        stream.close();

        // Retorna o corpo da resposta sempre, mesmo com erro
        return response;
    }
}

function sendToServer(payload) {
    var url = "http://localhost:6060/commandsExec";
    API.postJsonHTTP(url, JSON.stringify(payload));
    return "[Enviado]";
}


function tick(e) {
    try {
        //

        var url = "http://localhost:6060/commands";
        var executed = [];
        var result = JSON.parse(HTTP.get(url));
        for (var i = 0; i < result.length; i++) {
            if (!result[i].executed && result[i].command) {
                var command = result[i].command.split(" ");
                switch (command[0].replace("/", "")) {
                    case "kill":
                        if (command[1] == "@e" || command[1] == "@a") {
                            var plrs = e.player.getWorld().getAllServerPlayers();
                            for (var j = 0; j < plrs.length; j++) {
                                plrs[j].setHealth(0);
                            }
                        } else {
                            var entity = e.player.getWorld().getPlayer(command[1]);
                            if (entity) {


                                entity.setHealth(0);
                            }
                        }
                        break;

                    case "kick":
                        if (command[1] === "@a" || command[1] === "@e") {
                            var plrs = e.player.getWorld().getAllServerPlayers();
                            for (var j = 0; j < plrs.length; j++) {
                                if (plrs[j].getName() == "PewDizinho") {
                                    plrs[j].sendMessage("§6[Server] §ePediram para expulsar todos, mas você é o host, §eentão você não será expulso, ou derrubaria o servidor.");
                                    continue;
                                };
                                plrs[j].kick("Expulso pelo dashboard");
                            }
                        } else {
                            var entity = e.player.getWorld().getPlayer(command[1]);
                            if (entity) {
                                if (entity.getName() == "PewDizinho") {
                                    entity.sendMessage("§6[Server] §ePediram para te expulsar, mas você é o host, §eentão §evocê não será expulso, ou derrubaria o servidor.");

                                } else {
                                    entity.kick("Expulso pelo dashboard");
                                }
                            }
                        }
                        break;
                }

                e.API.executeCommand(e.player.getWorld(), result[i].command);
                executed.push({
                    command: result[i].command,
                    executed: true
                })
            }
        };
        sendToServer({
            commands: executed,
            executed: true
        })
        print(result);
        return "[Resposta recebida]";
    } catch (err) { }
}
