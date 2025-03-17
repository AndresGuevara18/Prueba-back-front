class Cargo {
    constructor(id_cargo, nombre_cargo, descripcion) {
        this.id_cargo = id_cargo;
        this.nombre_cargo = nombre_cargo;
        this.descripcion = descripcion;
    }

    // Constructor vacío
    static nuevoCargo() {
        return new Cargo(null, "", "");
    }

    // Getters y Setters
    getIdCargo() { return this.id_cargo; }
    setIdCargo(id) { this.id_cargo = id; }

    getNombreCargo() { return this.nombre_cargo; }
    setNombreCargo(nombre) { this.nombre_cargo = nombre; }

    getDescripcion() { return this.descripcion; }
    setDescripcion(desc) { this.descripcion = desc; }

    // Método toString
    toString() {
        return `Cargo [ID: ${this.id_cargo}, Nombre: ${this.nombre_cargo}, Descripción: ${this.descripcion}]`;
    }
}

module.exports = Cargo;
