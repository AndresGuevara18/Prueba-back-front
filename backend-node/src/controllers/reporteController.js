const ReporteService = require('../services/reporteService');

class ReporteController {
  static async generarReporteAsistencia(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query; // O req.body, según cómo envíes los parámetros
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ message: 'Los parámetros fechaInicio y fechaFin son requeridos.' });
      }
      const reporte = await ReporteService.generarReporteAsistencia(fechaInicio, fechaFin);
      res.status(200).json(reporte);
    } catch (error) {
      console.error('Error en ReporteController.generarReporteAsistencia:', error);
      res.status(500).json({ message: 'Error al generar el reporte de asistencia', error: error.message });
    }
  }

  static async generarReporteLlegadasTarde(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ message: 'Los parámetros fechaInicio y fechaFin son requeridos.' });
      }
      const reporte = await ReporteService.generarReporteLlegadasTarde(fechaInicio, fechaFin);
      res.status(200).json(reporte);
    } catch (error) {
      console.error('Error en ReporteController.generarReporteLlegadasTarde:', error);
      res.status(500).json({ message: 'Error al generar el reporte de llegadas tarde', error: error.message });
    }
  }

  static async generarReporteSalidasTemprano(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ message: 'Los parámetros fechaInicio y fechaFin son requeridos.' });
      }
      const reporte = await ReporteService.generarReporteSalidasTemprano(fechaInicio, fechaFin);
      res.status(200).json(reporte);
    } catch (error) {
      console.error('Error en ReporteController.generarReporteSalidasTemprano:', error);
      res.status(500).json({ message: 'Error al generar el reporte de salidas temprano', error: error.message });
    }
  }

  static async generarReporteAusencias(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.query;
      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({ message: 'Los parámetros fechaInicio y fechaFin son requeridos.' });
      }
      const reporte = await ReporteService.generarReporteAusencias(fechaInicio, fechaFin);
      res.status(200).json(reporte);
    } catch (error) {
      console.error('Error en ReporteController.generarReporteAusencias:', error);
      res.status(500).json({ message: 'Error al generar el reporte de ausencias', error: error.message });
    }
  }
}

module.exports = ReporteController;