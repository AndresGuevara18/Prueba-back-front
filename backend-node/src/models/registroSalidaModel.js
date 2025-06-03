class RegistroSalida {
  constructor(id_salida, fecha_hora, comentarios, id_usuario) {
    this.id_salida = id_salida;
    this.fecha_hora = fecha_hora;
    this.comentarios = comentarios;
    this.id_usuario = id_usuario;
  }

  // Getters y Setters
  getIdSalida() { return this.id_salida; }
  setIdSalida(id) { this.id_salida = id; }

  getFechaHora() { return this.fecha_hora; }
  setFechaHora(fechaHora) { this.fecha_hora = fechaHora; }

  getComentarios() { return this.comentarios; }
  setComentarios(comentarios) { this.comentarios = comentarios; }

  getIdUsuario() { return this.id_usuario; }
  setIdUsuario(idUsuario) { this.id_usuario = idUsuario; }

  // Método toString
  toString() {
    return `RegistroSalida [ID: ${this.id_salida}, FechaHora: ${this.fecha_hora}, Comentarios: ${this.comentarios}, ID Usuario: ${this.id_usuario}]`;
  }
}

module.exports = RegistroSalida;