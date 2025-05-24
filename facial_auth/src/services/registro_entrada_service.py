# src/services/registro_entrada_service.py

from src.config.db import get_connection
from datetime import datetime
import json

# -----------------------------------------
# 1. Buscar usuario + embedding por documento
# -----------------------------------------
def obtener_usuario_y_embedding_por_documento(numero_documento):
    connection = None  # Añade esto al inicio de cada función
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
# 2. Verificar registro hoy
# -----------------------------------------
def verificar_registro_hoy(id_usuario):
    connection = None  # Añade esto al inicio de cada función
    """Verifica si el usuario ya tiene un registro hoy"""
    try:
        connection = get_connection()
        if connection is None:
            raise Exception("Sin conexión a la base de datos")

        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT COUNT(*) AS conteo 
            FROM registro_entrada 
            WHERE id_usuario = %s 
            AND DATE(fecha_hora) = CURDATE()
        """

        cursor.execute(query, (id_usuario,))
        result = cursor.fetchone()

        return result['conteo'] > 0

    except Exception as e:
        print(f"❌ Error al verificar registro: {e}")
        return True  # Por seguridad, asumir que ya está registrado si hay error
    finally:
        if connection:
            connection.close()

# -----------------------------------------
# 3. Registrar entrada en la tabla
# -----------------------------------------
def registrar_entrada(id_usuario, comentarios=""):
    """Registra la entrada solo si no hay registro hoy"""
    connection = None  # Añade esto al inicio de cada función
    try:
        # Primero verificar si ya existe registro hoy
        if verificar_registro_hoy(id_usuario):
            mensaje = f"⚠️ Usuario {id_usuario} ya registró entrada hoy"
            print(mensaje)
            return {"success": False, "message": mensaje}

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

        mensaje = f"✅ Entrada registrada correctamente para usuario {id_usuario} a las {fecha_actual}"
        print(mensaje)
        return {
            "success": True,
            "message": mensaje,
            "id_registro": cursor.lastrowid
        }

    except Exception as e:
        mensaje = f"❌ Error al registrar entrada: {e}"
        print(mensaje)
        return {"success": False, "message": mensaje}
    finally:
        if connection:
            connection.close()