class ReconocimientoFacial {
  constructor(id_foto, embedding, id_usuario) {
    this.id_foto = id_foto;
    this.embedding = embedding; // string en formato JSON o texto serializado
    this.id_usuario = id_usuario;
  }

  static nuevoReconocimientoFacial() {
    return new ReconocimientoFacial(null, null, null);
  }

  getIdFoto() { return this.id_foto; }
  setIdFoto(id) { this.id_foto = id; }

  getEmbedding() { return this.embedding; }
  setEmbedding(embedding) { this.embedding = embedding; }

  getIdUsuario() { return this.id_usuario; }
  setIdUsuario(idUsuario) { this.id_usuario = idUsuario; }

  toString() {
    return `ReconocimientoFacial [ID Foto: ${this.id_foto}, ID Usuario: ${this.id_usuario}]`;
  }
}

module.exports = ReconocimientoFacial;
