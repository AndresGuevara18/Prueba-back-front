class RegistroEntrada {
  constructor(id_entrada, fecha_hora, comentarios, id_usuario) {
    this.id_entrada = id_entrada;
    this.fecha_hora = fecha_hora;
    this.comentarios = comentarios;
    this.id_usuario = id_usuario;
  }

  // Getters y Setters
  getIdEntrada() { return this.id_entrada; }
  setIdEntrada(id) { this.id_entrada = id; }

  getFechaHora() { return this.fecha_hora; }
  setFechaHora(fechaHora) { this.fecha_hora = fechaHora; }

  getComentarios() { return this.comentarios; }
  setComentarios(comentarios) { this.comentarios = comentarios; }

  getIdUsuario() { return this.id_usuario; }
  setIdUsuario(idUsuario) { this.id_usuario = idUsuario; }

  // Método toString
  toString() {
    return `RegistroEntrada [ID: ${this.id_entrada}, FechaHora: ${this.fecha_hora}, Comentarios: ${this.comentarios}, ID Usuario: ${this.id_usuario}]`;
  }
}

module.exports = RegistroEntrada;