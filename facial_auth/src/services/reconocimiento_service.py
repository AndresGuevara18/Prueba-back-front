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
                reconocimiento = ReconocimientoFacial(
                    id_foto=fila[0],
                    fotografia_emple=fila[1],
                    id_usuario=fila[2]
                )
                reconocimientos.append(reconocimiento)

        except Exception as e:
            print(f"❌ Error al obtener datos: {e}")
        finally:
            cursor.close()
            conexion.close()

    return reconocimientos


# reconocimiento_service.py
def obtener_foto_por_id_usuario(id_usuario: int):
    conexion = get_connection()
    if conexion:
        try:
            cursor = conexion.cursor()
            cursor.execute(
                "SELECT id_foto, fotografia_emple, id_usuario FROM reconocimiento_facial WHERE id_usuario = %s",
                (id_usuario,)
            )
            fila = cursor.fetchone()
            if fila:
                return ReconocimientoFacial(
                    id_foto=fila[0],
                    fotografia_emple=fila[1],
                    id_usuario=fila[2]
                )
            return None
        except Exception as e:
            print(f"Error al obtener foto por ID usuario: {e}")
            return None
        finally:
            cursor.close()
            conexion.close()