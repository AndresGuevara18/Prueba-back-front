// backend-node/src/routes/asistenciaRoutes.js
const express = require('express');
const router = express.Router();
const asistenciaController = require('../controllers/asistenciaController');
const auth = require('../middleware/auth');

// Ruta protegida: asistencia del usuario autenticado
router.get('/mia', auth, asistenciaController.getAsistenciaUsuario);

module.exports = router;
