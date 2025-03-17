class ReconocimientoFacial {
    constructor(id_foto, fotografia_emple, id_usuario) {
        this.id_foto = id_foto;
        this.fotografia_emple = fotografia_emple; // Debería ser un Buffer si trabajas con BLOB
        this.id_usuario = id_usuario;
    }

    // Constructor vacío
    static nuevoReconocimientoFacial() {
        return new ReconocimientoFacial(null, null, null);
    }

    // Getters y Setters
    getIdFoto() { return this.id_foto; }
    setIdFoto(id) { this.id_foto = id; }

    getFotografiaEmple() { return this.fotografia_emple; }
    setFotografiaEmple(foto) { this.fotografia_emple = foto; }

    getIdUsuario() { return this.id_usuario; }
    setIdUsuario(idUsuario) { this.id_usuario = idUsuario; }

    // Método toString
    toString() {
        return `ReconocimientoFacial [ID Foto: ${this.id_foto}, ID Usuario: ${this.id_usuario}]`;
    }
}

module.exports = ReconocimientoFacial;
