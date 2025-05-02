# src/utils/face_utils.py

import face_recognition
import numpy as np

def obtener_embedding(image_bytes):
    try:
        np_array = np.frombuffer(image_bytes, np.uint8)
        imagen = face_recognition.load_image_file(np_array)
        caras = face_recognition.face_encodings(imagen)

        if len(caras) == 1:
            return caras[0].tolist()
        else:
            return None
    except Exception as e:
        print(f"❌ Error en obtener_embedding: {e}")
        return None

def comparar_embeddings(embedding1, embedding2):
    try:
        e1 = np.array(embedding1)
        e2 = np.array(embedding2)
        return np.linalg.norm(e1 - e2)
    except Exception as e:
        print(f"❌ Error al calcular distancia: {e}")
        return 9999  # Distancia muy alta si falla
