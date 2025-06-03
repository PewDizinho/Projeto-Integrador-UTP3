document.addEventListener('DOMContentLoaded', () => {

    fetch('http://127.0.0.1:6060/players')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
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
        .catch(error => {
            console.error('Fetch error:', error);
        });

    const modal = document.getElementById('modal-indisponivel');
    const fecharModal = document.getElementById('fechar-modal');

    const botoesComModal = [
        'btn-join',
        'btn-direct',
        'btn-add',
        'btn-edit',
        'btn-delete',
        'btn-refresh'
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

    const element = document.getElementsByTagName("main")[0]
    element.addEventListener("click", (ev) => {
       element.classList.toggle("selected");

    });
});