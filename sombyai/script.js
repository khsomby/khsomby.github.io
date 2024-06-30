function sendQuery() {
  const userQuery = document.getElementById('userQuery').value;
  const chatWindow = document.getElementById('chatWindow');

  const userMessage = document.createElement('div');
  userMessage.className = 'message user';
  userMessage.textContent = userQuery;
  chatWindow.appendChild(userMessage);

  document.getElementById('userQuery').value = '';

  const botMessage = document.createElement('div');
  botMessage.className = 'message bot';
  botMessage.textContent = 'Miandry kely...';
  chatWindow.appendChild(botMessage);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  const queryContent = userQuery;
  fetch('https://smoby-ai-bot.onrender.com/chat?content=' + encodeURIComponent(queryContent))
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(jsonResponse => {
      chatWindow.removeChild(botMessage);

      const botResponse = document.createElement('div');
      botResponse.className = 'message bot';
      botResponse.textContent = jsonResponse.answer || "No answer found in the response.";
      chatWindow.appendChild(botResponse);
    })
    .catch(error => {
      chatWindow.removeChild(botMessage);

      const errorMessage = document.createElement('div');
      errorMessage.className = 'message bot';
      errorMessage.textContent = 'Error: ' + error.message;
      chatWindow.appendChild(errorMessage);
      console.error('Fetch error:', error);
    });

  chatWindow.scrollTop = chatWindow.scrollHeight;
}
