# src/models/registro_salida.py

class RegistroSalida:
    def __init__(self, id_salida=None, fecha_hora=None, comentarios=None, id_usuario=None):
        self.id_salida = id_salida
        self.fecha_hora = fecha_hora
        self.comentarios = comentarios
        self.id_usuario = id_usuario

    def __str__(self):
        return f"RegistroSalida [ID: {self.id_salida}, Fecha: {self.fecha_hora}, Usuario: {self.id_usuario}]"

    @staticmethod
    def nuevo_registro(fecha_hora, id_usuario, comentarios=None):
        return RegistroSalida(
            fecha_hora=fecha_hora,
            comentarios=comentarios,
            id_usuario=id_usuario
        )