# src/services/registro_entrada_service.py

from src.config.db import get_connection
from datetime import datetime
import json
from src.models.registro_entrada import RegistroEntrada

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
# 3. obetener hora de entrada por documento
# -----------------------------------------
def obtener_hora_entrada_por_documento(numero_documento):
    """
    Obtiene la hora de entrada (TIME) del horario asociado al usuario por su documento.
    Retorna None si no encuentra el usuario o el horario.
    """
    connection = None
    try:
        print(f"🔎 Buscando hora de entrada para documento: {numero_documento}")
        connection = get_connection()
        if connection is None:
            print("❌ Sin conexión a la base de datos")
            return None

        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT h.hora_entrada
            FROM usuario u
            JOIN cargo c ON u.id_cargo = c.id_cargo
            JOIN horario_laboral h ON c.id_horario = h.id_horario
            WHERE u.numero_documento = %s
        """
        cursor.execute(query, (numero_documento,))
        result = cursor.fetchone()
        if result:
            print(f"✅ Hora de entrada encontrada: {result['hora_entrada']}")
            return result['hora_entrada']  # tipo datetime.time
        else:
            print(f"⚠️ No se encontró horario para el documento {numero_documento}")
            return None
    except Exception as e:
        print(f"❌ Error al obtener hora de entrada: {e}")
        return None
    finally:
        if connection:
            connection.close()
            print("🔒 Conexión a la base de datos cerrada")

# -----------------------------------------
# 4. Registrar entrada en la tabla
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

        # Crear instancia del modelo
        nuevo_registro = RegistroEntrada.nuevo_registro(
            fecha_hora=fecha_actual,
            id_usuario=id_usuario,
            comentarios=comentarios
        )

        insert_query = """
            INSERT INTO registro_entrada (fecha_hora, comentarios, id_usuario)
            VALUES (%s, %s, %s)
        """

        cursor.execute(insert_query, (
            nuevo_registro.fecha_hora,
            nuevo_registro.comentarios,
            nuevo_registro.id_usuario
        ))
        connection.commit()

        # Asignar el ID generado al modelo
        nuevo_registro.id_entrada = cursor.lastrowid

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