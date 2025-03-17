class Usuario {
    constructor(id_usuario, tipo_documento, numero_documento, nombre_empleado, email_empleado, contrasena, id_cargo) {
        this.id_usuario = id_usuario;
        this.tipo_documento = tipo_documento;
        this.numero_documento = numero_documento;
        this.nombre_empleado = nombre_empleado;
        this.email_empleado = email_empleado;
        this.contrasena = contrasena;
        this.id_cargo = id_cargo;
    }

    // Constructor vacío
    static nuevoUsuario() {
        return new Usuario(null, "", "", "", "", "", null);
    }

    // Getters y Setters
    getIdUsuario() { return this.id_usuario; }
    setIdUsuario(id) { this.id_usuario = id; }

    getTipoDocumento() { return this.tipo_documento; }
    setTipoDocumento(tipo) { this.tipo_documento = tipo; }

    getNumeroDocumento() { return this.numero_documento; }
    setNumeroDocumento(numero) { this.numero_documento = numero; }

    getNombreEmpleado() { return this.nombre_empleado; }
    setNombreEmpleado(nombre) { this.nombre_empleado = nombre; }

    getEmailEmpleado() { return this.email_empleado; }
    setEmailEmpleado(email) { this.email_empleado = email; }

    getContrasena() { return this.contrasena; }
    setContrasena(contra) { this.contrasena = contra; }

    getIdCargo() { return this.id_cargo; }
    setIdCargo(idCargo) { this.id_cargo = idCargo; }

    // Método toString
    toString() {
        return `Usuario [ID: ${this.id_usuario}, Nombre: ${this.nombre_empleado}, Email: ${this.email_empleado}]`;
    }
}

module.exports = Usuario;