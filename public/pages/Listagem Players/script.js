async function carregarPlayers() {
  try {
    const response = await fetch("http://192.168.1.15:6060/players");
    const players = await response.json();

    const container = document.getElementById("lista-players");
    container.innerHTML = ""; // limpa os anteriores

    document.getElementById("player-count").textContent = `${players.length} players`;

    players.forEach(player => {
      const nome = player.EntityInfo?.name || "Sem nome";

      const div = document.createElement("div");
      div.className = "player-card";

      div.innerHTML = `
        <img src="../../assets/skins/${nome}.png" alt="${nome}" onerror="this.src='../../assets/skins/default.png'" />
        <span>${nome}</span>`
      ;

      container.appendChild(div);
    });
  } catch (error) {
    console.error("Erro ao buscar players:", error);
  }
}

// Inicia o carregamento ao abrir a página e atualiza a cada 5s
window.onload = carregarPlayers;
setInterval(carregarPlayers, 5000);