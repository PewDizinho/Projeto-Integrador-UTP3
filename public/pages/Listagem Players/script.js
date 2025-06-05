async function carregarPlayers() {

    const response = await fetch("http://localhost:6060/players");
    const players = await response.json();

    const container = document.getElementById("lista-players");
    container.innerHTML = ""; // limpa os anteriores
    document.getElementById("player-count").textContent = `${players.length} players`;

    players.forEach(player => {
      const nome = player.EntityInfo?.name || "Sem nome";

      const div = document.createElement("div");
      div.className = "player-card";

      div.innerHTML = `
        <img src="https://mc-heads.net/avatar/${nome}" alt="" class="player-icon" />
        <span class="player-name">${nome}</span>`
      ;

      container.appendChild(div);
    });

}

// Inicia o carregamento ao abrir a página e atualiza a cada 5s
//TODO: acha um outro jeito de fazer isso aq em baixo pfv ~ Paulo
window.onload = carregarPlayers();
setInterval(carregarPlayers, 5000);