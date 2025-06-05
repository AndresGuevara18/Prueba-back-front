// backend-node\src\models\novedadModel.js

/**
 * @swagger
 * components:
 *   schemas:
 *     Novedad:
 *       type: object
 *       properties:
 *         id_usuario:
 *           type: integer
 *           description: ID del usuario.
 *           example: 1
 *         nombre_usuario:
 *           type: string
 *           description: Nombre completo del usuario.
 *           example: "Juan Perez"
 *         tipo_novedad:
 *           type: string
 *           description: Tipo de novedad (Entrada Tarde, Salida Temprana, Inasistencia, Registro Entrada, Registro Salida).
 *           example: "Entrada Tarde"
 *         fecha_hora:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de la novedad.
 *           example: "2024-07-31T08:30:00Z"
 *         detalle:
 *           type: string
 *           description: Detalle adicional de la novedad (e.g., justificación, observación).
 *           example: "Llegó 30 minutos tarde."
 */
class Novedad {
  constructor(id_usuario, nombre_usuario, tipo_novedad, fecha_hora, detalle) {
    this.id_usuario = id_usuario;
    this.nombre_usuario = nombre_usuario;
    this.tipo_novedad = tipo_novedad;
    this.fecha_hora = fecha_hora;
    this.detalle = detalle;
  }
}

module.exports = Novedad;