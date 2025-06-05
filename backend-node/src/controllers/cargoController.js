//src/controllers/cargoController.js
const Cargo = require('../models/cargoModel');
const cargoService = require('../services/cargoServices'); // Importar el servicio de cargo

/*
req: Objeto de solicitud (request), que contiene datos enviados por el cliente.
res: Objeto de respuesta (response), que se usa para devolver una respuesta al cliente.
*/

// Objeto que contendrá los métodos del controlador
const cargoController = {

  //obtener todos los cargos
  getAllCargos: async (req, res) => {
    try {
      const cargos = await cargoService.getAllCargos(); // Llamar al servicio
      res.json(cargos); // Enviar la lista de cargos en formato JSON
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los cargos' });
    }
  }, 

  //cargo por ID
  getCargoById: async (req, res) => {
    try {
      const { id_cargo } = req.params; // ID de los parámetros de la URL
      const cargo = await cargoService.getCargoById(id_cargo); // Llamar al servicio

      if (!cargo) {
        return res.status(404).json({ error: 'Cargo no encontrado' }); // Si no se encuentra
      }

      res.json(cargo); // Si se encuentra, se envia formato json
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar el cargo en el controlador' });
    }
  },

  // Método para agregar un nuevo cargo
  createCargo: async (req, res) => {
    try {
      const { nombre_cargo, descripcion, id_horario } = req.body; // Extraemos datos del cuerpo de la solicitud
      if (!nombre_cargo || !descripcion || !id_horario) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }
      // Validar existencia del horario laboral
      const horarioExiste = await cargoService.horarioExists(id_horario);
      if (!horarioExiste) {
        return res.status(400).json({ error: '❌El horario no existe', alert: true });
      }
      const nuevoCargo = new Cargo(null, nombre_cargo, descripcion, id_horario); // Creamos una instancia de Cargo con los datos

      const cargoCreado = await cargoService.createCargo(nuevoCargo); // Llamamos al servicio para crear el cargo

      res.status(201).json({
        message: '✅ Cargo agregado correctamente',
        cargo: cargoCreado, // Enviamos el nuevo cargo creado
      });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el cargo' }); // Manejo de errores
    }
  },

  // Método para actualizar un cargo
  updateCargo: async (req, res) => {
    try {
      const { id_cargo } = req.params;
      const { nombre_cargo, descripcion, id_horario } = req.body;
      if (!nombre_cargo || !descripcion || !id_horario) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }
      // Lógica delegada al servicio: si el horario no existe, el servicio retorna un objeto especial
      const resultado = await cargoService.updateCargo(id_cargo, nombre_cargo, descripcion, id_horario);
      if (resultado && resultado.alert) {
        return res.status(400).json({ error: resultado.error, alert: true });
      }
      if (resultado.affectedRows === 0) {
        return res.status(404).json({ error: 'Cargo no encontrado' });
      }
      res.json({ message: 'Cargo actualizado correctamente' });
    } catch (error) {
      console.error('❌ Error en updateCargo:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  // Método para eliminar un cargo
  deleteCargo: async (req, res) => {
    try {
      const { id_cargo } = req.params; // Obtener el ID del cargo
      console.log('Controlador:  ',id_cargo);
      const resultado = await cargoService.deleteCargo(id_cargo); // Llamar al servicio
    
      if (!resultado.exists) {
        return res.status(404).json({ error: '❌ Cargo no encontrado.' }); // Error si no existe
      }
    
      if (resultado.hasUsers) {
        return res.status(400).json({ error: '⚠️ No se puede eliminar porque hay usuarios asignados al cargo.' }); // Error si tiene usuarios
      }
    
      if (resultado.deleted) {
        return res.status(200).json({ message: '✅ Cargo eliminado correctamente.' }); // Eliminado con éxito
      }
    
      res.status(400).json({ error: '⚠️ No se pudo eliminar el cargo.' }); // Error general si no se elimina
    } catch (error) {
      console.error('❌ Error en deleteCargo (Controller):', error);
      res.status(500).json({ error: '❌ Error interno al eliminar el cargo.' }); // Error interno
    }
  },
};

// Exporta el objeto para ser utilizado en otros archivos
module.exports = cargoController;
