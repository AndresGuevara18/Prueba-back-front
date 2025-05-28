# src/models/registro_entrada.py

class RegistroEntrada:
    def __init__(self, id_entrada=None, fecha_hora=None, comentarios=None, id_usuario=None):
        self.id_entrada = id_entrada
        self.fecha_hora = fecha_hora
        self.comentarios = comentarios
        self.id_usuario = id_usuario

    def __str__(self):
        return f"RegistroEntrada [ID: {self.id_entrada}, Fecha: {self.fecha_hora}, Usuario: {self.id_usuario}]"

    @staticmethod
    def nuevo_registro(fecha_hora, id_usuario, comentarios=None):
        return RegistroEntrada(
            fecha_hora=fecha_hora,
            comentarios=comentarios,
            id_usuario=id_usuario
        )
