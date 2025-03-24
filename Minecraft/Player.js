
function sendToServer(payload) {
    var url = "http://192.168.1.105:3000/api";
    API.postJsonHTTP(url, JSON.stringify(payload));
    return "[Enviado]";
}




function tick(e) {
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
                itens: e.player.getInventory(),
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
    })
}




/**
 * Eventos:
 * NPC
 * Player
 * Bloco
 * Item
 * World
 */



