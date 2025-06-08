// src/models/horarioModel.js
class HorarioLaboral {
  constructor(id_horario, hora_entrada, hora_salida, descripcion) {
    this.id_horario = id_horario;
    this.hora_entrada = hora_entrada;
    this.hora_salida = hora_salida;
    this.descripcion = descripcion;
  }

  // Constructor vacío
  static nuevoHorarioLaboral() {
    return new HorarioLaboral(null, null, null, '');
  }

  // Getters y Setters
  getIdHorario() { return this.id_horario; }
  setIdHorario(id) { this.id_horario = id; }

  getHoraEntrada() { return this.hora_entrada; }
  setHoraEntrada(hora) { this.hora_entrada = hora; }

  getHoraSalida() { return this.hora_salida; }
  setHoraSalida(hora) { this.hora_salida = hora; }

  getDescripcion() { return this.descripcion; }
  setDescripcion(desc) { this.descripcion = desc; }

  // Método toString
  toString() {
    return `HorarioLaboral [ID: ${this.id_horario}, Entrada: ${this.hora_entrada}, Salida: ${this.hora_salida}, Descripción: ${this.descripcion}]`;
  }
}

module.exports = HorarioLaboral;