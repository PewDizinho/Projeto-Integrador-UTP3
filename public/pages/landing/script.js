document.addEventListener('DOMContentLoaded', () => {
 
    fetch('http://127.0.0.1:6060/players') /* Busca players via API */
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => { /* Exibir os jogadores */
            for (let player of data) {
                console.log(player.EntityInfo.name)
                console.log(player)
                const card = document.createElement("div");
                card.className = "card";
                const name = document.createElement("h1");
                name.innerText = player.EntityInfo.name;
                card.appendChild(name)
                document.getElementById("playground").appendChild(card)
            }
        })
        .catch(error => { /* Tratamento de erros */
            console.error('Fetch error:', error);
        });
 
    const modal = document.getElementById('modal-indisponivel'); /* Modais de indisponibilidade */
    const fecharModal = document.getElementById('fechar-modal');
 
    const botoesComModal = [
        'btn-join',
        'btn-direct',
        'btn-add',
        'btn-edit',
        'btn-delete'
    ];
 
    botoesComModal.forEach(id => {
        const botao = document.getElementById(id);
        if (botao) {
            botao.addEventListener('click', () => {
                modal.classList.remove('hidden');
            });
        }
    });
 
    fecharModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
 
// Evento para o main do Minecraft (primeiro main)
    const minecraftMain = document.getElementsByTagName("main")[0];
    minecraftMain.addEventListener("click", () => {
        minecraftMain.classList.toggle("selected");
    });
 
// Evento para o main do Miku (supondo que tenha id="main-miku")
    const mikuMain = document.getElementById("main-miku");
    if (mikuMain) {
        mikuMain.addEventListener("click", () => {
            mikuMain.classList.toggle("selected");
        });
    }
});
 
// Modal de servidor cheio (Miku)
const modalCheio = document.getElementById('modal-servidor-cheio');
const fecharModalCheio = document.getElementById('fechar-modal-cheio');
 
// Adiciona o clique na imagem do Miku
const mikuIcon = document.querySelector('.server-miku-icon');
 
if (mikuIcon) {
    mikuIcon.addEventListener('click', () => {
        modalCheio.classList.remove('hidden');
    });
}
 
fecharModalCheio.addEventListener('click', () => {
    modalCheio.classList.add('hidden');
});
