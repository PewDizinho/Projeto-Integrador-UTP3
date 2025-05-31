document.addEventListener('DOMContentLoaded', () => {

    // Mapeia os botões com seus respectivos links:
    const linksGitHub = {
        "Audrey Cristhiny": "https://github.com/Audrey2112",
        "Eduarda Horning": "https://github.com/eduardahor",
        "Gabriela Rocca": "https://github.com/GabRocca",
        "João Gabriel": "https://github.com/Blu-guy",
        "João Neto": "https://github.com/PirateCoder13",
        "José Otavio": "https://github.com/JoseOtavioCR",
        "Luiz Henrique": "https://github.com/lhzluiz",
        "Paulo Konopka": "https://github.com/PewDizinho"
    };

    // Pega todos os botões com a classe 'done'
    const botoes = document.querySelectorAll(".done");

    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            const nome = botao.innerText; // pega o texto do botão
            const link = linksGitHub[nome];
            if (link) {
                window.open(link, "_blank");
            } else {
                alert("Link do GitHub não encontrado para " + nome);
            }
        });
    });

});


function toggle(button) {
  if (button.textContent.includes("ON")) {
    button.textContent = button.textContent.replace("ON", "OFF");
  } else {
    button.textContent = button.textContent.replace("OFF", "ON");
  }
}

function toggleHand(button) {
  if (button.textContent.includes("Right")) {
    button.textContent = "Main Hand: Left";
  } else {
    button.textContent = "Main Hand: Right";
  }
}


