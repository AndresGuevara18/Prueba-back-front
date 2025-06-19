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

  // GET /api/asistencia/incidencias?filtro=periodo
  getIncidenciasUsuario: async (req, res) => {
    try {
      const id_usuario = req.user.id_usuario;
      const filtro = req.query.filtro || null;
      const incidencias = await AsistenciaService.getIncidenciasByUsuario(id_usuario, filtro);
      res.json(incidencias);
    } catch (error) {
      console.error('Error en getIncidenciasUsuario:', error);
      res.status(500).json({ error: 'Error al obtener las incidencias del usuario' });
    }
  },

  // GET /api/asistencia/historial?tabla=nombre_tabla
  getHistorialUsuario: async (req, res) => {
    try {
      const id_usuario = req.user.id_usuario;
      const filtroTabla = req.query.tabla || null; // nombre de la tabla o null para todo
      const historial = await AsistenciaService.getHistorialByUsuario(id_usuario, filtroTabla);
      // No se envía el id_usuario en la respuesta, solo tipo, fecha_hora, detalle, origen
      res.json(historial);
    } catch (error) {
      console.error('Error en getHistorialUsuario:', error);
      res.status(500).json({ error: 'Error al obtener el historial del usuario' });
    }
  },
};

module.exports = asistenciaController;
