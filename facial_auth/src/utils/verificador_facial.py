# src/utils/verificador_facial.py

import numpy as np
import json
from scipy.spatial.distance import cosine
from src.config.db import get_connection

UMBRAL_SIMILITUD = 0.5  # Ajusta según pruebas

def verificar_embedding(nuevo_embedding):
    try:
        connection = get_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute("SELECT id_usuario, embedding FROM reconocimiento_facial")
        registros = cursor.fetchall()
        print(f"📚 {len(registros)} embeddings existentes recuperados")

        mejor_distancia = float('inf')
        segundo_mejor = float('inf')
        mejor_id = None

        for row in registros:
            try:
                emb_db = np.array(json.loads(row["embedding"]))
                distancia = cosine(nuevo_embedding, emb_db)
                print(f"🔍 Comparando con ID usuario {row['id_usuario']} | Distancia: {distancia}")

                if distancia < mejor_distancia:
                    segundo_mejor = mejor_distancia
                    mejor_distancia = distancia
                    mejor_id = row["id_usuario"]
                elif distancia < segundo_mejor:
                    segundo_mejor = distancia
            except Exception as err:
                print("⚠️ Error al comparar embedding:", err)

        # Estrategia: umbral + diferencia significativa
        if mejor_distancia < UMBRAL_SIMILITUD and (segundo_mejor - mejor_distancia) > 0.1:
            print(f"✅ Coincidencia detectada con usuario {mejor_id}")
            return {
                "match": True,
                "id_usuario": mejor_id,
                "distancia": mejor_distancia
            }

        print("✅ No se encontró coincidencia.")
        return {"match": False}

    except Exception as e:
        print("❌ Error al verificar embedding:", str(e))
        return {"match": False, "error": str(e)}
