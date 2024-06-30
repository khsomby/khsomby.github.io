async function sendQuery() {
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

  try {
    const queryContent = userQuery;
    const response = await fetch(
      'https://smoby-ai-bot.onrender.com/chat?content=' + encodeURIComponent(queryContent));
    
    const jsonResponse = await response.data;

    chatWindow.removeChild(botMessage);

    const botResponse = document.createElement('div');
    botResponse.className = 'message bot';
    botResponse.textContent = jsonResponse.answer;
    chatWindow.appendChild(botResponse);
  } catch (error) {
    chatWindow.removeChild(botMessage);
    const errorMessage = document.createElement('div');
    errorMessage.className = 'message bot';
    errorMessage.textContent = 'Error fetching response: ' + error.message;
    chatWindow.appendChild(errorMessage);
  }

  chatWindow.scrollTop = chatWindow.scrollHeight;
}
