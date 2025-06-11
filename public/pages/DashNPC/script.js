let player;
async function carregarPlayers() {
  try {
    fetch("http://localhost:6060/playersQuantity")
      .then(response => response.json())
      .then(data => {

        plrs = data.players;
        document.getElementById("player-count").innerText = data.quantity || 0;
      })
      .catch(() => {
        document.getElementById("player-count").innerText = "Erro";
      });
    const response = await fetch("http://localhost:6060/npcs");
    const players = await response.json();
    const urlParams = new URLSearchParams(window.location.search);
    const playerName = urlParams.get("player");
    player = (players.find(player => player.EntityInfo && player.EntityInfo.name === playerName));
    console.log(player.EntityInfo.name)
    const heartContainer = document.getElementById("heart");
    const hungryContainer = document.getElementById("hungry");
    heartContainer.innerHTML = ""; // Limpa o conteúdo anterior
    hungryContainer.innerHTML = ""; // Limpa o conteúdo anterior
    for (var i = 0; i < player.EntityInfo.health / 2; i++) {
      const heart = document.createElement("img");
      heart.src = "../../assets/heart.png";
      heart.alt = "Coração";
      heart.className = "heart";
      heartContainer.appendChild(heart);
    }
    if (player.EntityInfo.health % 2 === 1) {
      const halfHeart = document.createElement("img");
      halfHeart.src = "../../assets/half-heart.png";
      halfHeart.alt = "Meio coração";
      halfHeart.className = "heart";
      heartContainer.appendChild(halfHeart);
    }
    const missingHearts = Math.floor((player.EntityInfo.maxHealth - player.EntityInfo.health) / 2);
    for (let i = 0; i < missingHearts; i++) {
      const brokenHeart = document.createElement("img");
      brokenHeart.src = "../../assets/broken-heart.png";
      brokenHeart.alt = "Coração partido";
      brokenHeart.className = "heart";
      heartContainer.appendChild(brokenHeart);
    }

    for (var i = 0; i < player.EntityInfo.hungry / 2; i++) {
      const hungry = document.createElement("img");
      hungry.src = "../../assets/hungry.png";
      hungry.alt = "Fome";
      hungry.className = "hungry";
      hungryContainer.appendChild(hungry);
    }
    if (player.EntityInfo.hungry % 2 === 1) {
      const halfHungry = document.createElement("img");
      halfHungry.src = "../../assets/half-hungry.png";
      halfHungry.alt = "Meio fome";
      halfHungry.className = "hungry";
      hungryContainer.appendChild(halfHungry);
    }
    const missingHungry = Math.floor((20 - player.EntityInfo.hungry) / 2);
    for (let i = 0; i < missingHungry; i++) {
      const emptyHungry = document.createElement("img");
      emptyHungry.src = "../../assets/broken-hungry.png";
      emptyHungry.alt = "Fome vazia";
      emptyHungry.className = "hungry";
      hungryContainer.appendChild(emptyHungry);
    }



    const skin = document.createElement("img");
    skin.src = "https://mc-heads.net/body/" + player.EntityInfo.name + "/left";
    skin.alt = "Skin do Player";
    skin.className = "skin";
    const skinContainer = document.getElementById("player-avatar");
    skinContainer.innerHTML = ""; // Limpa o conteúdo anterior
    skinContainer.appendChild(skin);


    //info alheia
    document.getElementById("player-name").innerText = player.EntityInfo.name || "Desconhecido";
    document.getElementById("player-position").innerText = `X: ${player.EntityInfo.position.x.toFixed(2)}, Y: ${player.EntityInfo.position.y.toFixed(2)}, Z: ${player.EntityInfo.position.z.toFixed(2)}`;
    //age
    document.getElementById("player-age").innerText = `Idade: ${Math.floor((player.EntityInfo.age / 20)) || 0} segundos`;
    //screen-size
    document.getElementById("player-screen-size").innerText = `Tamanho da tela: ${player.EntityInfo.PlayerInfo.screenSize}`;

    //Itens
    /**
     *   "Inventory": {
      "heldItem": "customnpcs:npcScripter",
      "armor": {
        "head": "Air",
        "chest": "Air",
        "legs": "Air",
        "feet": "Air"
      }
    },
     */
    const inventory = document.getElementById("inventory");
    inventory.innerHTML = ""; // Limpa o conteúdo anterior


    // Cabeça

    if (!player.EntityInfo.Inventory.armor.head.includes("Air")) {
      const helmet = document.createElement("img");
      helmet.alt = "Cabeca";
      helmet.className = "item";
      let existe = true;

      helmet.src = "../../assets/items/" + player.EntityInfo.Inventory.armor.head.replace("minecraft:", "") + ".png";
      helmet.onerror = function () {
        existe = false;
        helmet.style.display = "none";
      };

      if (existe) {
        inventory.appendChild(helmet);
      }
    }
    // Peitoral

    if (!player.EntityInfo.Inventory.armor.chest.includes("Air")) {
      const helmet = document.createElement("img");
      helmet.alt = "Peitoral";
      helmet.className = "item";
      let existe = true;

      helmet.src = "../../assets/items/" + player.EntityInfo.Inventory.armor.chest.replace("minecraft:", "") + ".png";
      helmet.onerror = function () {
        existe = false;
        helmet.style.display = "none";
      };

      if (existe) {
        inventory.appendChild(helmet);
      }
    }

    // Calças

    if (!player.EntityInfo.Inventory.armor.legs.includes("Air")) {
      const helmet = document.createElement("img");
      helmet.alt = "Calças";
      helmet.className = "item";
      let existe = true;

      helmet.src = "../../assets/items/" + player.EntityInfo.Inventory.armor.legs.replace("minecraft:", "") + ".png";
      helmet.onerror = function () {
        existe = false;
        helmet.style.display = "none";
      };

      if (existe) {
        inventory.appendChild(helmet);
      }
    }
    // Botas

    if (!player.EntityInfo.Inventory.armor.feet.includes("Air")) {
      const helmet = document.createElement("img");
      helmet.alt = "Botas";
      helmet.className = "item";
      let existe = true;

      helmet.src = "../../assets/items/" + player.EntityInfo.Inventory.armor.feet.replace("minecraft:", "") + ".png";
      helmet.onerror = function () {
        existe = false;
        helmet.style.display = "none";
      };

      if (existe) {
        inventory.appendChild(helmet);
      }
    }

    if (!player.EntityInfo.Inventory.heldItem.includes("Air")) {
      const heldItem = document.createElement("img");
      heldItem.alt = "Item segurado";
      heldItem.className = "item";
      let existe = true;

      heldItem.src = "../../assets/items/" + player.EntityInfo.Inventory.heldItem.replace("minecraft:", "") + ".png";
      heldItem.onerror = function () {
        existe = false;
        heldItem.style.display = "none";
      };

      if (existe) {

        inventory.appendChild(heldItem);
      }
    }
  } catch (error) {
    console.error("Erro ao carregar os players:", error);
  }
}




window.onload = () => {
  carregarPlayers();
  setInterval(carregarPlayers, 50);
};
function executeCommand(command) {
  if (command.split(" ").length == 1) {
    command += ' ' + player.EntityInfo.name; // Adiciona o nome do jogador se não estiver presente
  }
  fetch("http://localhost:6060/createCommands", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      command: command,
      executed: false
    })
  }).then(() => {
    input.value = "";
  }).catch(err => {
    console.error("Erro ao enviar comando:", err);
    input.value = "";
  });
}