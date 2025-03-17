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
            res.status(500).json({ error: "Error al obtener los cargos" });
        }
    }, 

    //cargo por ID
    getCargoById: async (req, res) => {
        try {
            const { id_cargo } = req.params; // ID de los parámetros de la URL
            const cargo = await cargoService.getCargoById(id_cargo); // Llamar al servicio

            if (!cargo) {
                return res.status(404).json({ error: "Cargo no encontrado" }); // Si no se encuentra
            }

            res.json(cargo); // Si se encuentra, se envia formato json
        } catch (error) {
            res.status(500).json({ error: "Error al buscar el cargo en el controlador" });
        }
    },

    // Método para agregar un nuevo cargo
    createCargo: async (req, res) => {
        try {
            const { nombre_cargo, descripcion } = req.body; // Extraemos datos del cuerpo de la solicitud
            const nuevoCargo = new Cargo(null, nombre_cargo, descripcion); // Creamos una instancia de Cargo con los datos

            const cargoCreado = await cargoService.createCargo(nuevoCargo); // Llamamos al servicio para crear el cargo

            res.status(201).json({
                message: "✅ Cargo agregado correctamente",
                cargo: cargoCreado, // Enviamos el nuevo cargo creado
                redirect: "/cargo.html" // URL a la que se redirigirá el usuario
            });
        } catch (error) {
            res.status(500).json({ error: "Error al crear el cargo" }); // Manejo de errores
        }
    },

    // Método para actualizar un cargo
    updateCargo: async (req, res) => {
        try {
            const { id_cargo } = req.params;//id de la  api 
            const { nombre_cargo, descripcion } = req.body;//cuerpo de la solicitud "put"
        
            if (!nombre_cargo || !descripcion) {
                return res.status(400).json({ error: "Todos los campos son obligatorios" });
            }
        
            const resultado = await cargoService.updateCargo(id_cargo, nombre_cargo, descripcion);
        
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Cargo no encontrado" });
            }
        
            res.json({ message: "Cargo actualizado correctamente" });
        } catch (error) {
            console.error("❌ Error en updateCargo:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    // Método para eliminar un cargo
    deleteCargo: async (req, res) => {
        try {
            const { id_cargo } = req.params; // Extraer el ID del cargo desde la URL
            const resultado = await cargoService.deleteCargo(id_cargo); // Llamamos al servicio

            if (resultado?.error) {
                return res.status(400).json({ error: resultado.error }); // Enviar mensaje de error al usuario
            }

            if (!resultado) {
                return res.status(404).json({ error: "❌ Cargo no encontrado" }); // Si no existe, error 404
            }

            res.json(resultado); // Enviar mensaje de éxito
        } catch (error) {
            res.status(500).json({ error: "❌ Error interno al eliminar el cargo" }); // Manejo de errores internos
        }
    }
};

// Exporta el objeto para ser utilizado en otros archivos
module.exports = cargoController;
