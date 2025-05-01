class ReconocimientoFacial:
    def __init__(self, id_foto=None, fotografia_emple=None, id_usuario=None):
        self.id_foto = id_foto
        self.fotografia_emple = fotografia_emple  # En formato BLOB (bytes)
        self.id_usuario = id_usuario

    def __str__(self):
        return f"<ReconocimientoFacial id_foto={self.id_foto} id_usuario={self.id_usuario}>"
