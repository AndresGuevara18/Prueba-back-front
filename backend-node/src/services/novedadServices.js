// backend-node\src\services\novedadServices.js
const connection = require('../config/database'); // Conexión a MySQL desde database.js

const moment = require('moment'); // Importar moment para manejo de fechas

class NovedadService {
  static async getAllNovedades(filtro) {
    const query = `
            SELECT
                u.id_usuario,
                u.nombre_empleado AS nombre_usuario, -- Modificado para usar solo nombre_empleado
                'Registro Entrada' AS tipo_novedad,
                re.fecha_hora AS fecha_hora,
                NULL AS detalle
            FROM registro_entrada re
            JOIN usuario u ON re.id_usuario = u.id_usuario

            UNION ALL

            SELECT
                u.id_usuario,
                u.nombre_empleado AS nombre_usuario, -- Modificado para usar solo nombre_empleado
                'Entrada Tarde' AS tipo_novedad,
                net.fecha_hora AS fecha_hora,
                net.comentarios AS detalle
            FROM notificacion_entrada_tarde net
            JOIN usuario u ON net.id_usuario = u.id_usuario

            UNION ALL

            SELECT
                u.id_usuario,
                u.nombre_empleado AS nombre_usuario, -- Modificado para usar solo nombre_empleado
                'Registro Salida' AS tipo_novedad,
                rs.fecha_hora AS fecha_hora,
                NULL AS detalle
            FROM registro_salida rs
            JOIN usuario u ON rs.id_usuario = u.id_usuario

            UNION ALL

            SELECT
                u.id_usuario,
                u.nombre_empleado AS nombre_usuario, -- Modificado para usar solo nombre_empleado
                'Salida Temprana' AS tipo_novedad,
                nst.fecha_hora AS fecha_hora,
                nst.comentarios AS detalle
            FROM notificacion_salida_temprana nst
            JOIN usuario u ON nst.id_usuario = u.id_usuario

            UNION ALL

            SELECT
                u.id_usuario,
                u.nombre_empleado AS nombre_usuario, -- Modificado para usar solo nombre_empleado
                'Inasistencia' AS tipo_novedad,
                ia.fecha AS fecha_hora, -- Ajustado para usar 'fecha' de 'no_asistencia'
                ia.motivo AS detalle -- Ajustado para usar 'motivo' de 'no_asistencia'
            FROM no_asistencia ia -- Corregido de 'inasistencia' a 'no_asistencia'
            JOIN usuario u ON ia.id_usuario = u.id_usuario

        `; // Se quita el ORDER BY y el punto y coma de la query base para poder anidarla

    let queryConFiltro = query;
    const params = [];

    if (filtro) {
      const now = moment();
      let startDate, endDate;

      if (filtro === 'hoy') {
        startDate = now.startOf('day').format('YYYY-MM-DD HH:mm:ss');
        endDate = now.endOf('day').format('YYYY-MM-DD HH:mm:ss');
      } else if (filtro === 'ayer') {
        startDate = now.subtract(1, 'days').startOf('day').format('YYYY-MM-DD HH:mm:ss');
        endDate = now.endOf('day').format('YYYY-MM-DD HH:mm:ss'); // El endOf('day') de ayer ya pasó, así que es el mismo que el de hoy al inicio del día anterior.
      } else if (filtro === 'esta_semana') {
        startDate = now.startOf('isoWeek').format('YYYY-MM-DD HH:mm:ss');
        endDate = now.endOf('isoWeek').format('YYYY-MM-DD HH:mm:ss');
      } else if (filtro === 'este_mes') {
        startDate = now.startOf('month').format('YYYY-MM-DD HH:mm:ss');
        endDate = now.endOf('month').format('YYYY-MM-DD HH:mm:ss');
      }

      if (startDate && endDate) {
        // Modificamos la query para incluir el filtro de fecha. 
        // Esto requiere que cada subconsulta tenga un alias y que el filtro se aplique al campo fecha_hora del resultado final.
        // Una forma más robusta sería aplicar el filtro dentro de cada UNION ALL, pero esto es más complejo de construir dinámicamente aquí.
        // Por simplicidad, vamos a envolver la query original y aplicar el WHERE al resultado.
        queryConFiltro = `SELECT * FROM (${query}) AS novedades_consolidadas WHERE fecha_hora >= ? AND fecha_hora <= ?`;
        params.push(startDate, endDate);
      } else {
        // Si el filtro no es uno de los esperados, no se aplica ningún filtro de fecha adicional a la query original.
        queryConFiltro = query; // Se usa la query base sin filtro de fecha
      }
    } else {
      // Si no hay filtro, se usa la query original
      queryConFiltro = query;
    }

    // Añadir ORDER BY al final, después de aplicar o no los filtros
    queryConFiltro += ' ORDER BY fecha_hora DESC';

    try {
      const [rows, fields] = await connection.promise().query(queryConFiltro, params);
      return rows;
    } catch (error) {
      console.error('Error al obtener novedades:', error);
      throw error;
    }
  }
}

module.exports = NovedadService;