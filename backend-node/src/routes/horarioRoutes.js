const express = require('express');
const horarioController = require('../controllers/horarioController'); // Importa el controlador de horarios

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Horarios
 *   description: Endpoints para gestionar horarios laborales
 */

/**
 * @swagger
 * /api/horarios:
 *   get:
 *     summary: Obtiene todos los horarios laborales
 *     tags: [Horarios]
 *     responses:
 *       200:
 *         description: Lista de horarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Horario'
 */
router.get('/', horarioController.getAllHorarios);

/**
 * @swagger
 * /api/horarios:
 *   post:
 *     summary: Crea un nuevo horario laboral
 *     tags: [Horarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HorarioInput'
 *     responses:
 *       201:
 *         description: Horario creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Horario'
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post('/', horarioController.createHorario);

/**
 * @swagger
 * /api/horarios/{id_horario}:
 *   put:
 *     summary: Actualiza un horario laboral existente
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: id_horario
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HorarioInput'
 *     responses:
 *       200:
 *         description: Horario actualizado correctamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Horario no encontrado
 */
router.put('/:id_horario', horarioController.updateHorario);

/**
 * @swagger
 * /api/horarios/{id_horario}:
 *   delete:
 *     summary: Elimina un horario laboral por su ID
 *     tags: [Horarios]
 *     parameters:
 *       - in: path
 *         name: id_horario
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Horario eliminado correctamente
 *       400:
 *         description: No se puede eliminar (tiene cargos asociados)
 *       404:
 *         description: Horario no encontrado
 */
router.delete('/:id_horario', horarioController.deleteHorario);

module.exports = router;