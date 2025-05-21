# src/utils/verificador_facial.py

import numpy as np
import json
from scipy.spatial.distance import cosine
from src.config.db import get_connection

<<<<<<< HEAD
UMBRAL_SIMILITUD = 0.1 # Ajusta según pruebas
=======
UMBRAL_SIMILITUD = 0.4  # Ajusta según pruebas
>>>>>>> 24574a89c527beff46b755a52941ab60e74b2c4f

def verificar_embedding(nuevo_embedding):
    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id_usuario, embedding FROM reconocimiento_facial")
        registros = cursor.fetchall()
        print(f"📚 {len(registros)} embeddings existentes recuperados")

        for row in registros:
            try:
                emb_db = np.array(json.loads(row["embedding"]))
                distancia = cosine(nuevo_embedding, emb_db)
                print(f"🔍 Comparando con ID usuario {row['id_usuario']} | Distancia: {distancia}")

                if distancia < UMBRAL_SIMILITUD:
                    print(f"✅ Coincidencia detectada con usuario {row['id_usuario']}")
                    return {
                        "match": True,
                        "id_usuario": row["id_usuario"],
                        "distancia": distancia
                    }
            except Exception as err:
                print("⚠️ Error al comparar embedding:", err)

        print("✅ No se encontró coincidencia.")
        return {"match": False}

    except Exception as e:
        print("❌ Error al verificar embedding:", str(e))
        return {"match": False, "error": str(e)}
