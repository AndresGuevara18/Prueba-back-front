const express = require('express');
const router = express.Router();
const ReporteController = require('../controllers/reporteController');

// Rutas para los reportes

/**
 * @swagger
 * /api/reportes/asistencia:
 *   get:
 *     summary: Genera un reporte de asistencia.
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha de inicio del reporte (YYYY-MM-DD).
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha de fin del reporte (YYYY-MM-DD).
 *     responses:
 *       200:
 *         description: Reporte de asistencia generado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object # Define aquí la estructura de un item del reporte de asistencia
 *       400:
 *         description: Parámetros de fecha faltantes o inválidos.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/asistencia', ReporteController.generarReporteAsistencia);

/**
 * @swagger
 * /api/reportes/llegadas-tarde:
 *   get:
 *     summary: Genera un reporte de llegadas tarde.
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha de inicio del reporte (YYYY-MM-DD).
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha de fin del reporte (YYYY-MM-DD).
 *     responses:
 *       200:
 *         description: Reporte de llegadas tarde generado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object # Define aquí la estructura de un item del reporte de llegadas tarde
 *       400:
 *         description: Parámetros de fecha faltantes o inválidos.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/llegadas-tarde', ReporteController.generarReporteLlegadasTarde);

/**
 * @swagger
 * /api/reportes/salidas-temprano:
 *   get:
 *     summary: Genera un reporte de salidas temprano.
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha de inicio del reporte (YYYY-MM-DD).
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha de fin del reporte (YYYY-MM-DD).
 *     responses:
 *       200:
 *         description: Reporte de salidas temprano generado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object # Define aquí la estructura de un item del reporte de salidas temprano
 *       400:
 *         description: Parámetros de fecha faltantes o inválidos.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/salidas-temprano', ReporteController.generarReporteSalidasTemprano);

/**
 * @swagger
 * /api/reportes/ausencias:
 *   get:
 *     summary: Genera un reporte de ausencias.
 *     tags: [Reportes]
 *     parameters:
 *       - in: query
 *         name: fechaInicio
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha de inicio del reporte (YYYY-MM-DD).
 *       - in: query
 *         name: fechaFin
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Fecha de fin del reporte (YYYY-MM-DD).
 *     responses:
 *       200:
 *         description: Reporte de ausencias generado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object # Define aquí la estructura de un item del reporte de ausencias
 *       400:
 *         description: Parámetros de fecha faltantes o inválidos.
 *       500:
 *         description: Error interno del servidor.
 */
router.get('/ausencias', ReporteController.generarReporteAusencias);

module.exports = router;