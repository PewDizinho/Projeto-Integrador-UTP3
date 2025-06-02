async function carregarNPCs() {

    const response = await fetch("http://localhost:6060/npcs");
    const npcs = await response.json();

    const container = document.getElementById("lista-Npc");
    container.innerHTML = ""; // limpa os anteriores
    document.getElementById("player-count").textContent = `${npcs.length} NPCs`;  // Aqui a troca

    npcs.forEach(npc => {
      const nome = npc.EntityInfo?.name || "Sem nome";

      const div = document.createElement("div");
      div.className = "Npc-card";

      div.innerHTML = `
        <img src="https://mc-heads.net/avatar/${nome}" alt="" class="Npc-icon" />
        <span class="Npc-name">${nome}</span>`;
      
      container.appendChild(div);
    });

}

window.onload = carregarNPCs();
setInterval(carregarNPCs, 5000);
