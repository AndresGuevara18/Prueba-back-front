# src/services/reconocimiento_service.py

from src.config.db import get_connection
from src.models.reconocimiento_facial import ReconocimientoFacial

def obtener_todos_reconocimientos():
    conexion = get_connection()
    reconocimientos = []

    if conexion:
        try:
            cursor = conexion.cursor()
            cursor.execute("SELECT id_foto, fotografia_emple, id_usuario FROM reconocimiento_facial")
            resultados = cursor.fetchall()

            for fila in resultados:
                reconocimientos.append(ReconocimientoFacial(*fila))
        except Exception as e:
            print(f"❌ Error al obtener reconocimientos: {e}")
        finally:
            cursor.close()
            conexion.close()

    return reconocimientos
