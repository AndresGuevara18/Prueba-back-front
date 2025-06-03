// backend-node\src\routes\novedadRoutes.js
const express = require('express');
const NovedadController = require('../controllers/novedadController');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Novedad:
 *       type: object
 *       properties:
 *         id_usuario:
 *           type: integer
 *           description: ID único del usuario
 *           example: 1
 *         nombre_usuario:
 *           type: string
 *           description: Nombre del empleado
 *           example: "Juan Pérez"
 *         tipo_novedad:
 *           type: string
 *           description: Tipo de novedad registrada
 *           enum: ["Registro Entrada", "Entrada Tarde", "Registro Salida", "Salida Temprana", "Inasistencia"]
 *           example: "Entrada Tarde"
 *         fecha_hora:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la novedad
 *           example: "2024-03-15T08:15:00.000Z"
 *         detalle:
 *           type: string
 *           nullable: true
 *           description: Detalles adicionales de la novedad (comentarios, motivo, etc.)
 *           example: "Llegó 15 minutos tarde debido a tráfico"
 */

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
 *     parameters:
 *       - in: query
 *         name: filtro
 *         schema:
 *           type: string
 *         description: Filtra las novedades por periodo. Valores posibles 'hoy', 'ayer', 'esta_semana', 'este_mes'.
 *         required: false
 *     responses:
 *       200:
 *         description: Listado de novedades obtenido exitosamente. Puede ser un array vacío si no hay novedades.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Novedad'
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