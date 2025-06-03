// backend-node\src\routes\novedadRoutes.js
const express = require('express');
const NovedadController = require('../controllers/novedadController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Novedades
 *   description: API para la gestión de novedades de empleados (entradas tarde, salidas tempranas, inasistencias, etc.)
 */

/**
 * @swagger
 * /api/novedades:
 *   get:
 *     summary: Obtiene un listado consolidado de todas las novedades.
 *     tags: [Novedades]
 *     description: Retorna una lista de todas las novedades registradas, incluyendo entradas, salidas, entradas tarde, salidas tempranas e inasistencias, ordenadas por fecha y hora descendente.
 *     responses:
 *       200:
 *         description: Listado de novedades obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Novedad'
 *       404:
 *         description: No se encontraron novedades.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No se encontraron novedades.
 *       500:
 *         description: Error del servidor al intentar obtener las novedades.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error al obtener las novedades
 *                 error:
 *                   type: string
 *                   example: Detalle del error.
 */
router.get('/', NovedadController.getAllNovedades);

module.exports = router;