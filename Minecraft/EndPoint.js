//Declare our HTTP Module
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


        var url = "http://localhost:6060/commands";
        var executed = [];
        var result = JSON.parse(HTTP.get(url));
        for (var i = 0; i < result.length; i++) {
            if (!result[i].executed && result[i].command) {
                e.API.executeCommand(e.player.getWorld(), result[i].command);
                executed.push({
                    command: result[i].command,
                    executed: true
                })
            }
        };
        sendToServer({
            commands: executed
        })
        print(result);
        return "[Resposta recebida]";
    } catch (err) { }
}
