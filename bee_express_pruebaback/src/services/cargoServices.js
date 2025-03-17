const db = require('../config/database'); // Importa la conexión a la base de datos
const Cargo = require('../models/cargoModel'); // Importa el modelo Cargo

const cargoService = {
    // Obtener todos los cargos
    getAllCargos: async () => {
        const query = 'SELECT * FROM cargo'; 
        try {
            const [results] = await db.promise().query(query); // Ejecutar la consulta con promesas
            // Converti cada fila del resultado en una instancia de Cargo
            return results.map(row => new Cargo(row.id_cargo, row.nombre_cargo, row.descripcion)); 
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
            console.log("Resultados de la consulta nuemro empleados:", totalUsuarios);
    
            return {
                id_cargo: cargoResults[0].id_cargo,
                nombre_cargo: cargoResults[0].nombre_cargo,
                descripcion: cargoResults[0].descripcion,
                total_usuarios: totalUsuarios
            };
        } catch (err) {
            throw err; 
        }
    },

   // Crear 
   createCargo: async (cargoData) => {
    const query = 'INSERT INTO cargo (nombre_cargo, descripcion) VALUES (?, ?)'; 
    try {
        // Insertar valores usando los getters
        const [result] = await db.promise().query(query, [cargoData.getNombreCargo(), cargoData.getDescripcion()]);
        // Crea un nuevo objeto con el ID generado
        return new Cargo(result.insertId, cargoData.getNombreCargo(), cargoData.getDescripcion());
  
    } catch (err) {
        console.error("❌ Error en createCargo (Service):", err);
        throw err; // error
    }
    },

    //actualizar
    updateCargo: async (id_cargo, nombre_cargo, descripcion) => {
        const query = `UPDATE cargo SET nombre_cargo = ?, descripcion = ? WHERE id_cargo = ?`;
       
        try {
            const [result] = await db.promise().query(query, [nombre_cargo, descripcion, id_cargo]);
            return result; // Retorna el resultado de la consulta
        } catch (err) {
            console.error("❌ Error en updateCargo (Service):", err);
            throw err;
        }
    },

    deleteCargo: async (id_cargo) => {
        const query = `DELETE FROM cargo WHERE id_cargo = ? 
                AND NOT EXISTS (SELECT 1 FROM usuario WHERE id_cargo = ?)`;

        try {
            const [result] = await db.promise().query(query, [id_cargo, id_cargo]);
    
            if (result.affectedRows === 0) {
                return { error: "⚠️ No se puede eliminar porque hay usuarios asignados al cargo." };
            }
    
            return { message: "✅ Cargo eliminado correctamente" };
        } catch (err) {
            console.error("❌ Error en deleteCargo:", err);
            throw err;
        }
    }
};

// Exporta el servicio para que pueda ser utilizado en otros archivos
module.exports = cargoService;
