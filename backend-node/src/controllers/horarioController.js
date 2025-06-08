// src/controllers/horarioLaboralController.js
const HorarioLaboral = require('../models/horarioModel');
const horarioLaboralService = require('../services/horarioServices'); // Importar el servicio de horario laboral

const horarioLaboralController = {

  // Obtener todos los horarios laborales
  getAllHorarios: async (req, res) => {
    try {
      const horarios = await horarioLaboralService.getAllHorarios();
      res.json(horarios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los horarios laborales' });
    }
  },

  // Crear un nuevo horario laboral
  createHorario: async (req, res) => {
    try {
      const { hora_entrada, hora_salida, descripcion } = req.body;
      
      // Validar campos obligatorios
      if (!hora_entrada || !hora_salida) {
        return res.status(400).json({ error: 'Hora de entrada y hora de salida son obligatorias' });
      }

      // Crear instancia del modelo
      const nuevoHorario = new HorarioLaboral(null, hora_entrada, hora_salida, descripcion || '');

      // Llamar al servicio para crear el horario
      const horarioCreado = await horarioLaboralService.createHorario(nuevoHorario);

      res.status(201).json({
        message: '✅ Horario laboral creado correctamente',
        horario: horarioCreado,
      });
    } catch (error) {
      console.error('❌ Error en createHorario (Controller):', error);
      res.status(500).json({ error: 'Error al crear el horario laboral' });
    }
  },

  // Actualizar un horario laboral
  updateHorario: async (req, res) => {
    try {
      const { id_horario } = req.params;
      const { hora_entrada, hora_salida, descripcion } = req.body;

      // Validar campos obligatorios
      if (!hora_entrada || !hora_salida) {
        return res.status(400).json({ error: 'Hora de entrada y hora de salida son obligatorias' });
      }

      // Llamar al servicio para actualizar
      const resultado = await horarioLaboralService.updateHorario(
        id_horario,
        hora_entrada,
        hora_salida,
        descripcion || '',
      );

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ error: 'Horario laboral no encontrado' });
      }

      res.json({ message: 'Horario laboral actualizado correctamente' });
    } catch (error) {
      console.error('❌ Error en updateHorario (Controller):', error);
      res.status(500).json({ error: 'Error al actualizar el horario laboral' });
    }
  },

  // Eliminar un horario laboral
  deleteHorario: async (req, res) => {
    try {
      const { id_horario } = req.params;
      const resultado = await horarioLaboralService.deleteHorario(id_horario);

      if (!resultado.exists) {
        return res.status(404).json({ error: '❌ Horario laboral no encontrado.' });
      }

      if (resultado.hasCargos) {
        return res.status(400).json({ 
          error: '⚠️ No se puede eliminar porque hay cargos asignados a este horario.', 
        });
      }

      if (resultado.deleted) {
        return res.status(200).json({ message: '✅ Horario laboral eliminado correctamente.' });
      }

      res.status(400).json({ error: '⚠️ No se pudo eliminar el horario laboral.' });
    } catch (error) {
      console.error('❌ Error en deleteHorario (Controller):', error);
      res.status(500).json({ error: '❌ Error interno al eliminar el horario laboral.' });
    }
  },

  // Actualizar el id_horario en TODOS los cargos (sin importar el anterior)
  aplicarHorarioATodos: async (req, res) => {
    try {
      const { id_horario_nuevo } = req.body;
      if (!id_horario_nuevo) {
        return res.status(400).json({ error: 'Se requiere id_horario_nuevo.' });
      }
      const resultado = await horarioLaboralService.updateHorarioEnTodosLosCargos(id_horario_nuevo);
      res.json({ message: 'Horario aplicado a todos los cargos correctamente.', resultado });
    } catch (error) {
      console.error('❌ Error en aplicarHorarioATodos (Controller):', error);
      res.status(500).json({ error: 'Error al aplicar el horario a todos los cargos.' });
    }
  },

  // Llamar al procedimiento revisar_inasistencias
  revisarInasistencias: async (req, res) => {
    console.log('Controlador: revisarInasistencias');
    try {
      const { fecha } = req.body;
      if (!fecha) {
        return res.status(400).json({ error: 'La fecha es requerida.' });
      }
      const resultado = await horarioLaboralService.revisarInasistencias(fecha);
      res.json(resultado);
    } catch (error) {
      console.error('❌ Error en revisarInasistencias (Controller):', error);
      res.status(500).json({ error: 'Error al revisar inasistencias.' });
    }
  },
};

module.exports = horarioLaboralController;