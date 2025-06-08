# src/services/registro_salida_service.py

from src.config.db import get_connection
from datetime import datetime
import json
from src.models.registro_salida import RegistroSalida

# -----------------------------------------
# 1. Buscar usuario + embedding por documento
# (Puede reutilizarse el mismo de entrada)
# -----------------------------------------
def obtener_usuario_y_embedding_por_documento(numero_documento):
    connection = None
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
                "embedding": json.loads(result["embedding"])
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
# 2. Verificar registro de salida hoy
# -----------------------------------------
def verificar_salida_hoy(id_usuario):
    connection = None
    """Verifica si el usuario ya tiene un registro de salida hoy"""
    try:
        connection = get_connection()
        if connection is None:
            raise Exception("Sin conexión a la base de datos")

        cursor = connection.cursor(dictionary=True)

        query = """
            SELECT COUNT(*) AS conteo 
            FROM registro_salida 
            WHERE id_usuario = %s 
            AND DATE(fecha_hora) = CURDATE()
        """

        cursor.execute(query, (id_usuario,))
        result = cursor.fetchone()

        return result['conteo'] > 0

    except Exception as e:
        print(f"❌ Error al verificar registro de salida: {e}")
        return True  # Por seguridad, asumir que ya está registrado si hay error
    finally:
        if connection:
            connection.close()

# -----------------------------------------
# 3. Verificar si tiene registro de entrada hoy
# (Necesario para validar que no se registre salida sin entrada)
# -----------------------------------------
def verificar_entrada_hoy(id_usuario):
    connection = None
    """Verifica si el usuario tiene registro de entrada hoy"""
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
        print(f"❌ Error al verificar registro de entrada: {e}")
        return False
    finally:
        if connection:
            connection.close()

# -----------------------------------------
# 4. Registrar salida en la tabla
# -----------------------------------------
def registrar_salida(id_usuario, comentarios=""):
    """Registra la salida solo si hay entrada hoy y no hay salida registrada"""
    connection = None
    try:
        # Verificar si tiene entrada registrada hoy
        if not verificar_entrada_hoy(id_usuario):
            mensaje = f"⚠️ Usuario {id_usuario} no tiene registro de entrada hoy"
            print(mensaje)
            return {"success": False, "message": mensaje}

        # Verificar si ya tiene salida registrada hoy
        if verificar_salida_hoy(id_usuario):
            mensaje = f"⚠️ Usuario {id_usuario} ya registró salida hoy"
            print(mensaje)
            return {"success": False, "message": mensaje}

        connection = get_connection()
        if connection is None:
            raise Exception("Sin conexión a la base de datos")

        cursor = connection.cursor()
        fecha_actual = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        # Crear instancia del modelo
        nuevo_registro = RegistroSalida.nuevo_registro(
            fecha_hora=fecha_actual,
            id_usuario=id_usuario,
            comentarios=comentarios
        )

        insert_query = """
            INSERT INTO registro_salida (fecha_hora, comentarios, id_usuario)
            VALUES (%s, %s, %s)
        """

        cursor.execute(insert_query, (
            nuevo_registro.fecha_hora,
            nuevo_registro.comentarios,
            nuevo_registro.id_usuario
        ))
        connection.commit()

        # Asignar el ID generado al modelo
        nuevo_registro.id_salida = cursor.lastrowid

        mensaje = f"✅ Salida registrada correctamente para usuario {id_usuario} a las {fecha_actual}"
        print(mensaje)
        return {
            "success": True,
            "message": mensaje,
            "id_registro": cursor.lastrowid
        }

    except Exception as e:
        mensaje = f"❌ Error al registrar salida: {e}"
        print(mensaje)
        return {"success": False, "message": mensaje}
    finally:
        if connection:
            connection.close()

# -----------------------------------------
# 5. Obtener hora de salida por documento
# -----------------------------------------
def obtener_hora_salida_por_documento(numero_documento):
    """
    Obtiene la hora de salida (TIME) del horario asociado al usuario por su documento.
    Retorna None si no encuentra el usuario o el horario.
    """
    connection = None
    try:
        print(f"🔎 Buscando hora de salida para documento: {numero_documento}")
        connection = get_connection()
        if connection is None:
            print("❌ Sin conexión a la base de datos")
            return None

        cursor = connection.cursor(dictionary=True)
        query = """
            SELECT h.hora_salida
            FROM usuario u
            JOIN cargo c ON u.id_cargo = c.id_cargo
            JOIN horario_laboral h ON c.id_horario = h.id_horario
            WHERE u.numero_documento = %s
        """
        cursor.execute(query, (numero_documento,))
        result = cursor.fetchone()
        if result:
            print(f"✅ Hora de salida encontrada: {result['hora_salida']}")
            return result['hora_salida']  # tipo datetime.time
        else:
            print(f"⚠️ No se encontró horario para el documento {numero_documento}")
            return None
    except Exception as e:
        print(f"❌ Error al obtener hora de salida: {e}")
        return None
    finally:
        if connection:
            connection.close()
            print("🔒 Conexión a la base de datos cerrada")