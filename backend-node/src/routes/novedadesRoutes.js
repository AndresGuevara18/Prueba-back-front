const express = require('express');
const novedadesController = require('../controllers/novedadesController');
// const { query } = require('express-validator');

const router = express.Router();

/**
 * @swagger
 * /api/novedades:
 *   get:
 *     summary: Obtiene un listado de todas las novedades (entradas tarde y salidas tempranas).
 *     tags: [Novedades]
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Término de búsqueda para filtrar por nombre, apellido o cargo del usuario.
 *       - in: query
 *         name: selectedPeriod
 *         schema:
 *           type: string
 *           enum: [today, yesterday, week, month]
 *         description: Periodo de tiempo para filtrar las novedades.
 *     responses:
 *       200:
 *         description: Listado de novedades obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   tipo_novedad:
 *                     type: string
 *                     example: entrada_tarde
 *                   id_novedad:
 *                     type: integer
 *                     example: 1
 *                   nombre_usuario:
 *                     type: string
 *                     example: John
 *                   apellido_usuario:
 *                     type: string
 *                     example: Doe
 *                   fecha_hora_evento:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-05-30T08:15:00.000Z"
 *                   minutos_tarde:
 *                     type: integer
 *                     nullable: true
 *                     example: 15
 *                   minutos_temprano:
 *                     type: integer
 *                     nullable: true
 *                     example: 10
 *                   cargo_usuario:
 *                     type: string
 *                     example: Desarrollador
 *       500:
 *         description: Error del servidor.
 */
router.get('/', novedadesController.getNovedades);

module.exports = router;
