class NotificacionSalidaTemprana {
  constructor(id_notificacion, id_salida, id_usuario, estado, fecha_hora, comentarios) {
    this.id_notificacion = id_notificacion;
    this.id_salida = id_salida;
    this.id_usuario = id_usuario;
    this.estado = estado;
    this.fecha_hora = fecha_hora;
    this.comentarios = comentarios;
  }

  // Getters y Setters
  getIdNotificacion() { return this.id_notificacion; }
  setIdNotificacion(id) { this.id_notificacion = id; }

  getIdSalida() { return this.id_salida; }
  setIdSalida(idSalida) { this.id_salida = idSalida; }

  getIdUsuario() { return this.id_usuario; }
  setIdUsuario(idUsuario) { this.id_usuario = idUsuario; }

  getEstado() { return this.estado; }
  setEstado(estado) { this.estado = estado; }

  getFechaHora() { return this.fecha_hora; }
  setFechaHora(fechaHora) { this.fecha_hora = fechaHora; }

  getComentarios() { return this.comentarios; }
  setComentarios(comentarios) { this.comentarios = comentarios; }

  // Método toString
  toString() {
    return `NotificacionSalidaTemprana [ID: ${this.id_notificacion}, IDSalida: ${this.id_salida}, IDUsuario: ${this.id_usuario}, Estado: ${this.estado}, FechaHora: ${this.fecha_hora}, Comentarios: ${this.comentarios}]`;
  }
}

module.exports = NotificacionSalidaTemprana;