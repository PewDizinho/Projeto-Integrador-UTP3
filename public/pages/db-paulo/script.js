document.addEventListener('DOMContentLoaded', () => {
  fetch('/public/db/Player/78b73c74-ac3f-4ac4-a425-14482d4e3d6d.json')
    .then(response => response.json())
    .then(data => {
      const player = data.EntityInfo;

      // Função para verificar se item é "Air"
      const isAir = (item) =>
        !item || item.toLowerCase() === 'air' || item.toLowerCase() === 'minecraft:air';

      const formatItemName = (item) =>
        isAir(item) ? 'Não utilizada' : item.replace('minecraft:', '');

      // Preenche dados principais
      document.getElementById('player-id').textContent = `Id: ${player.id}`;
      document.getElementById('player-nickname').textContent = `Nickname: ${player.name}`;
      document.getElementById('player-life').textContent = `Vida: ${player.health}/${player.maxHealth}`;
      document.getElementById('player-isalive').textContent = `Vivo: ${player.isAlive ? 'Sim' : 'Não'}`;
      document.getElementById('player-age').textContent = `Dias no servidor: ${Math.floor(player.age / 24000)}`;
      document.getElementById('player-lastattacker').textContent = `Último agressor: ${player.lastAttacker || 'Nenhum'}`;
      document.getElementById('player-lookingat').textContent = `Olhando para: ${player.lookingAt}`;
      document.getElementById('player-hunger').textContent = `Fome: ${player.PlayerInfo.hunger}/20`;
      document.getElementById('player-experience').textContent = `Nível de experiência: ${player.PlayerInfo.exp}`;
      document.getElementById('player-gamemode').textContent = `Gamemode: ${player.PlayerInfo.gamemode}`;
      document.getElementById('player-screen-size').textContent = `Resolução: ${player.PlayerInfo.screenSize}`;

      // ITEM NA MÃO
      const itemInHand = player.Inventory?.itemInHand || 'minecraft:air';
      const itemName = formatItemName(itemInHand);
      if (itemName === 'Não utilizada') {
        document.getElementById('player-item').textContent = `Item: ${itemName}`;
      } else {
        document.getElementById('player-item').innerHTML =
          `Item: <img src="/public/assets/items/${itemName}.png" alt="${itemName}" width="40" height="40">`;
      }

      // ARMADURA
      const armor = player.Inventory?.armor || {};
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
        if (name === 'Não utilizada') {
          armorHtml.push(`<div>${parts[part]}: ${name}</div>`);
        } else {
          armorHtml.push(
            `<div>${parts[part]}: <img src="/public/assets/items/${name}.png" alt="${name}" width="40" height="40"></div>`
          );
        }
      }

      document.getElementById('player-armor').innerHTML = armorHtml.join('');

    })
    .catch(error => console.error('Erro ao carregar JSON:', error));
});
