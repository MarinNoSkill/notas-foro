// Seleccionamos todos los elementos con el id 'signUp' y 'signIn'
const signUpButtons = document.querySelectorAll('#signUp');
const signInButtons = document.querySelectorAll('#signIn');
const container = document.getElementById('container');

// Agregamos el evento a todos los elementos con id 'signUp' para mostrar el panel de registro
signUpButtons.forEach(button => {
    button.addEventListener('click', () => {
        container.classList.add("right-panel-active");
    });
});

// Agregamos el evento a todos los elementos con id 'signIn' para mostrar el panel de inicio de sesión
signInButtons.forEach(button => {
    button.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
    });
});

// Seleccionar los elementos del DOM
const userMessageInput = document.getElementById('userMessage');
const fileInput = document.getElementById('fileInput');
const messagesDiv = document.getElementById('messages');

// Función para mostrar mensajes en el chatbox
function displayMessage(role, content) {
  const messageElement = document.createElement('div');
  messageElement.className = role;
  messageElement.innerText = content;
  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Función para enviar mensajes de texto
async function sendMessage() {
  const userMessage = userMessageInput.value;
  if (!userMessage) return;

  displayMessage('user', userMessage); // Muestra el mensaje del usuario
  userMessageInput.value = ''; // Limpia el input

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: 'text',
        message: userMessage
      })
    });

    const data = await response.json();
    displayMessage('ai', data.response || 'Sin respuesta de la IA');
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    displayMessage('error', 'Hubo un problema al enviar el mensaje.');
  }
}

// Función para enviar imágenes
async function sendImage() {
  const file = fileInput.files[0];
  if (!file) return;

  displayMessage('user', 'Enviando imagen...');

  const formData = new FormData();
  formData.append('type', 'image');
  formData.append('file', file);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    displayMessage('ai', data.response || 'Sin respuesta de la IA');
  } catch (error) {
    console.error('Error al enviar la imagen:', error);
    displayMessage('error', 'Hubo un problema al enviar la imagen.');
  }
}
