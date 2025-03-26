const Horario = require('../models/horarioServices');
const horarioService = require('../services/horarioServices'); // Importar el servicio de horario

/*
req: Objeto de solicitud (request), que contiene datos enviados por el cliente.
res: Objeto de respuesta (response), que se usa para devolver una respuesta al cliente.
*/

// Objeto que contendrá los métodos del controlador
const horarioController = {

    // Método para crear un nuevo horario
    crearHorario: async (req, res) => {
        try {
            const { cargo_id, hora_entrada, hora_salida, dias_semana } = req.body;

            // Validaciones básicas
            if (!cargo_id || !hora_entrada || !hora_salida || !dias_semana) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Faltan campos obligatorios (cargo_id, hora_entrada, hora_salida, dias_semana)'
                });
            }

            // Crear objeto Horario
            const nuevoHorario = Horario.nuevoHorario(
                null,
                cargo_id,
                hora_entrada,
                hora_salida,
                dias_semana,
                new Date(),
                new Date()
            );

            const horarioCreado = await horarioService.crearHorario(nuevoHorario);

            return res.status(201).json({
                exito: true,
                mensaje: "✅ Horario creado exitosamente",
                //datos: horarioCreado,
                //redirect: "/horarios.html" // URL a la que se redirigirá el usuario
            });
        } catch (error) {
            console.error("❌ Error en crearHorario:", error);
            return res.status(500).json({
                exito: false,
                mensaje: error.message
            });
        }
    },

    // Método para obtener horarios por cargo
    obtenerHorariosPorCargo: async (req, res) => {
        try {
            const { cargo_id } = req.params;

            if (!cargo_id) {
                return res.status(400).json({
                    exito: false,
                    mensaje: 'Se requiere el ID del cargo'
                });
            }

            const horarios = await horarioService.obtenerHorariosPorCargo(cargo_id);

            return res.status(200).json({
                exito: true,
                datos: horarios
            });
        } catch (error) {
            console.error("❌ Error en obtenerHorariosPorCargo:", error);
            return res.status(500).json({
                exito: false,
                mensaje: error.message
            });
        }
    },

    // Método para obtener un horario específico por ID
    obtenerHorarioPorId: async (req, res) => {
        try {
            const { id } = req.params;

            const horario = await horarioService.obtenerHorarioPorId(id);

            if (!horario) {
                return res.status(404).json({
                    exito: false,
                    mensaje: "Horario no encontrado"
                });
            }

            return res.status(200).json({
                exito: true,
                datos: horario
            });
        } catch (error) {
            console.error("❌ Error en obtenerHorarioPorId:", error);
            if (error.message === 'Horario no encontrado') {
                return res.status(404).json({
                    exito: false,
                    mensaje: error.message
                });
            }

            return res.status(500).json({
                exito: false,
                mensaje: "Error interno al obtener el horario"
            });
        }
    },

    // Método para actualizar un horario existente
    actualizarHorario: async (req, res) => {
        try {
            const { id } = req.params;
            const datosHorario = req.body;

            // Primero obtenemos el horario actual
            const horarioExistente = await horarioService.obtenerHorarioPorId(id);

            if (!horarioExistente) {
                return res.status(404).json({
                    exito: false,
                    mensaje: "Horario no encontrado"
                });
            }

            // Actualizamos solo los campos proporcionados
            if (datosHorario.cargo_id !== undefined) {
                horarioExistente.setCargoId(datosHorario.cargo_id);
            }

            if (datosHorario.hora_entrada !== undefined) {
                horarioExistente.setHoraEntrada(datosHorario.hora_entrada);
            }

            if (datosHorario.hora_salida !== undefined) {
                horarioExistente.setHoraSalida(datosHorario.hora_salida);
            }

            if (datosHorario.dias_semana !== undefined) {
                horarioExistente.setDiasSemana(datosHorario.dias_semana);
            }

            const horarioActualizado = await horarioService.actualizarHorario(id, horarioExistente);

            return res.status(200).json({
                exito: true,
                mensaje: "✅ Horario actualizado exitosamente",
                datos: horarioActualizado
            });
        } catch (error) {
            console.error("❌ Error en actualizarHorario:", error);
            if (error.message === 'Horario no encontrado') {
                return res.status(404).json({
                    exito: false,
                    mensaje: error.message
                });
            }

            return res.status(500).json({
                exito: false,
                mensaje: "Error interno al actualizar el horario"
            });
        }
    },

    // Método para eliminar un horario existente
    eliminarHorario: async (req, res) => {
        try {
            const { id } = req.params;
            console.log("Controlador eliminarHorario: ", id);

            const resultado = await horarioService.eliminarHorario(id);

            return res.status(200).json({
                exito: true,
                mensaje: "✅ Horario eliminado correctamente"
            });
        } catch (error) {
            console.error("❌ Error en eliminarHorario (Controller):", error);
            if (error.message === 'Horario no encontrado') {
                return res.status(404).json({
                    exito: false,
                    mensaje: "❌ Horario no encontrado."
                });
            }

            return res.status(500).json({
                exito: false,
                mensaje: "❌ Error interno al eliminar el horario."
            });
        }
    }
};

// Exporta el objeto para ser utilizado en otros archivos
module.exports = horarioController;