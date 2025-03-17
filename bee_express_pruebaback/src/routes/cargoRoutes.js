const express = require('express'); // Importa Express
const cargoController = require('../controllers/cargoController'); // Importa el controlador de Cargo

const router = express.Router(); // Crea un enrutador con Express.Router()

// Ruta para obtener todos los cargos
router.get('/', cargoController.getAllCargos);

//ruta agregar cargo
router.post('/', cargoController.createCargo);

// Ruta para obtener un cargo por su ID
router.get('/:id_cargo', cargoController.getCargoById);

// Ruta para actualizar un cargo
router.put('/:id_cargo', cargoController.updateCargo);

// Ruta para eliminar un cargo
router.delete('/:id_cargo', cargoController.deleteCargo);

// Exporta el enrutador para ser usado en otros archivos
module.exports = router;
