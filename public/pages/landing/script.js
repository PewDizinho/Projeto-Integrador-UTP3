let clicking = 0;
document.addEventListener('DOMContentLoaded', () => {



    const card = document.getElementById("main-minecraft");

    card.addEventListener("click", () => {
        if (card.classList.contains("selected")) {
            if (new Date().getTime() - clicking < 500) {
                window.location.href = "../ListagemPlayers/index.html";
           
                return;
            }
                 card.class = "";
        }
        clicking = new Date().getTime();
        card.class = "selected";
    });


    const modal = document.getElementById('modal-indisponivel');
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
    document.getElementById("btn-join").addEventListener("click", () => {
        if (card.classList.contains("selected")) {
            window.location.href = "../ListagemPlayers/index.html";
        }
    });


    // Evento para o main do Minecraft (primeiro main)
    const minecraftMain = document.getElementsByTagName("main")[0];
    minecraftMain.addEventListener("click", () => {
        minecraftMain.classList.toggle("selected");
    });

});