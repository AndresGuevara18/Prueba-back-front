# src/config/db.py
import os
import mysql.connector #instalar: pip install mysql-connector-python // verificar : pip show mysql-connector-python
from mysql.connector import Error

def get_connection():
    try:
        connection = mysql.connector.connect(
            host=os.environ.get('DB_HOST', 'db'),
            database=os.environ.get('DB_NAME', 'colpryst_db'),
            user=os.environ.get('DB_USER', 'colpryts_user'),
            password=os.environ.get('DB_PASSWORD', 'colpryts123'),
            port=int(os.environ.get('DB_PORT', 3306))
        )
        if connection.is_connected():
            print("✅ Conexión a la base de datos exitosa")
            return connection
    except Error as e:
        print(f"❌ Error al conectar a la base de datos: {e}")
        return None
