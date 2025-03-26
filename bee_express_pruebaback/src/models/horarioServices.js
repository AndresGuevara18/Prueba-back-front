class Horario {
    constructor(id, cargo_id, hora_entrada, hora_salida, dias_semana, fecha_creacion, fecha_actualizacion) {
        this.id = id;
        this.cargo_id = cargo_id;
        this.hora_entrada = hora_entrada;
        this.hora_salida = hora_salida;
        this.dias_semana = dias_semana;
        this.fecha_creacion = fecha_creacion;
        this.fecha_actualizacion = fecha_actualizacion;
    }


    // Constructor vacío
    static nuevoHorario() {
        return new Horario(null, null, "", "", "", new Date(), new Date());
    }

    // Getters y Setters
    getId() { return this.id; }
    setId(id) { this.id = id; }

    getCargoId() { return this.cargo_id; }
    setCargoId(cargo_id) { this.cargo_id = cargo_id; }

    getHoraEntrada() { return this.hora_entrada; }
    setHoraEntrada(hora_entrada) { this.hora_entrada = hora_entrada; }

    getHoraSalida() { return this.hora_salida; }
    setHoraSalida(hora_salida) { this.hora_salida = hora_salida; }

    getDiasSemana() { return this.dias_semana; }
    setDiasSemana(dias_semana) { this.dias_semana = dias_semana; }

    getFechaCreacion() { return this.fecha_creacion; }
    setFechaCreacion(fecha_creacion) { this.fecha_creacion = fecha_creacion; }

    getFechaActualizacion() { return this.fecha_actualizacion; }
    setFechaActualizacion(fecha_actualizacion) { this.fecha_actualizacion = fecha_actualizacion; }

    // Método toString
    toString() {
        return `Horario [ID: ${this.id}, Cargo ID: ${this.cargo_id}, Hora Entrada: ${this.hora_entrada}, ` +
            `Hora Salida: ${this.hora_salida}, Días Semana: ${this.dias_semana}, ` +
            `Fecha Creación: ${this.fecha_creacion}, Fecha Actualización: ${this.fecha_actualizacion}]`;
    }
}

module.exports = Horario;