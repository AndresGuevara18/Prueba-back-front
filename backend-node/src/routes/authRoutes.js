const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: Endpoints para autenticación de usuarios
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioadmin:
 *                 type: string
 *                 example: admin
 *               contrasenia:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id_usuario:
 *                       type: integer
 *                     usuarioadmin:
 *                       type: string
 *                     id_cargo:
 *                       type: integer
 *                     nombre_empleado:
 *                       type: string
 *       400:
 *         description: Usuario y contraseña son requeridos
 *       401:
 *         description: Usuario o contraseña incorrectos
 *       500:
 *         description: Error interno en login
 */

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario obtenido correctamente
 *       401:
 *         description: No autorizado (token faltante o inválido)
 *       500:
 *         description: Error interno del servidor
 */

// Login
router.post('/login', authController.login);

// Obtener perfil del usuario autenticado
router.get('/profile', auth, authController.getProfile);

module.exports = router;
