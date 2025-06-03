document.addEventListener('DOMContentLoaded', () => {
    // URLs para buscar os dados do seu servidor Node.js
    const serverApiUrl = "http://192.168.1.105:6060/data/server";
    const playersApiUrl = "http://192.168.1.105:6060/data/players";
    const npcsApiUrl = "http://192.168.1.105:6060/data/npcs";

    // Função para buscar e renderizar as informações do servidor
    async function fetchAndRenderServerInfo() {
        try {
            const response = await fetch(serverApiUrl);
            const data = await response.json();
            document.getElementById('server-name').textContent = data.name;
            document.getElementById('server-description').textContent = data.description;
            document.getElementById('server-status').textContent = data.status;
            document.getElementById('server-status').className = data.status === "Ligado" ? "status-online" : "status-offline";
            document.getElementById('player-count').textContent = data.playerCount;
            document.getElementById('server-ping').textContent = data.ping;
        } catch (error) {
            console.error("Erro ao buscar dados do servidor:", error);
            // Pode exibir uma mensagem de erro no dashboard
            document.getElementById('server-status').textContent = "Erro";
            document.getElementById('server-status').className = "status-offline";
        }
    }

    // Função para buscar e renderizar jogadores
    async function fetchAndRenderPlayers() {
        try {
            const response = await fetch(playersApiUrl);
            const playersData = await response.json();
            const playersList = document.getElementById('players-list');
            playersList.innerHTML = ''; // Limpa a lista antes de adicionar
            playersData.forEach(player => {
                const playerCard = document.createElement('div');
                playerCard.classList.add('card');
                // Adicione a classe 'player-card' para estilização específica
                playerCard.classList.add('player-card');

                // Renderiza a armadura
                const armorHtml = player.Inventory.armor ? `
                    <p><strong>Armadura:</strong></p>
                    <ul>
                        <li>Cabeça: ${player.Inventory.armor.head}</li>
                        <li>Peito: ${player.Inventory.armor.chest}</li>
                        <li>Pernas: ${player.Inventory.armor.legs}</li>
                        <li>Pés: ${player.Inventory.armor.feet}</li>
                    </ul>
                ` : '<p><strong>Armadura:</strong> Nenhuma</p>';


                playerCard.innerHTML = `
                    <h3>${player.name} (${player.id.substring(0, 8)}...)</h3>
                    <p><strong>Status:</strong> <span class="${player.isAlive ? 'status-online' : 'status-offline'}">${player.isAlive ? 'Vivo' : 'Morto'}</span></p>
                    <p><strong>Vida:</strong> ${player.health}/${player.maxHealth}</p>
                    <p><strong>Fome:</strong> ${player.PlayerInfo.hunger}</p>
                    <p><strong>Experiência:</strong> ${player.PlayerInfo.exp}</p>
                    <p><strong>Modo de Jogo:</strong> ${player.PlayerInfo.gamemode}</p>
                    <p><strong>Item Segurado:</strong> ${player.Inventory.heldItem}</p>
                    ${armorHtml}
                    <p><strong>Posição:</strong> X: ${player.position.x.toFixed(1)}, Y: ${player.position.y.toFixed(1)}, Z: ${player.position.z.toFixed(1)}</p>
                    <p><strong>Dimensão:</strong> ${player.position.dimension}</p>
                    ${player.lastAttacker !== "None" ? `<p><strong>Último Agressor:</strong> ${player.lastAttacker}</p>` : ''}
                    <p><strong>Olhando para:</strong> ${player.lookingAt}</p>
                `;
                playersList.appendChild(playerCard);
            });
        } catch (error) {
            console.error("Erro ao buscar dados dos jogadores:", error);
        }
    }

    // Função para buscar e renderizar NPCs
    async function fetchAndRenderNpcs() {
        try {
            const response = await fetch(npcsApiUrl);
            const npcsData = await response.json();
            const npcsList = document.getElementById('npcs-list');
            npcsList.innerHTML = ''; // Limpa a lista antes de adicionar
            npcsData.forEach(npc => {
                const npcCard = document.createElement('div');
                npcCard.classList.add('card');
                // Adicione a classe 'npc-card' para estilização específica
                npcCard.classList.add('npc-card');
                npcCard.innerHTML = `
                    <h3>${npc.name} (${npc.id.substring(0, 8)}...)</h3>
                    <p><strong>Status:</strong> <span class="${npc.isAlive ? 'status-online' : 'status-offline'}">${npc.isAlive ? 'Vivo' : 'Morto'}</span></p>
                    <p><strong>Vida:</strong> ${npc.health}/${npc.maxHealth}</p>
                    <p><strong>Posição:</strong> X: ${npc.position.x.toFixed(1)}, Y: ${npc.position.y.toFixed(1)}, Z: ${npc.position.z.toFixed(1)}</p>
                    <p><strong>Dimensão:</strong> ${npc.position.dimension}</p>
                    ${npc.lastAttacker !== "None" ? `<p><strong>Último Agressor:</strong> ${npc.lastAttacker}</p>` : ''}
                    <p><strong>Olhando para:</strong> ${npc.lookingAt}</p>
                `;
                npcsList.appendChild(npcCard);
            });
        } catch (error) {
            console.error("Erro ao buscar dados dos NPCs:", error);
        }
    }

    // Chama as funções para buscar e renderizar as informações iniciais
    fetchAndRenderServerInfo();
    fetchAndRenderPlayers();
    fetchAndRenderNpcs();

    // Atualiza os dados a cada 3 segundos (3000 milissegundos)
    // Você pode ajustar este intervalo conforme a necessidade de atualização e carga do servidor.
    setInterval(fetchAndRenderServerInfo, 3000);
    setInterval(fetchAndRenderPlayers, 3000);
    setInterval(fetchAndRenderNpcs, 3000);
});