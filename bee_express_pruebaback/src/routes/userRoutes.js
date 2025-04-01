const express = require('express'); // Importar Express
const usuarioController = require('../controllers/userController');

const router = express.Router(); // 🚀 Definir el router antes de usarlo

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para gestionar usuarios
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     tags: [Usuarios]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 */
router.get('/', usuarioController.getAllUsers);

/**
 * @swagger
 * /api/usuarios/{numero_documento}:
 *   get:
 *     summary: Obtiene la información de un usuario por su número de documento
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: numero_documento
 *         required: true
 *         schema:
 *           type: string
 *         example: "12345678"
 *     responses:
 *       200:
 *         description: Información del usuario obtenida correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/:numero_documento', usuarioController.getUserByDocument);




/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crea un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez"
 *               email:
 *                 type: string
 *                 example: "juan@example.com"
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 */
router.post('/', usuarioController.createUser);

/**
 * @swagger
 * /api/usuarios/{id_usuario}:
 *   delete:
 *     summary: Elimina un usuario por su ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 */
router.delete('/:id_usuario', usuarioController.deleteUser);

module.exports = router; // Exportar el router
