// src/services/horarioServices.js
const db = require('../config/database'); // Importa la conexión a la base de datos
const HorarioLaboral = require('../models/horarioModel'); // Importa el modelo HorarioLaboral

const horarioLaboralService = {
  // Obtener todos los horarios laborales
  getAllHorarios: async () => {
    const query = 'SELECT * FROM horario_laboral'; 
    try {
      const [results] = await db.promise().query(query);
      // Convertir cada fila del resultado en una instancia de HorarioLaboral
      return results.map(row => new HorarioLaboral(
        row.id_horario,
        row.hora_entrada,
        row.hora_salida,
        row.descripcion,
      )); 
    } catch (err) {
      throw err;
    }
  },

  // Crear un nuevo horario laboral
  createHorario: async (horarioData) => {
    const query = 'INSERT INTO horario_laboral (hora_entrada, hora_salida, descripcion) VALUES (?, ?, ?)'; 
    try {
      const [result] = await db.promise().query(query, [
        horarioData.getHoraEntrada(),
        horarioData.getHoraSalida(),
        horarioData.getDescripcion(),
      ]);
      
      // Retornar nuevo objeto con el ID generado
      return new HorarioLaboral(
        result.insertId,
        horarioData.getHoraEntrada(),
        horarioData.getHoraSalida(),
        horarioData.getDescripcion(),
      );
    } catch (err) {
      console.error('❌ Error en createHorario (Service):', err);
      throw err;
    }
  },

  // Actualizar un horario laboral
  updateHorario: async (id_horario, hora_entrada, hora_salida, descripcion) => {
    const query = 'UPDATE horario_laboral SET hora_entrada = ?, hora_salida = ?, descripcion = ? WHERE id_horario = ?';
       
    try {
      const [result] = await db.promise().query(query, [
        hora_entrada,
        hora_salida,
        descripcion,
        id_horario,
      ]);
      return result;
    } catch (err) {
      console.error('❌ Error en updateHorario (Service):', err);
      throw err;
    }
  },

  // Eliminar un horario laboral
  deleteHorario: async (id_horario) => {
    const queryCheckHorario = 'SELECT id_horario FROM horario_laboral WHERE id_horario = ?';
    const queryCheckCargos = 'SELECT COUNT(*) AS total FROM cargo WHERE id_horario = ?';
    const queryDelete = 'DELETE FROM horario_laboral WHERE id_horario = ?';
    
    try {
      // Verificar si el horario existe
      const [horarioResult] = await db.promise().query(queryCheckHorario, [parseInt(id_horario)]);
      if (horarioResult.length === 0) {
        console.log(`❌ Horario con ID ${id_horario} no encontrado en la base de datos.`);
        return { exists: false };
      }
    
      // Verificar si hay cargos asignados a este horario
      const [cargosResult] = await db.promise().query(queryCheckCargos, [parseInt(id_horario)]);
      if (cargosResult[0].total > 0) {
        console.log(`⚠️ No se puede eliminar el horario ${id_horario}, está asignado a ${cargosResult[0].total} cargos.`);
        return { exists: true, hasCargos: true };
      }
    
      // Intentar eliminar el horario
      const [deleteResult] = await db.promise().query(queryDelete, [parseInt(id_horario)]);
    
      if (deleteResult.affectedRows > 0) {
        console.log(`✅ Horario con ID ${id_horario} eliminado correctamente.`);
        return { exists: true, deleted: true };
      } else {
        console.log(`⚠️ Horario con ID ${id_horario} no se eliminó.`);
        return { exists: true, deleted: false };
      }
    } catch (err) {
      console.error('❌ Error en deleteHorario (Service):', err);
      throw err;
    }
  },

  // Actualizar el id_horario en todos los cargos que tengan un id_horario específico
  updateHorarioEnCargos: async (id_horario_actual, id_horario_nuevo) => {
    const query = 'UPDATE cargo SET id_horario = ? WHERE id_horario = ?';
    try {
      const [result] = await db.promise().query(query, [
        id_horario_nuevo,
        id_horario_actual,
      ]);
      return result;
    } catch (err) {
      console.error('❌ Error en updateHorarioEnCargos (Service):', err);
      throw err;
    }
  },

  // Actualizar el id_horario en TODOS los cargos (solo si id_cargo > 0)
  updateHorarioEnTodosLosCargos: async (id_horario_nuevo) => {
    const query = 'UPDATE cargo SET id_horario = ? WHERE id_cargo > 0';
    try {
      const [result] = await db.promise().query(query, [id_horario_nuevo]);
      return result;
    } catch (err) {
      console.error('❌ Error en updateHorarioEnTodosLosCargos (Service):', err);
      throw err;
    }
  },

  // Llamar al procedimiento revisar_inasistencias
  revisarInasistencias: async (fecha_revision) => {
    try {
      const [resultSets] = await db.promise().query('CALL revisar_inasistencias(?)', [fecha_revision]);
      console.log('DEBUG revisar_inasistencias resultSets:', JSON.stringify(resultSets));
      // resultSets puede ser un array de arrays si el procedimiento retorna varios SELECT
      // Suponiendo que el primer SELECT es la lista de inasistentes y el último el mensaje
      let inasistentes = [];
      let mensaje = 'Revisión completada.';
      if (Array.isArray(resultSets)) {
        if (resultSets.length > 1) {
          inasistentes = resultSets[0];
          mensaje = resultSets[resultSets.length - 1][0]?.mensaje || mensaje;
        } else if (resultSets.length === 1) {
          // Si solo hay un resultado, puede ser solo mensaje o solo lista
          if (resultSets[0][0]?.mensaje) {
            mensaje = resultSets[0][0].mensaje;
          } else {
            inasistentes = resultSets[0];
          }
        }
      }
      return { mensaje, inasistentes };
    } catch (err) {
      console.error('❌ Error en revisarInasistencias (Service):', err);
      throw err;
    }
  },

  // Verificar si un horario existe (similar al método en cargoService)
  /*horarioExists: async (id_horario) => {
    const query = 'SELECT COUNT(*) AS count FROM horario_laboral WHERE id_horario = ?';
    try {
      const [results] = await db.promise().query(query, [id_horario]);
      return results[0].count > 0;
    } catch (err) {
      console.error('❌ Error en horarioExists (Service):', err);
      throw err;
    }
  }*/
};

module.exports = horarioLaboralService;