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
    const response = await fetch("http://localhost:6060/players");
    const players = await response.json();

    const container = document.getElementById("lista-players");

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

      // Garante que EntityInfo tenha os campos esperados
      player.EntityInfo = {
        id: entity.id ?? "Desconhecido",
        name: entity.name ?? "Sem nome",
        health: entity.health ?? 0,
        maxHealth: entity.maxHealth ?? 20,
        isAlive: entity.isAlive ?? false,
        age: entity.age ?? 0,
        lastAttacker: entity.lastAttacker ?? "Nenhum",
        lookingAt: entity.lookingAt ?? "?"
      };

      const nome = player.EntityInfo.name;

      const div = document.createElement("div");
      div.className = "player-card";
      div.innerHTML = `
        <img src="https://mc-heads.net/avatar/${nome}" alt="" class="player-icon" />
        <span class="player-name">${nome}</span>
      `;

      div.addEventListener("click", () => {
        mostrarModal(player);
      });

      container.appendChild(div);
    });
  } catch (error) {
    console.error("Erro ao carregar os players:", error);
  }
}

function mostrarModal(player) {
  const entity = player.EntityInfo || {};
  const info = player.PlayerInfo || {};
  const inv = player.Inventory || {};
  const pos = player.Position || {};
  const dim = player.Dimension || 'Desconhecida';

  const isAir = (item) =>
    !item || item.toLowerCase() === 'air' || item.toLowerCase() === 'minecraft:air';

  const formatItemName = (item) =>
    isAir(item) ? 'Não utilizada' : item.replace('minecraft:', '');

  document.getElementById('player-skin-image').src = `https://mc-heads.net/body/${entity.name}`;
  document.getElementById('player-id').textContent = `Id do Jogador: ${entity.id}`;
  document.getElementById('player-nickname').textContent = `Nickname: ${entity.name}`;
  document.getElementById('player-life').textContent = `Vida: ${entity.health}/${entity.maxHealth}`;
  document.getElementById('player-isalive').textContent = `Vivo: ${entity.isAlive ? 'Sim' : 'Não'}`;
  document.getElementById('player-age').textContent = `Dias no servidor: ${Math.floor(entity.age / 24000)}`;
  document.getElementById('player-lastattacker').textContent = `Último agressor: ${entity.lastAttacker || 'Nenhum'}`;
  document.getElementById('player-lookingat').textContent = `Olhando para: ${entity.lookingAt || '?'}`;
  document.getElementById('player-hunger').textContent = `Fome: ${info.hunger}/20`;
  document.getElementById('player-experience').textContent = `Nível de experiência: ${info.exp}`;
  document.getElementById('player-gamemode').textContent = `Gamemode: ${info.gamemode}`;
  document.getElementById('player-screen-size').textContent = `Resolução: ${info.screenSize || 'Desconhecida'}`;

  const armor = inv.armor || {};
  const parts = {
    head: 'Capacete',
    chest: 'Peitoral',
    legs: 'Calça',
    feet: 'Botas',
  };

  const armorHtml = [];

  for (const part in parts) {
    const rawItem = armor[part];
    const name = formatItemName(rawItem);
    armorHtml.push(
      isAir(rawItem)
        ? `<div>${parts[part]}: ${name}</div>`
        : `<div style="display: flex; align-items: center; gap: 8px;">
         ${parts[part]}:
         <img src="../../assets/items/${name}.png" alt="${name}" width="30" height="30" style="vertical-align: middle;">
       </div>`
    );

  }

  document.getElementById('player-armor').innerHTML = armorHtml.join('');
  const posX = pos.x ?? '?';
  const posY = pos.y ?? '?';
  const posZ = pos.z ?? '?';
  document.getElementById('player-position').innerHTML = `
  <div>Posição no Mapa:</div>
  <div style="margin-left: 14px;">X: ${posX}</div>
  <div style="margin-left: 14px;">Y: ${posY}</div>
  <div style="margin-left: 14px;">Z: ${posZ}</div>
`;

  document.getElementById('player-dimension').textContent = `Dimensão: ${dim}`;

  document.getElementById('player-modal').classList.remove('hidden');
}

function fecharModal() {
  document.getElementById('player-modal').classList.add('hidden');
}

window.onload = () => {
  carregarPlayers();
  setInterval(carregarPlayers, 5000);
};