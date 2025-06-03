// backend-node\src\controllers\novedadController.js
const NovedadService = require('../services/novedadServices');

class NovedadController {
    static async getAllNovedades(req, res) {
        try {
            const novedades = await NovedadService.getAllNovedades();
            if (novedades.length === 0) {
                return res.status(404).json({ message: 'No se encontraron novedades.' });
            }
            res.status(200).json(novedades);
        } catch (error) {
            console.error('Error en NovedadController.getAllNovedades:', error);
            res.status(500).json({ message: 'Error al obtener las novedades', error: error.message });
        }
    }
}

module.exports = NovedadController;