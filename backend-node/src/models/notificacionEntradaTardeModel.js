class NotificacionEntradaTarde {
  constructor(id_notificacion, id_entrada, id_usuario, estado, fecha_hora, comentarios) {
    this.id_notificacion = id_notificacion;
    this.id_entrada = id_entrada;
    this.id_usuario = id_usuario;
    this.estado = estado;
    this.fecha_hora = fecha_hora;
    this.comentarios = comentarios;
  }

  // Getters y Setters
  getIdNotificacion() { return this.id_notificacion; }
  setIdNotificacion(id) { this.id_notificacion = id; }

  getIdEntrada() { return this.id_entrada; }
  setIdEntrada(idEntrada) { this.id_entrada = idEntrada; }

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
    return `NotificacionEntradaTarde [ID: ${this.id_notificacion}, IDEntrada: ${this.id_entrada}, IDUsuario: ${this.id_usuario}, Estado: ${this.estado}, FechaHora: ${this.fecha_hora}, Comentarios: ${this.comentarios}]`;
  }
}

module.exports = NotificacionEntradaTarde;