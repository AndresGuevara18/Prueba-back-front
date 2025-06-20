// backend-node/src/services/asistenciaService.js
const connection = require('../config/database');
const moment = require('moment');

class AsistenciaService {
  static async getAsistenciaByUsuario(id_usuario, filtro) {
    console.log('🔍 AsistenciaService SOLO ENTRADA/SALIDA usuario:', id_usuario, 'con filtro:', filtro);
    // Consulta solo entradas y salidas
    let query = `
      SELECT 'Entrada' AS tipo, fecha_hora, comentarios AS detalle
      FROM registro_entrada
      WHERE id_usuario = ? AND comentarios = 'Entrada normal'
      UNION ALL
      SELECT 'Salida' AS tipo, fecha_hora, comentarios AS detalle
      FROM registro_salida
      WHERE id_usuario = ? AND comentarios = 'Salida normal'
    `;
    const params = [id_usuario, id_usuario];

    if (filtro) {
      const now = moment();
      let startDate, endDate;
      if (filtro === 'hoy' || filtro === 'today') {
        startDate = now.startOf('day').format('YYYY-MM-DD HH:mm:ss');
        endDate = now.endOf('day').format('YYYY-MM-DD HH:mm:ss');
      } else if (filtro === 'ayer' || filtro === 'yesterday') {
        startDate = now.subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss');
        endDate = now.endOf('day').format('YYYY-MM-DD HH:mm:ss');
      } else if (filtro === 'esta_semana' || filtro === 'week') {
        startDate = now.startOf('isoWeek').format('YYYY-MM-DD HH:mm:ss');
        endDate = now.endOf('isoWeek').format('YYYY-MM-DD HH:mm:ss');
      } else if (filtro === 'este_mes' || filtro === 'month') {
        startDate = now.startOf('month').format('YYYY-MM-DD HH:mm:ss');
        endDate = now.endOf('month').format('YYYY-MM-DD HH:mm:ss');
      }
      if (startDate && endDate) {
        query = `
          SELECT 'Entrada' AS tipo, fecha_hora, comentarios AS detalle
          FROM registro_entrada
          WHERE id_usuario = ? AND fecha_hora >= ? AND fecha_hora <= ? AND comentarios = 'Entrada normal'
          UNION ALL
          SELECT 'Salida' AS tipo, fecha_hora, comentarios AS detalle
          FROM registro_salida
          WHERE id_usuario = ? AND fecha_hora >= ? AND fecha_hora <= ? AND comentarios = 'Salida normal'
        `;
        params.splice(1, 0, startDate, endDate); // para entrada
        params.push(startDate, endDate); // para salida
      }
    }
    query += ' ORDER BY fecha_hora DESC';
    try {
      const [rows] = await connection.promise().query(query, params);
      return rows;
    } catch (error) {
      console.error('Error al obtener asistencia:', error);
      throw error;
    }
  }

  static async getIncidenciasByUsuario(id_usuario, filtro) {
    let query = `
      SELECT 'Entrada tarde' AS tipo, fecha_hora, comentarios AS detalle
      FROM notificacion_entrada_tarde
      WHERE id_usuario = ?
      UNION ALL
      SELECT 'Salida temprana' AS tipo, fecha_hora, comentarios AS detalle
      FROM notificacion_salida_temprana
      WHERE id_usuario = ?
      UNION ALL
      SELECT 'Inasistencia' AS tipo, fecha AS fecha_hora, motivo AS detalle
      FROM no_asistencia
      WHERE id_usuario = ?
    `;
    let params = [id_usuario, id_usuario, id_usuario];

    if (filtro) {
      const now = moment();
      let startDate, endDate;
      if (filtro === 'hoy' || filtro === 'today') {
        startDate = now.startOf('day').format('YYYY-MM-DD');
        endDate = now.endOf('day').format('YYYY-MM-DD');
      } else if (filtro === 'ayer' || filtro === 'yesterday') {
        startDate = now.subtract(1, 'days').startOf('day').format('YYYY-MM-DD');
        endDate = now.endOf('day').format('YYYY-MM-DD');
      } else if (filtro === 'esta_semana' || filtro === 'week') {
        startDate = now.startOf('isoWeek').format('YYYY-MM-DD');
        endDate = now.endOf('isoWeek').format('YYYY-MM-DD');
      } else if (filtro === 'este_mes' || filtro === 'month') {
        startDate = now.startOf('month').format('YYYY-MM-DD');
        endDate = now.endOf('month').format('YYYY-MM-DD');
      }
      if (startDate && endDate) {
        query = `
          SELECT 'Entrada tarde' AS tipo, fecha_hora, comentarios AS detalle
          FROM notificacion_entrada_tarde
          WHERE id_usuario = ? AND fecha_hora >= ? AND fecha_hora <= ?
          UNION ALL
          SELECT 'Salida temprana' AS tipo, fecha_hora, comentarios AS detalle
          FROM notificacion_salida_temprana
          WHERE id_usuario = ? AND fecha_hora >= ? AND fecha_hora <= ?
          UNION ALL
          SELECT 'Inasistencia' AS tipo, fecha AS fecha_hora, motivo AS detalle
          FROM no_asistencia
          WHERE id_usuario = ? AND fecha >= ? AND fecha <= ?
        `;
        params = [id_usuario, `${startDate} 00:00:00`, `${endDate} 23:59:59`, id_usuario, `${startDate} 00:00:00`, `${endDate} 23:59:59`, id_usuario, startDate, endDate];
      }
    }
    query += ' ORDER BY fecha_hora DESC';
    try {
      const [rows] = await connection.promise().query(query, params);
      return rows;
    } catch (error) {
      console.error('Error al obtener incidencias:', error);
      throw error;
    }
  }

  static async getHistorialByUsuario(id_usuario, filtroTabla, fecha, mes, anio) {
    // Mapear nombre de tabla a consulta y tipo
    const tablas = {
      'registro_entrada': {
        query: `SELECT 'Entrada' AS tipo, fecha_hora, comentarios AS detalle 
        FROM registro_entrada WHERE id_usuario = ?`,
        params: [id_usuario],
        campoFecha: 'fecha_hora',
      },
      'notificacion_entrada_tarde': {
        query: `SELECT 'Entrada tarde' AS tipo, fecha_hora, comentarios AS detalle 
        FROM notificacion_entrada_tarde WHERE id_usuario = ?`,
        params: [id_usuario],
        campoFecha: 'fecha_hora',
      },
      'registro_salida': {
        query: `SELECT 'Salida' AS tipo, fecha_hora, comentarios AS detalle 
        FROM registro_salida WHERE id_usuario = ?`,
        params: [id_usuario],
        campoFecha: 'fecha_hora',
      },
      'notificacion_salida_temprana': {
        query: `SELECT 'Salida temprana' AS tipo, fecha_hora, comentarios 
        AS detalle FROM notificacion_salida_temprana WHERE id_usuario = ?`,
        params: [id_usuario],
        campoFecha: 'fecha_hora',
      },
      'no_asistencia': {
        query: `SELECT 'Inasistencia' AS tipo, fecha AS fecha_hora, motivo 
        AS detalle FROM no_asistencia WHERE id_usuario = ?`,
        params: [id_usuario],
        campoFecha: 'fecha',
      },
    };

    let results = [];
    // Si se filtra por tabla
    if (filtroTabla && tablas[filtroTabla]) {
      let { query, params, campoFecha } = tablas[filtroTabla];
      // Filtro por fecha exacta
      if (fecha) {
        query += ` AND DATE(${campoFecha}) = ?`;
        params.push(fecha);
      }
      // Filtro por mes y año
      if (mes && anio) {
        query += ` AND MONTH(${campoFecha}) = ? AND YEAR(${campoFecha}) = ?`;
        params.push(mes, anio);
      }
      const [rows] = await connection.promise().query(query + ' ORDER BY fecha_hora DESC', params);
      results = rows;
    } else {
      // Todas las tablas (unión)
      const subconsultas = Object.entries(tablas).map(([nombre, t]) => {
        let q = t.query;
        let p = [...t.params];
        if (fecha) {
          q += ` AND DATE(${t.campoFecha}) = ?`;
          p.push(fecha);
        }
        if (mes && anio) {
          q += ` AND MONTH(${t.campoFecha}) = ? AND YEAR(${t.campoFecha}) = ?`;
          p.push(mes, anio);
        }
        return { q, p };
      });
      const unionQuery = subconsultas.map(s => s.q).join(' UNION '); // Usar UNION para eliminar duplicados exactos
      const allParams = subconsultas.reduce((acc, s) => acc.concat(s.p), []);
      const [rows] = await connection.promise().query(unionQuery + ' ORDER BY fecha_hora DESC', allParams);
      results = rows;
    }
    return results;
  }
}

module.exports = AsistenciaService;
