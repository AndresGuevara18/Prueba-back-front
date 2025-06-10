const authService = require('../services/authService');
const usuarioService = require('../services/userServices');
const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authController = {
  // Autenticación de usuario (login)
  login: async (req, res) => {
    try {
      const { usuarioadmin, contrasenia } = req.body;
      console.log('[DEBUG] login - usuarioadmin:', usuarioadmin, '| contrasenia:', contrasenia);
      if (!usuarioadmin || !contrasenia) {
        return res.status(400).json({ success: false, message: 'Usuario y contraseña son requeridos.' });
      }
      // Buscar usuario por nombre de usuario
      const user = await authService.getUserByUsername(usuarioadmin);
      console.log('[DEBUG] login - user encontrado:', user);
      if (!user) {
        return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos.' });
      }
      // Validar que el usuario tenga id_cargo 1, 2 o 3
      if (!authService.isCargoAutorizado(user.id_cargo)) {
        return res.status(403).json({ success: false, message: 'Acceso denegado: solo usuarios con cargo autorizado pueden ingresar.' });
      }
      // Validar contraseña
      const passwordMatch = await bcrypt.compare(contrasenia, user.contrasenia);
      console.log('[DEBUG] login - passwordMatch:', passwordMatch);
      if (!passwordMatch) {
        return res.status(401).json({ success: false, message: 'Usuario o contraseña incorrectos.' });
      }
      // Generar JWT
      const token = jwt.sign({ id_usuario: user.id_usuario, usuarioadmin: user.usuarioadmin, id_cargo: user.id_cargo }, process.env.JWT_SECRET || 'secreto', { expiresIn: '8h' });
      console.log('[DEBUG] login - token generado:', token);
      res.json({ success: true, message: 'Login exitoso', token, user: { id_usuario: user.id_usuario, usuarioadmin: user.usuarioadmin, id_cargo: user.id_cargo, nombre_empleado: user.nombre_empleado } });
    } catch (error) {
      console.error('❌ Error en login (AuthController):', error);
      res.status(500).json({ success: false, message: 'Error interno en login.' });
    }
  },

  // Obtener perfil del usuario autenticado
  getProfile: async (req, res) => {
    console.log('🔍 AuthController Obteniendo perfil del usuario autenticado');
    try {
      const id_usuario = req.user.id_usuario;
      // Buscar usuario por id_usuario
      const query = 'SELECT * FROM usuario WHERE id_usuario = ?';
      const [userResult] = await db.promise().query(query, [id_usuario]);
      if (userResult.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      // Buscar nombre del cargo
      const [cargoResult] = await db.promise().query('SELECT nombre_cargo FROM cargo WHERE id_cargo = ?', [userResult[0].id_cargo]);
      const cargo_user = cargoResult.length > 0 ? cargoResult[0].nombre_cargo : null;
      res.json({ ...userResult[0], cargo_user });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el perfil' });
    }
  },
};

module.exports = authController;
