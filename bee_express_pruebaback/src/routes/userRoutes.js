
//router.post('/usuarios', upload.single('foto'), usuarioController.createUser);
const express = require('express'); // Importar Express
const usuarioController = require('../controllers/userController');

const router = express.Router(); // 🚀 Definir el router antes de usarlo

//rutas
router.get('/', usuarioController.getAllUsers);  // GET /api/usuarios
router.post('/', usuarioController.createUser);  // POST /api/usuarios
router.delete('/:id_usuario', usuarioController.deleteUser);  // DELETE /api/usuarios/:id_usuario


module.exports = router; // Exportar el router
