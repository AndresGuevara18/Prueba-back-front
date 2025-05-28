const express = require('express'); // Importamos Express
const reconocimientoController = require('../controllers/reconocimientoController'); // Importamos el controlador

const router = express.Router(); // ✅ Definir el router antes de usarlo

// Ruta para registrar el usuario en reconocimiento_facial (sin imagen)
router.post('/reconocimiento', reconocimientoController.createReconocimiento);

module.exports = router; // Exportamos el router para usarlo en `app.js`
