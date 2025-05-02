# src/models/reconocimiento_facial.py

class ReconocimientoFacial:
    def __init__(self, id_foto=None, embedding=None, id_usuario=None):
        self.id_foto = id_foto
        self.embedding = embedding
        self.id_usuario = id_usuario

    def __str__(self):
        return f"ReconocimientoFacial [ID Foto: {self.id_foto}, ID Usuario: {self.id_usuario}, Embedding: {self.embedding[:30]}...]"

    @staticmethod
    def nuevo_reconocimiento_facial():
        return ReconocimientoFacial()
