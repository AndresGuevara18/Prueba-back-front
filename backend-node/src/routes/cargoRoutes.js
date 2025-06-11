const express = require('express'); // Importa Express
const cargoController = require('../controllers/cargoController'); // Importa el controlador de Cargo

const router = express.Router(); // Crea un enrutador con Express.Router()

/**
 * @swagger
 * tags:
 *   name: Cargos
 *   description: Endpoints para gestionar los cargos
 */

/**
 * @swagger
 * /api/cargos:
 *   get:
 *     summary: Obtiene todos los cargos
 *     tags: [Cargos]
 *     responses:
 *       200:
 *         description: Lista de cargos obtenida correctamente
 */
router.get('/', cargoController.getAllCargos);

/**
 * @swagger
 * /api/cargos:
 *   post:
 *     summary: Crea un nuevo cargo
 *     tags: [Cargos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_cargo
 *               - id_horario
 *             properties:
 *               nombre_cargo:
 *                 type: string
 *                 description: Nombre del cargo a crear
 *                 example: "Gerente"
 *               descripcion:
 *                 type: string
 *                 description: Descripción del cargo (opcional)
 *                 example: "Gerente de operaciones"
 *               id_horario:
 *                 type: integer
 *                 description: ID del horario asociado
 *                 example: 2
 *     responses:
 *       201:
 *         description: Cargo creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_cargo:
 *                   type: integer
 *                   example: 1
 *                 nombre_cargo:
 *                   type: string
 *                   example: "Gerente"
 *                 descripcion:
 *                   type: string
 *                   example: "Gerente de operaciones"
 *                 id_horario:
 *                   type: integer
 *                   example: 2
 */
router.post('/', cargoController.createCargo);

/**
 * @swagger
 * /api/cargos/{id_cargo}:
 *   get:
 *     summary: Obtiene un cargo por su ID
 *     tags: [Cargos]
 *     parameters:
 *       - in: path
 *         name: id_cargo
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Información del cargo obtenida correctamente
 */
router.get('/:id_cargo', cargoController.getCargoById);

/**
 * @swagger
 * /api/cargos/{id_cargo}:
 *   put:
 *     summary: Actualiza un cargo existente
 *     tags: [Cargos]
 *     parameters:
 *       - in: path
 *         name: id_cargo
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_cargo
 *               - id_horario
 *             properties:
 *               nombre_cargo:
 *                 type: string
 *                 description: Nuevo nombre del cargo
 *                 example: "Director"
 *               descripcion:
 *                 type: string
 *                 description: Nueva descripción del cargo (opcional)
 *                 example: "Director de proyectos"
 *               id_horario:
 *                 type: integer
 *                 description: Nuevo ID de horario asociado
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cargo actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_cargo:
 *                   type: integer
 *                   example: 1
 *                 nombre_cargo:
 *                   type: string
 *                   example: "Director"
 *                 descripcion:
 *                   type: string
 *                   example: "Director de proyectos"
 *                 id_horario:
 *                   type: integer
 *                   example: 3
 */
router.put('/:id_cargo', cargoController.updateCargo);

/**
 * @swagger
 * /api/cargos/{id_cargo}:
 *   delete:
 *     summary: Elimina un cargo por su ID
 *     tags: [Cargos]
 *     parameters:
 *       - in: path
 *         name: id_cargo
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Cargo eliminado correctamente
 */
router.delete('/:id_cargo', cargoController.deleteCargo);

// Exporta el enrutador para ser usado en otros archivos
module.exports = router;
