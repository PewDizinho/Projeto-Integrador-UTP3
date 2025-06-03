async function carregarPlayers() {
<<<<<<< HEAD
  try {
    const response = await fetch("http://192.168.1.15:6060/players");
=======

    const response = await fetch("http://localhost:6060/players");
>>>>>>> upstream/main
    const players = await response.json();

    const container = document.getElementById("lista-players");
    container.innerHTML = ""; // limpa os anteriores
<<<<<<< HEAD

=======
>>>>>>> upstream/main
    document.getElementById("player-count").textContent = `${players.length} players`;

    players.forEach(player => {
      const nome = player.EntityInfo?.name || "Sem nome";

      const div = document.createElement("div");
      div.className = "player-card";

      div.innerHTML = `
<<<<<<< HEAD
        <img src="../../assets/skins/${nome}.png" alt="${nome}" onerror="this.src='../../assets/skins/default.png'" />
        <span>${nome}</span>`
=======
        <img src="https://mc-heads.net/avatar/${nome}" alt="" class="player-icon" />
        <span class="player-name">${nome}</span>`
>>>>>>> upstream/main
      ;

      container.appendChild(div);
    });
<<<<<<< HEAD
  } catch (error) {
    console.error("Erro ao buscar players:", error);
  }
}

// Inicia o carregamento ao abrir a página e atualiza a cada 5s
window.onload = carregarPlayers;
=======

}

// Inicia o carregamento ao abrir a página e atualiza a cada 5s
//TODO: acha um outro jeito de fazer isso aq em baixo pfv ~ Paulo
window.onload = carregarPlayers();
>>>>>>> upstream/main
setInterval(carregarPlayers, 5000);