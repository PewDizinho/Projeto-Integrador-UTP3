function sendToServer(payload) {
    var url = "http://localhost:3000/api";
    API.postJsonHTTP(url, JSON.stringify(payload));
    return "[Enviado]";
}


function tick(e) {
    sendToServer(
        {
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
        }
    )
}