// Importar los modelos necesarios
const RegistroEntrada = require('../models/registroEntradaModel');
const RegistroSalida = require('../models/registroSalidaModel');
const NotificacionEntradaTarde = require('../models/notificacionEntradaTardeModel');
const NotificacionSalidaTemprana = require('../models/notificacionSalidaTempranaModel');
const NoAsistencia = require('../models/noAsistenciaModel');
// Aquí deberás importar tu módulo de conexión a la base de datos o el ORM que utilices
const db = require('../config/database'); // Importa la conexión a la base de datos

class ReporteService {
  /**
     * Genera un reporte de asistencia.
     * @param {Date} fechaInicio - Fecha de inicio del rango del reporte.
     * @param {Date} fechaFin - Fecha de fin del rango del reporte.
     * @returns {Promise<Array>} - Un arreglo con los datos del reporte de asistencia.
     */
  static async generarReporteAsistencia(fechaInicio, fechaFin) {
    try {
      // Consulta para obtener registros de entrada y salida, uniéndolos con la tabla de usuarios
      const query = `
                SELECT 
                    u.id_usuario, 
                    u.nombre_empleado, 
                    re.fecha_hora AS fecha_hora_entrada,
                    rs.fecha_hora AS fecha_hora_salida,
                    re.comentarios AS comentarios_entrada,
                    rs.comentarios AS comentarios_salida
                FROM usuario u
                LEFT JOIN registro_entrada re ON u.id_usuario = re.id_usuario AND DATE(re.fecha_hora) BETWEEN ? AND ?
                LEFT JOIN registro_salida rs ON u.id_usuario = rs.id_usuario AND DATE(rs.fecha_hora) = DATE(re.fecha_hora) -- Asumiendo una salida por día de entrada
                ORDER BY u.id_usuario, re.fecha_hora;
            `;
            
      const [results] = await db.promise().query(query, [fechaInicio, fechaFin]);

      // Procesar los resultados para agrupar por usuario y fecha si es necesario,
      // y calcular la asistencia. Esta es una simplificación.
      // Podrías necesitar una lógica más compleja para emparejar entradas y salidas correctamente.
      const reporte = results.map(row => {
        return {
          id_usuario: row.id_usuario,
          nombre_completo: row.nombre_empleado,
          fecha_hora_entrada: row.fecha_hora_entrada,
          fecha_hora_salida: row.fecha_hora_salida,
          comentarios_entrada: row.comentarios_entrada,
          comentarios_salida: row.comentarios_salida,
          // Aquí podrías calcular la duración, estado (Presente, Ausente si no hay entrada/salida), etc.
        };
      });

      console.log(`Generando reporte de asistencia desde ${fechaInicio} hasta ${fechaFin}`);
      return reporte; 
    } catch (err) {
      console.error('Error en generarReporteAsistencia (Service):', err);
      throw err;
    } 
  }

  /**
     * Genera un reporte de llegadas tarde.
     * @param {Date} fechaInicio - Fecha de inicio del rango del reporte.
     * @param {Date} fechaFin - Fecha de fin del rango del reporte.
     * @returns {Promise<Array>} - Un arreglo con los datos del reporte de llegadas tarde.
     */
  static async generarReporteLlegadasTarde(fechaInicio, fechaFin) {
    try {
      const query = `
                SELECT 
                    net.id_notificacion,
                    u.id_usuario,
                    u.nombre_empleado,
                    re.fecha_hora AS fecha_hora_entrada_registrada,
                    net.fecha_hora AS fecha_hora_notificacion,
                    net.comentarios
                FROM notificacion_entrada_tarde net
                JOIN registro_entrada re ON net.id_entrada = re.id_entrada
                JOIN usuario u ON net.id_usuario = u.id_usuario
                WHERE DATE(net.fecha_hora) BETWEEN ? AND ?
                ORDER BY net.fecha_hora;
            `;
      const [results] = await db.promise().query(query, [fechaInicio, fechaFin]);
            
      const reporte = results.map(row => ({
        id_notificacion: row.id_notificacion,
        id_usuario: row.id_usuario,
        nombre_completo: row.nombre_empleado,
        fecha_hora_entrada_registrada: row.fecha_hora_entrada_registrada,
        fecha_hora_notificacion: row.fecha_hora_notificacion,
        comentarios: row.comentarios,
      }));

      console.log(`Generando reporte de llegadas tarde desde ${fechaInicio} hasta ${fechaFin}`);
      return reporte;
    } catch (err) {
      console.error('Error en generarReporteLlegadasTarde (Service):', err);
      throw err;
    }
  }

  /**
     * Genera un reporte de salidas temprano.
     * @param {Date} fechaInicio - Fecha de inicio del rango del reporte.
     * @param {Date} fechaFin - Fecha de fin del rango del reporte.
     * @returns {Promise<Array>} - Un arreglo con los datos del reporte de salidas temprano.
     */
  static async generarReporteSalidasTemprano(fechaInicio, fechaFin) {
    try {
      const query = `
                SELECT 
                    nst.id_notificacion,
                    u.id_usuario,
                    u.nombre_empleado,
                    rs.fecha_hora AS fecha_hora_salida_registrada,
                    nst.fecha_hora AS fecha_hora_notificacion,
                    nst.comentarios
                FROM notificacion_salida_temprana nst
                JOIN registro_salida rs ON nst.id_salida = rs.id_salida
                JOIN usuario u ON nst.id_usuario = u.id_usuario
                WHERE DATE(nst.fecha_hora) BETWEEN ? AND ?
                ORDER BY nst.fecha_hora;
            `;
      const [results] = await db.promise().query(query, [fechaInicio, fechaFin]);

      const reporte = results.map(row => ({
        id_notificacion: row.id_notificacion,
        id_usuario: row.id_usuario,
        nombre_completo: row.nombre_empleado,
        fecha_hora_salida_registrada: row.fecha_hora_salida_registrada,
        fecha_hora_notificacion: row.fecha_hora_notificacion,
        comentarios: row.comentarios,
      }));

      console.log(`Generando reporte de salidas temprano desde ${fechaInicio} hasta ${fechaFin}`);
      return reporte;
    } catch (err) {
      console.error('Error en generarReporteSalidasTemprano (Service):', err);
      throw err;
    }
  }

  /**
     * Genera un reporte de ausencias.
     * @param {Date} fechaInicio - Fecha de inicio del rango del reporte.
     * @param {Date} fechaFin - Fecha de fin del rango del reporte.
     * @returns {Promise<Array>} - Un arreglo con los datos del reporte de ausencias.
     */
  static async generarReporteAusencias(fechaInicio, fechaFin) {
    try {
      const query = `
                SELECT 
                    na.id_inasistencia,
                    u.id_usuario,
                    u.nombre_empleado,
                    na.fecha,
                    na.motivo
                FROM no_asistencia na
                JOIN usuario u ON na.id_usuario = u.id_usuario
                WHERE na.fecha BETWEEN ? AND ?
                ORDER BY na.fecha;
            `;
      const [results] = await db.promise().query(query, [fechaInicio, fechaFin]);
            
      const reporte = results.map(row => ({
        id_inasistencia: row.id_inasistencia,
        id_usuario: row.id_usuario,
        nombre_completo: row.nombre_empleado,
        fecha: row.fecha,
        motivo: row.motivo,
      }));

      console.log(`Generando reporte de ausencias desde ${fechaInicio} hasta ${fechaFin}`);
      return reporte;
    } catch (err) {
      console.error('Error en generarReporteAusencias (Service):', err);
      throw err;
    }
  }
}

module.exports = ReporteService;