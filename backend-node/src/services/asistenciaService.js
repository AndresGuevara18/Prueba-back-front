// backend-node/src/services/asistenciaService.js
const connection = require('../config/database');
const moment = require('moment');

class AsistenciaService {
  static async getAsistenciaByUsuario(id_usuario, filtro) {
    console.log('🔍 AsistenciaService Cargando asistencia del usuario:', id_usuario, 'con filtro:', filtro);
    // Query base: solo registros del usuario
    const query = `
      SELECT
        re.id_usuario,
        CASE
          WHEN net.id_usuario IS NOT NULL THEN 'Entrada tarde'
          WHEN nst.id_usuario IS NOT NULL THEN 'Salida temprana'
          WHEN ia.id_usuario IS NOT NULL THEN 'Inasistencia'
          ELSE 'Normal'
        END AS tipo,
        re.fecha_hora AS fecha_hora,
        COALESCE(net.comentarios, nst.comentarios, ia.motivo, '') AS detalle
      FROM registro_entrada re
      LEFT JOIN registro_salida rs 
        ON re.id_usuario = rs.id_usuario 
        AND DATE(re.fecha_hora) = DATE(rs.fecha_hora)
      LEFT JOIN notificacion_entrada_tarde net 
        ON re.id_usuario = net.id_usuario 
        AND DATE(re.fecha_hora) = DATE(net.fecha_hora)
      LEFT JOIN notificacion_salida_temprana nst 
        ON re.id_usuario = nst.id_usuario 
        AND DATE(re.fecha_hora) = DATE(nst.fecha_hora)
      LEFT JOIN no_asistencia ia 
        ON re.id_usuario = ia.id_usuario 
        AND DATE(re.fecha_hora) = ia.fecha
      WHERE re.id_usuario = ?
    `;

    let queryConFiltro = query;
    const params = [id_usuario];

    if (filtro) {
      const now = moment();
      let startDate, endDate;
      if (filtro === 'hoy') {
        startDate = now.startOf('day').format('YYYY-MM-DD HH:mm:ss');
        endDate = now.endOf('day').format('YYYY-MM-DD HH:mm:ss');
      } else if (filtro === 'ayer') {
        startDate = now.subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss');
        endDate = now.endOf('day').format('YYYY-MM-DD HH:mm:ss');
      } else if (filtro === 'esta_semana') {
        startDate = now.startOf('isoWeek').format('YYYY-MM-DD HH:mm:ss');
        endDate = now.endOf('isoWeek').format('YYYY-MM-DD HH:mm:ss');
      } else if (filtro === 'este_mes') {
        startDate = now.startOf('month').format('YYYY-MM-DD HH:mm:ss');
        endDate = now.endOf('month').format('YYYY-MM-DD HH:mm:ss');
      }
      if (startDate && endDate) {
        queryConFiltro += ' AND re.fecha_hora >= ? AND re.fecha_hora <= ?';
        params.push(startDate, endDate);
      }
    }
    queryConFiltro += ' ORDER BY re.fecha_hora DESC';
    try {
      const [rows] = await connection.promise().query(queryConFiltro, params);
      return rows;
    } catch (error) {
      console.error('Error al obtener asistencia:', error);
      throw error;
    }
  }
}

module.exports = AsistenciaService;
