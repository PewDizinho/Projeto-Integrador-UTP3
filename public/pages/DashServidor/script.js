function sendCommand() {
  if (document.getElementById("console-input").value.trim()) executeCommand(document.getElementById("console-input").value.trim());
}
function executeCommand(command) {
  fetch("http://localhost:6060/createCommands", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      command: command,
      executed: false
    })
  }).then(() => {
    input.value = "";
  }).catch(err => {
    console.error("Erro ao enviar comando:", err);
    input.value = "";
  });
}


async function carregarServer() {
  try {
    const response = await fetch("http://localhost:6060/world");
    const world = await response.json();


    fetch("http://localhost:6060/playersQuantity")
      .then(response => response.json())
      .then(data => {
        document.getElementById("player-count").innerText = data.quantity || 0;
      })
      .catch(() => {
        document.getElementById("player-count").innerText = "Erro";
      });

    let seconds = Math.floor(world.time / 20);
    let displayTime = "";
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      displayTime = `${hours}h ${minutes}m ${secs}s`;
    } else if (seconds >= 60) {
      const minutes = Math.floor(seconds / 60);
      const secs = seconds % 60;
      displayTime = `${minutes}m ${secs}s`;
    } else {
      displayTime = `${seconds}s`;
    }
    document.getElementById("server-time").innerText = displayTime || "Desconhecido";
    // Dummy values for roleplay: generate random usage percentages
    const armazenamento = Math.floor(Math.random() * 41) + 60; // 60% - 100%
    const ram = Math.floor(Math.random() * 41) + 60; // 60% - 100%
    const cpu = Math.floor(Math.random() * 41) + 60; // 60% - 100%

    document.getElementById("server-armazenamento").innerText = armazenamento + "%";
    document.getElementById("server-ram").innerText = ram + "%";
    document.getElementById("server-cpu").innerText = cpu + "%";
  } catch (error) {
    console.error("Erro ao carregar os players:", error);
  }
}
async function carregarChat() {
  try {
    const response = await fetch("http://localhost:6060/chat");
    const chatMessages = await response.json();

    const chatContainer = document.getElementById("chat");
    chatContainer.innerHTML = ""; // Limpa mensagens anteriores

    chatMessages.forEach(message => {
      const messageElement = document.createElement("div");
      messageElement.className = "chat-message";

      const playerSpan = document.createElement("span");
      playerSpan.className = "chat-player";
      // Exibe o nome do jogador corretamente
      playerSpan.textContent = `[${message.player && message.player.name ? message.player.name : "Desconhecido"}] `;

      // Limit the number of displayed messages
      const MAX_CHAT_MESSAGES = 10; // Change this value to customize the limit
      const startIdx = Math.max(0, chatMessages.length - MAX_CHAT_MESSAGES);
      const visibleMessages = chatMessages.slice(startIdx);

      // Only render messages if this is the first message in the visibleMessages array
      if (chatMessages.indexOf(message) === startIdx) {
        chatContainer.innerHTML = ""; // Limpa mensagens anteriores
        visibleMessages.forEach(msg => {
          const msgElement = document.createElement("div");
          msgElement.className = "chat-message";

          const playerSpan = document.createElement("span");
          playerSpan.className = "chat-player";
          playerSpan.textContent = `[${msg.player && msg.player.name ? msg.player.name : "Desconhecido"}] `;

          const textSpan = document.createElement("span");
          textSpan.className = "chat-text";
          textSpan.textContent = msg.Message;

          msgElement.appendChild(playerSpan);
          msgElement.appendChild(textSpan);

          chatContainer.appendChild(msgElement);
        });
      }

    });
  } catch (error) {
    console.error("Erro ao carregar o chat:", error);
  }
}

window.onload = () => {
  carregarServer();
  setInterval(carregarServer, 500);
  carregarChat();
  setInterval(carregarChat, 500);
};