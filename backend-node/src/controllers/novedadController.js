// backend-node\src\controllers\novedadController.js
const NovedadService = require('../services/novedadServices');

class NovedadController {
  static async getAllNovedades(req, res) {
    const { filtro } = req.query; // Capturar el parámetro de filtro de la query
    try {
      const novedades = await NovedadService.getAllNovedades(filtro);
      // Siempre devolver 200, incluso si no hay novedades
      res.status(200).json(novedades);
    } catch (error) {
      console.error('Error en NovedadController.getAllNovedades:', error);
      res.status(500).json({ message: 'Error al obtener las novedades', error: error.message });
    }
  }
}

module.exports = NovedadController;