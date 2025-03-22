

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
                console.log(player)// Player
                //Pegar essa info do player e jogar dentro do html
                const card = document.createElement("div");//cria uma div
                card.className = "card"; //adiciona uma classe a div
                const name = document.createElement("h1"); //Cria um h1
                name.innerText = player.EntityInfo.name; //Adiciona o nome do player no texto, usar de referencia /public/db/Player/pew.json

                card.appendChild(name)//Adiciona o nome dentro da div
                document.getElementById("playground").appendChild(card)//adiciona a div (com o nome dentro) dentro da div que já ta no html do site /public/index.html
                //https://mc-heads.net/ <--- pegar cabeças de players
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
        });
})