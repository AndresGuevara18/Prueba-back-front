class NoAsistencia {
  constructor(id_inasistencia, id_usuario, fecha, motivo) {
    this.id_inasistencia = id_inasistencia;
    this.id_usuario = id_usuario;
    this.fecha = fecha;
    this.motivo = motivo;
  }

  // Getters y Setters
  getIdInasistencia() { return this.id_inasistencia; }
  setIdInasistencia(id) { this.id_inasistencia = id; }

  getIdUsuario() { return this.id_usuario; }
  setIdUsuario(idUsuario) { this.id_usuario = idUsuario; }

  getFecha() { return this.fecha; }
  setFecha(fecha) { this.fecha = fecha; }

  getMotivo() { return this.motivo; }
  setMotivo(motivo) { this.motivo = motivo; }

  // Método toString
  toString() {
    return `NoAsistencia [ID: ${this.id_inasistencia}, IDUsuario: ${this.id_usuario}, Fecha: ${this.fecha}, Motivo: ${this.motivo}]`;
  }
}

module.exports = NoAsistencia;