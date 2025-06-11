async function carregarPlayers() {

  try {
    fetch("http://localhost:6060/playersQuantity")
      .then(response => response.json())
      .then(data => {


        document.getElementById("player-count").innerText = data.quantity || 0;
      })
      .catch(() => {
        document.getElementById("player-count").innerText = "Erro";
      });
    const response = await fetch("http://localhost:6060/npcs");
    const players = await response.json();

    const container = document.getElementById("lista-players");
    container.innerHTML = "";
    players.forEach(player => {
      const entity = player.EntityInfo || {};

      // Corrige estrutura mal formatada
      if (entity.PlayerInfo && !player.PlayerInfo) {
        player.PlayerInfo = entity.PlayerInfo;
      }

      if (entity.Inventory && !player.Inventory) {
        player.Inventory = {
          itemInHand: entity.Inventory.heldItem ?? "minecraft:air",
          armor: entity.Inventory.armor ?? {}
        };
      }

      if (entity.position && !player.Position) {
        player.Position = {
          x: entity.position.x,
          y: entity.position.y,
          z: entity.position.z
        };
        player.Dimension = entity.position.dimension ?? "Desconhecida";
      }



      const nome = player.EntityInfo.name;

      const div = document.createElement("div");

      div.innerHTML = `
      <div>
        <img src="https://mc-heads.net/avatar/${nome}" alt="" class="player-icon" />
        <span class="player-name">${nome}</span>
        <div style="margin-left: 10px"></div>
       <div id="heart"></div>
       </div>
      
      `;

      div.addEventListener("click", () => {
        location.href = `../DashNPC/index.html?player=${nome}`;
      });
      for (var i = 0; i < player.EntityInfo.health / 2; i++) {
        console.log(player.EntityInfo.health);
        const heart = document.createElement("img");
        heart.src = "../../assets/heart.png";
        heart.alt = "Coração";
        heart.className = "heart";
        div.querySelector("#heart").appendChild(heart);
      }
      if (player.EntityInfo.health % 2 === 1) {
        const halfHeart = document.createElement("img");
        halfHeart.src = "../../assets/half-heart.png";
        halfHeart.alt = "Meio coração";
        halfHeart.className = "heart";
        div.querySelector("#heart").appendChild(halfHeart);
      }
      const missingHearts = Math.floor((player.EntityInfo.maxHealth - player.EntityInfo.health) / 2);
      for (let i = 0; i < missingHearts; i++) {
        const brokenHeart = document.createElement("img");
        brokenHeart.src = "../../assets/broken-heart.png";
        brokenHeart.alt = "Coração partido";
        brokenHeart.className = "heart";
        div.querySelector("#heart").appendChild(brokenHeart);
      }
      if (!player.EntityInfo.isAlive) {
        div.className = "player-card offline";
      } else {
        div.className = "player-card";
        container.prepend(div);
        return;
      }
      container.appendChild(div);
    });
  } catch (error) {
    console.error("Erro ao carregar os players:", error);
  }
}




window.onload = () => {
  carregarPlayers();
  setInterval(carregarPlayers, 500);
};
function executeCommand(command) {
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