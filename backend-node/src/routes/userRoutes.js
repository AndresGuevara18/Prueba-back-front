const express = require('express'); // Importar Express
const router = express.Router(); // 🚀 Definir el router antes de usarlo
const multer = require('multer'); // multer para manejo del blob //npm install multer
const usuarioController = require('../controllers/userController');
const auth = require('../middleware/auth');

// Configura multer para manejar multipart/form-data
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});


//OBTENER TODOS LOS USUARIOS
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
 *     summary: Crea un nuevo usuario (con foto opcional)
 *     tags: [Usuarios]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - tipo_documento
 *               - numero_documento
 *               - nombre_empleado
 *               - direccion_empleado
 *               - telefono_empleado
 *               - email_empleado
 *               - eps_empleado
 *               - contrasenia
 *               - id_cargo
 *             properties:
 *               tipo_documento:
 *                 type: string
 *                 example: "CC"
 *               numero_documento:
 *                 type: string
 *                 example: "1234567890"
 *               nombre_empleado:
 *                 type: string
 *                 example: "Juan Pérez"
 *               direccion_empleado:
 *                 type: string
 *                 example: "Calle 123 #45-67"
 *               telefono_empleado:
 *                 type: string
 *                 example: "3216549870"
 *               email_empleado:
 *                 type: string
 *                 example: "juan.perez@example.com"
 *               eps_empleado:
 *                 type: string
 *                 example: "Nueva EPS"
 *               usuarioadmin:
 *                 type: string
 *                 example: "jperez"
 *               contrasenia:
 *                 type: string
 *                 example: "miClaveSegura123"
 *               id_cargo:
 *                 type: integer
 *                 example: 2
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del usuario (opcional, máximo 5MB)
 *     responses:
 *       201:
 *         description: Usuario creado correctamente
 *       400:
 *         description: Error de validación (documento, email, usuario o cargo no válidos)
 *       500:
 *         description: Error interno del servidor
 */
router.post('/', upload.single('foto'), (req, res, next) => {
  console.log('Body recibido:', req.body);
  console.log('Archivo recibido:', req.file);
  next();
}, usuarioController.createUser);// Ruta POST específica con multer
//router.post('/', usuarioController.createUser);

/**
 * @swagger
 * /api/usuarios/{id_usuario}:
 *   put:
 *     summary: Actualiza la información de un usuario existente
 *     description: Permite actualizar los datos de un usuario. La contraseña es opcional (si no se envía, se mantiene la actual).
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID numérico del usuario que se va a actualizar
 *         example: 123
 *     requestBody:
 *       required: true
 *       description: Datos del usuario a actualizar (campos obligatorios marcados con *)
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tipo_documento
 *               - numero_documento
 *               - nombre_empleado
 *             properties:
 *               tipo_documento:
 *                 type: string
 *                 description: Tipo de documento (CC, CE, PASAPORTE, etc)*
 *                 example: "CC"
 *                 enum: ["CC", "CE", "TI", "PASAPORTE", "OTRO"]
 *               numero_documento:
 *                 type: string
 *                 description: Número de documento (debe ser único)*
 *                 example: "1234567890"
 *               nombre_empleado:
 *                 type: string
 *                 description: Nombre completo del usuario*
 *                 example: "Juan Pérez"
 *               direccion_empleado:
 *                 type: string
 *                 description: Dirección de residencia
 *                 example: "Calle 123 #45-67"
 *                 nullable: true
 *               telefono_empleado:
 *                 type: string
 *                 description: Teléfono de contacto
 *                 example: "3101234567"
 *                 nullable: true
 *               email_empleado:
 *                 type: string
 *                 description: Correo electrónico (debe ser único)
 *                 example: "juan@example.com"
 *                 format: email
 *               eps_empleado:
 *                 type: string
 *                 description: EPS del usuario
 *                 example: "Sura"
 *                 nullable: true
 *               usuarioadmin:
 *                 type: string
 *                 description: Nombre de usuario para acceso al sistema (debe ser único)
 *                 example: "juanp"
 *                 minLength: 4
 *               contrasenia:
 *                 type: string
 *                 description: Nueva contraseña (opcional, mínimo 8 caracteres)
 *                 example: "miNuevaClave123"
 *                 minLength: 8
 *                 format: password
 *               id_cargo:
 *                 type: integer
 *                 description: ID del cargo que ocupa el usuario
 *                 example: 2
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/:id_usuario', usuarioController.updateUser);

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
