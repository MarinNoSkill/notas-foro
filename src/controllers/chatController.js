require('dotenv').config();
const Groq = require('groq-sdk');
const fs = require('fs');
const groq = new Groq();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Carpeta para almacenar imágenes temporalmente

const chatWithAI = async (req, res) => {
  try {
    const { type } = req.body;
    let messages;

    if (type === 'text') {
      const userMessage = req.body.message;
      messages = [{ role: "user", content: userMessage }];
    } else if (type === 'image' && req.file) {
      // Leer la imagen y convertirla a Base64
      const imagePath = req.file.path;
      const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });

      messages = [
        { role: "user", content: "Analyze this image", image: imageBase64 }
      ];

      // Eliminar la imagen temporal después de la conversión
      fs.unlinkSync(imagePath);
    } else {
      return res.status(400).json({ error: 'Tipo de mensaje no soportado o archivo no proporcionado' });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages,
      model: "llama-3.2-11b-vision-preview",
      temperature: 1,
      max_tokens: 1024,
      top_p: 1,
      stream: false
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || 'No se recibió respuesta de la IA';
    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error en la API:', error);
    res.status(500).json({ error: 'Hubo un problema al procesar la solicitud' });
  }
};

module.exports = { chatWithAI, upload };
