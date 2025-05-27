async function carregarJogadores() {
  try {
    const res = await fetch("/players");
    const players = await res.json();
    const container = document.getElementById("players-container");
    const contador = document.getElementById("player-count");

    container.innerHTML = "";
    contador.textContent = `${players.length} players`;

    players.forEach(player => {
      const div = document.createElement("div");
      div.className = "player-card";
      div.innerHTML = `
        <img src="https://minotar.net/avatar/${player.EntityInfo.nome}" alt="avatar">
        <span>${player.EntityInfo.nome}</span>
      `;
      container.appendChild(div);
    });

    // busca
    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", () => {
      const filtro = searchInput.value.toLowerCase();
      const cards = container.querySelectorAll(".player-card");
      cards.forEach(card => {
        const nome = card.textContent.toLowerCase();
        card.style.display = nome.includes(filtro) ? "flex" : "none";
      });
    });
  } catch (error) {
    console.error("Erro ao carregar jogadores:", error);
  }
}

carregarJogadores();
