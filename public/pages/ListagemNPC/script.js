async function carregarNPCs() {

  const response = await fetch("http://localhost:6060/npcs");
  const npcs = await response.json();

  const container = document.getElementById("lista-Npc");

  npcs.forEach(npc => {
    const nome = npc.EntityInfo?.name || "Sem nome";

    const div = document.createElement("div");
    div.className = "Npc-card";

    div.innerHTML = `
  <img src="https://mc-heads.net/avatar/${nome}" alt="" class="Npc-icon" onclick="window.location.href='../DashNPC/index.html'" />
  <span class="Npc-name">${nome}</span>`;


    container.appendChild(div);
  });

  fetch("http://localhost:6060/playersQuantity")
    .then(response => response.json())
    .then(data => {
      document.getElementById("player-count").innerText = data.quantity || 0;
    })
    .catch(() => {
      document.getElementById("player-count").innerText = "Erro";
    });
}

window.onload = carregarNPCs();
setInterval(carregarNPCs, 5000);
