class Usuario {
  constructor( id_usuario, tipo_documento, numero_documento, nombre_empleado, direccion_empleado, 
    telefono_empleado, email_empleado, eps_empleado, usuarioadmin, contrasenia, id_cargo) {
    this.id_usuario = id_usuario;
    this.tipo_documento = tipo_documento;
    this.numero_documento = numero_documento;
    this.nombre_empleado = nombre_empleado;
    this.direccion_empleado = direccion_empleado;
    this.telefono_empleado = telefono_empleado;
    this.email_empleado = email_empleado;
    this.eps_empleado = eps_empleado;
    this.usuarioadmin = usuarioadmin;
    this.contrasenia = contrasenia;
    this.id_cargo = id_cargo;
  }

  // Constructor vacío
  static nuevoUsuario() {
    return new Usuario(
      null, '', '', '', '', '', '', '', '', '', null,
    );
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

  getDireccionEmpleado() { return this.direccion_empleado; }
  setDireccionEmpleado(direccion) { this.direccion_empleado = direccion; }

  getTelefonoEmpleado() { return this.telefono_empleado; }
  setTelefonoEmpleado(telefono) { this.telefono_empleado = telefono; }

  getEmailEmpleado() { return this.email_empleado; }
  setEmailEmpleado(email) { this.email_empleado = email; }

  getEpsEmpleado() { return this.eps_empleado; }
  setEpsEmpleado(eps) { this.eps_empleado = eps; }

  getUsuarioadmin() { return this.usuarioadmin; }
  setUsuarioadmin(usuario) { this.usuarioadmin = usuario; }

  getContrasenia() { return this.contrasenia; }
  setContrasenia(contra) { this.contrasenia = contra; }

  getIdCargo() { return this.id_cargo; }
  setIdCargo(idCargo) { this.id_cargo = idCargo; }

  // Método toString
  toString() {
    return `Usuario [ID: ${this.id_usuario}, Nombre: ${this.nombre_empleado}, Email: ${this.email_empleado}, Usuario Admin: ${this.usuarioadmin}]`;
  }
}

module.exports = Usuario;