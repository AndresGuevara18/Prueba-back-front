const Horario = require('../models/horarioServices');
const db = require('../config/database'); // Asumiendo que tienes configurada la conexión a la BD

// Objeto que contendrá los métodos del servicio
const horarioService = {
    // Crear un nuevo horario
    crearHorario: async (horario) => {
        try {
            // Aquí iría la lógica para insertar en la base de datos
            // Ejemplo con consulta SQL (asumiendo que usas una BD relacional)
            const query = `
                INSERT INTO horarios (cargo_id, hora_entrada, hora_salida, dias_semana, fecha_creacion, fecha_actualizacion)
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            const result = await db.query(query, [
                horario.getCargoId(),
                horario.getHoraEntrada(),
                horario.getHoraSalida(),
                horario.getDiasSemana(),
                horario.getFechaCreacion(),
                horario.getFechaActualizacion()
            ]);

            // Asignamos el ID generado al objeto
            horario.setId(result.insertId);

            return horario;
        } catch (error) {
            throw new Error(`Error al crear horario: ${error.message}`);
        }
    },

    // Obtener horarios por cargo_id
    obtenerHorariosPorCargo: async (cargoId) => {
        try {
            // Consulta para obtener horarios por cargo_id
            const query = `
                SELECT * FROM horarios 
                WHERE cargo_id = ?
            `;

            const rows = await db.query(query, [cargoId]);

            // Convertimos los resultados a objetos Horario
            const horarios = rows.map(row => Horario.nuevoHorario(
                row.id,
                row.cargo_id,
                row.hora_entrada,
                row.hora_salida,
                row.dias_semana,
                row.fecha_creacion,
                row.fecha_actualizacion
            ));

            return horarios;
        } catch (error) {
            throw new Error(`Error al obtener horarios: ${error.message}`);
        }
    },

    // Obtener un horario específico por su ID
    obtenerHorarioPorId: async (id) => {
        try {
            const query = `
                SELECT * FROM horarios 
                WHERE id = ?
            `;

            const rows = await db.query(query, [id]);

            if (rows.length === 0) {
                throw new Error('Horario no encontrado');
            }

            const row = rows[0];
            const horario = Horario.nuevoHorario(
                row.id,
                row.cargo_id,
                row.hora_entrada,
                row.hora_salida,
                row.dias_semana,
                row.fecha_creacion,
                row.fecha_actualizacion
            );

            return horario;
        } catch (error) {
            throw new Error(`Error al obtener horario: ${error.message}`);
        }
    },

    // Actualizar un horario existente
    actualizarHorario: async (id, horario) => {
        try {
            // Actualizar la fecha de actualización
            horario.setFechaActualizacion(new Date());

            const query = `
                UPDATE horarios 
                SET cargo_id = ?, 
                    hora_entrada = ?, 
                    hora_salida = ?, 
                    dias_semana = ?, 
                    fecha_actualizacion = ? 
                WHERE id = ?
            `;

            const result = await db.query(query, [
                horario.getCargoId(),
                horario.getHoraEntrada(),
                horario.getHoraSalida(),
                horario.getDiasSemana(),
                horario.getFechaActualizacion(),
                id
            ]);

            if (result.affectedRows === 0) {
                throw new Error('Horario no encontrado');
            }

            // Aseguramos que el ID del horario sea el correcto
            horario.setId(Number(id));

            return horario;
        } catch (error) {
            throw new Error(`Error al actualizar horario: ${error.message}`);
        }
    },

    // Eliminar un horario
    eliminarHorario: async (id) => {
        try {
            const query = `
                DELETE FROM horarios 
                WHERE id = ?
            `;

            const result = await db.query(query, [id]);

            if (result.affectedRows === 0) {
                throw new Error('Horario no encontrado');
            }

            return { mensaje: 'Horario eliminado correctamente' };
        } catch (error) {
            throw new Error(`Error al eliminar horario: ${error.message}`);
        }
    }
};

module.exports = horarioService;