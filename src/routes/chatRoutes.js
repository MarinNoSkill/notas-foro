const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Ruta para enviar texto o imagen
router.post('/chat', chatController.upload.single('image'), chatController.chatWithAI);

module.exports = router;
