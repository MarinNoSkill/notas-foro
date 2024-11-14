require('dotenv').config();
const fetch = require('node-fetch');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const chatWithAI = async (req, res) => {
  try {
    const { type } = req.body;
    let messages;

    if (type === 'text') {
      const userMessage = req.body.message;
      messages = [{ role: "user", parts: [{ text: userMessage }] }];
    } else if (type === 'image' && req.file) {
      const imagePath = req.file.path;
      const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

      messages = [
        { role: "user", parts: [{ text: "Analyze this image", image: imageBase64 }] }
      ];

      fs.unlinkSync(imagePath);
    } else {
      return res.status(400).json({ error: 'Tipo de mensaje no soportado o archivo no proporcionado' });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${process.env.API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: messages
      })
    });

    const data = await response.json();
    const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No se recibió respuesta válida de la IA';

    // Suponiendo que tienes una ruta para un avatar de la IA
    const aiAvatar = '/images/ai-avatar.png'; // Ruta al avatar de la IA

    res.json({ response: aiResponse, avatar: aiAvatar });

  } catch (error) {
    console.error('Error en la API:', error);
    res.status(500).json({ error: 'Hubo un problema al procesar la solicitud' });
  }
};


module.exports = { chatWithAI, upload };
