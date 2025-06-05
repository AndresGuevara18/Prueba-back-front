//src/models/cargoModel.js
class Cargo {
  constructor(id_cargo, nombre_cargo, descripcion, id_horario) {
    this.id_cargo = id_cargo;
    this.nombre_cargo = nombre_cargo;
    this.descripcion = descripcion;
    this.id_horario = id_horario;
  }

  // Constructor vacío
  static nuevoCargo() {
    return new Cargo(null, '', '', null);
  }

  // Getters y Setters
  getIdCargo() { return this.id_cargo; }
  setIdCargo(id) { this.id_cargo = id; }

  getNombreCargo() { return this.nombre_cargo; }
  setNombreCargo(nombre) { this.nombre_cargo = nombre; }

  getDescripcion() { return this.descripcion; }
  setDescripcion(desc) { this.descripcion = desc; }

  getIdHorario() { return this.id_horario; }
  setIdHorario(id_horario) { this.id_horario = id_horario; }

  // Método toString
  toString() {
    return `Cargo [ID: ${this.id_cargo}, Nombre: ${this.nombre_cargo}, Descripción: ${this.descripcion}, ID Horario: ${this.id_horario}]`;
  }
}

module.exports = Cargo;
