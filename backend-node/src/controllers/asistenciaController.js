// backend-node/src/controllers/asistenciaController.js
const AsistenciaService = require('../services/asistenciaService');

const asistenciaController = {
  // GET /api/asistencia/mia?filtro=periodo
  getAsistenciaUsuario: async (req, res) => {
    try {
      console.log('🔍 AsistenciaController Cargando asistencia del usuario autenticado');
      const id_usuario = req.user.id_usuario; // id extraído del token por el middleware auth
      const filtro = req.query.filtro || null; // 'hoy', 'ayer', 'esta_semana', 'este_mes'
      const asistencias = await AsistenciaService.getAsistenciaByUsuario(id_usuario, filtro);
      res.json(asistencias);
    } catch (error) {
      console.error('Error en getAsistenciaUsuario:', error);
      res.status(500).json({ error: 'Error al obtener la asistencia del usuario' });
    }
  },
};

module.exports = asistenciaController;
