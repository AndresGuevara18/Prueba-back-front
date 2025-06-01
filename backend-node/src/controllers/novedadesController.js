const novedadesService = require('../services/novedadesService');

exports.getNovedades = async (req, res, next) => {
    try {
        // Extraer todos los parámetros relevantes de req.query
        const { searchTerm, periodo, page, limit } = req.query;

        // Construir el objeto queryParams para el servicio
        // Asegurarse de que los nombres coincidan con lo que espera el servicio
        // El frontend ya envía 'periodo', 'searchTerm', 'page', 'limit'.
        const queryParams = {
            searchTerm,
            periodo, // El frontend envía 'periodo', el servicio espera 'periodo'
            page,
            limit
        };

        const novedades = await novedadesService.getCombinedNovelties(queryParams);
        res.status(200).json(novedades);
    } catch (error) {
        console.error('Error en getNovedades controller:', error);
        next(error);
    }
};
