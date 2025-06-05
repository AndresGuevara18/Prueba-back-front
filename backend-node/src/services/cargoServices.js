//src/services/cargoServices.js
const db = require('../config/database'); // Importa la conexión a la base de datos
const Cargo = require('../models/cargoModel'); // Importa el modelo Cargo

const cargoService = {
  // Obtener todos los cargos
  getAllCargos: async () => {
    const query = 'SELECT * FROM cargo'; 
    try {
      const [results] = await db.promise().query(query); // Ejecutar la consulta con promesas
      // Converti cada fila del resultado en una instancia de Cargo
      return results.map(row => new Cargo(row.id_cargo, row.nombre_cargo, row.descripcion, row.id_horario)); 
    } catch (err) {
      throw err; // error,lo maneje el controlador
    }
  },

  // Obtener un cargo por ID
  getCargoById: async (id_cargo) => {
    const queryCargo = 'SELECT * FROM cargo WHERE id_cargo = ?'; 
    const queryUserCount = 'SELECT COUNT(*) AS total_usuarios FROM usuario WHERE id_cargo = ?';
    
    try {
      const [cargoResults] = await db.promise().query(queryCargo, [id_cargo]); 
      if (cargoResults.length === 0) return null; // Si no existe el cargo, retorna null
    
      const [countResults] = await db.promise().query(queryUserCount, [id_cargo]); 
      const totalUsuarios = countResults[0].total_usuarios;
      console.log('Resultados de la consulta nuemro empleados:', totalUsuarios);
    
      return {
        id_cargo: cargoResults[0].id_cargo,
        nombre_cargo: cargoResults[0].nombre_cargo,
        descripcion: cargoResults[0].descripcion,
        id_horario: cargoResults[0].id_horario,
        total_usuarios: totalUsuarios,
      };
    } catch (err) {
      throw err; 
    }
  },

  // Crear 
  createCargo: async (cargoData) => {
    const query = 'INSERT INTO cargo (nombre_cargo, descripcion, id_horario) VALUES (?, ?, ?)'; 
    try {
      // Insertar valores usando los getters
      const [result] = await db.promise().query(query, [cargoData.getNombreCargo(), cargoData.getDescripcion(), cargoData.getIdHorario()]);
      // Crea un nuevo objeto con el ID generado
      return new Cargo(result.insertId, cargoData.getNombreCargo(), cargoData.getDescripcion(), cargoData.getIdHorario());
  
    } catch (err) {
      console.error('❌ Error en createCargo (Service):', err);
      throw err; // error
    }
  },

  //actualizar
  updateCargo: async (id_cargo, nombre_cargo, descripcion, id_horario) => {
    // Validar existencia del horario antes de actualizar
    const horarioExiste = await cargoService.horarioExists(id_horario);
    if (!horarioExiste) {
      // Retornar un objeto especial para que el controlador lo maneje
      return { error: '❌ El horario proporcionado no existe', alert: true };
    }
    const query = 'UPDATE cargo SET nombre_cargo = ?, descripcion = ?, id_horario = ? WHERE id_cargo = ?';
       
    try {
      const [result] = await db.promise().query(query, [nombre_cargo, descripcion, id_horario, id_cargo]);
      return result; // Retorna el resultado de la consulta
    } catch (err) {
      console.error('❌ Error en updateCargo (Service):', err);
      throw err;
    }
  },

  deleteCargo: async (id_cargo) => {
    const queryCheckCargo = 'SELECT id_cargo FROM cargo WHERE id_cargo = ?';
    const queryCheckUsers = 'SELECT COUNT(*) AS total FROM usuario WHERE id_cargo = ?';
    const queryDelete = 'DELETE FROM cargo WHERE id_cargo = ?';
    
    try {
      // Verificar si el cargo existe antes de eliminar
      const [cargoResult] = await db.promise().query(queryCheckCargo, [parseInt(id_cargo)]);
      if (cargoResult.length === 0) {
        console.log(`❌ Cargo con ID ${id_cargo} no encontrado en la base de datos.`);
        return { exists: false };
      }
    
      // Verificar si hay usuarios asignados al cargo
      const [userResult] = await db.promise().query(queryCheckUsers, [parseInt(id_cargo)]);
      if (userResult[0].total > 0) {
        console.log(`⚠️ No se puede eliminar el cargo ${id_cargo}, tiene ${userResult[0].total} usuarios asignados.`);
        return { exists: true, hasUsers: true };
      }
    
      // Intentar eliminar el cargo
      const [deleteResult] = await db.promise().query(queryDelete, [parseInt(id_cargo)]);
    
      if (deleteResult.affectedRows > 0) {
        console.log(`✅ Cargo con ID ${id_cargo} eliminado correctamente.`);
        return { exists: true, deleted: true };
      } else {
        console.log(`⚠️ Cargo con ID ${id_cargo} no se eliminó.`);
        return { exists: true, deleted: false };
      }
    } catch (err) {
      console.error('❌ Error en deleteCargo (Service):', err);
      throw err;
    }
  },

  // Verificar si existe un horario laboral por id
  horarioExists: async (id_horario) => {
    const query = 'SELECT COUNT(*) AS count FROM horario_laboral WHERE id_horario = ?';
    try {
      const [results] = await db.promise().query(query, [id_horario]);
      return results[0].count > 0;
    } catch (err) {
      console.error('❌ Error en horarioExists (Service):', err);
      throw err;
    }
  },
};

// Exporta el servicio para que pueda ser utilizado en otros archivos
module.exports = cargoService;
