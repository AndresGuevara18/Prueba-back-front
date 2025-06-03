// backend-node\src\services\novedadServices.js
const connection = require('../config/database'); // Conexión a MySQL desde database.js

class NovedadService {
    static async getAllNovedades() {
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

            ORDER BY fecha_hora DESC;
        `;

        try {
            const [rows, fields] = await connection.promise().query(query);
            return rows;
        } catch (error) {
            console.error('Error al obtener novedades:', error);
            throw error;
        }
    }
}

module.exports = NovedadService;