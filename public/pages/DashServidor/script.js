async function carregarServer() {
  try {
    const response = await fetch("http://localhost:6060/world");
    const players = await response.json();


    fetch("http://localhost:6060/playersQuantity")
      .then(response => response.json())
      .then(data => {
        document.getElementById("player-count").innerText = data.quantity || 0;
      })
      .catch(() => {
        document.getElementById("player-count").innerText = "Erro";
      });
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