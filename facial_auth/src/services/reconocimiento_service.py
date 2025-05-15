# src/services/reconocimiento_service.py

from src.config.db import get_connection
from datetime import datetime
import json

# -----------------------------------------
# 1. Buscar usuario + embedding por documento
# -----------------------------------------
def obtener_usuario_y_embedding_por_documento(numero_documento):
    try:
        connection = get_connection()
        if connection is None:
            raise Exception("Sin conexión a la base de datos")

        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT rf.id_usuario, rf.embedding
            FROM reconocimiento_facial rf
            JOIN usuario u ON rf.id_usuario = u.id_usuario
            WHERE u.numero_documento = %s
        """

        cursor.execute(query, (numero_documento,))
        result = cursor.fetchone()

        if result:
            print(f"✅ Usuario con documento {numero_documento} encontrado: ID {result['id_usuario']}")
            return {
                "id_usuario": result["id_usuario"],
                "embedding": json.loads(result["embedding"])  # Convertir de texto a lista
            }
        else:
            print(f"⚠️ No se encontró embedding para el documento {numero_documento}")
            return None

    except Exception as e:
        print(f"❌ Error al obtener usuario y embedding: {e}")
        return None

    finally:
        if connection:
            connection.close()

# -----------------------------------------
# 2. Registrar entrada en la tabla
# -----------------------------------------
def registrar_entrada(id_usuario, comentarios="Registro desde escaneo facial"):
    try:
        connection = get_connection()
        if connection is None:
            raise Exception("Sin conexión a la base de datos")

        cursor = connection.cursor()

        fecha_actual = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        insert_query = """
            INSERT INTO registro_entrada (fecha_hora, comentarios, id_usuario)
            VALUES (%s, %s, %s)
        """

        cursor.execute(insert_query, (fecha_actual, comentarios, id_usuario))
        connection.commit()

        print(f"✅ Entrada registrada correctamente para usuario {id_usuario} a las {fecha_actual}")
        return cursor.lastrowid  # Devuelve el ID generado

    except Exception as e:
        print(f"❌ Error al registrar entrada: {e}")
        return None

    finally:
        if connection:
            connection.close()
