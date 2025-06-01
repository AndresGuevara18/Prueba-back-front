const express = require('express');
const userRoutes = require('./userRoutes');
const cargoRoutes = require('./cargoRoutes');
const reconocimientoRoutes = require('./reconocimientoRoutes');
const novedadesRoutes = require('./novedadesRoutes'); // Importar rutas de novedades

const router = express.Router();

router.use('/usuarios', userRoutes);
router.use('/cargos', cargoRoutes);
router.use('/reconocimientos', reconocimientoRoutes);
router.use('/novedades', novedadesRoutes); // Usar rutas de novedades

module.exports = router;