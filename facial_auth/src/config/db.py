# src/config/db.py
import mysql.connector #instalar: pip install mysql-connector-python // verificar : pip show mysql-connector-python
from mysql.connector import Error

def get_connection():
    try:
        connection = mysql.connector.connect(
            host='localhost',
            database='colpryst_col3',
            user='root',
            password=''
            #password='admin123' # pass mechas
        )
        if connection.is_connected():
            print("✅ Conexión a la base de datos exitosa")
            return connection
    except Error as e:
        print(f"❌ Error al conectar a la base de datos: {e}")
        return None
