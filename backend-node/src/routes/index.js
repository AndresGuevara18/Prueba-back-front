const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const cargoRoutes = require('./cargoRoutes');
const horarioRoutes = require('./horarioRoutes');
const novedadRoutes = require('./novedadRoutes');
//const reconocimientoRoutes = require('./reconocimientoRoutes');
const reporteRoutes = require('./reporteRoutes');
const authRoutes = require('./authRoutes');

router.use('/usuarios', userRoutes);
router.use('/cargos', cargoRoutes);
router.use('/horarios', horarioRoutes);
router.use('/novedades', novedadRoutes);
//router.use('/reconocimiento', reconocimientoRoutes);
router.use('/reportes', reporteRoutes);
router.use('/auth', authRoutes);

module.exports = router;