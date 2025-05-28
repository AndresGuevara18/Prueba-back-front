# src/controllers/reconocimiento_facial_controller.py

from fastapi import UploadFile
from fastapi.responses import JSONResponse
import numpy as np
import cv2
from deepface import DeepFace
from src.utils.verificador_facial import verificar_embedding


async def verificar_imagen_logic(file: UploadFile):
    try:
        print("📥 Imagen recibida para verificación")
        contents = await file.read()

        # Decodificar imagen
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            print("❌ No se pudo decodificar la imagen")
            return JSONResponse(status_code=400, content={"message": "No se pudo leer la imagen."})

        print("🧠 Procesando imagen con DeepFace...")
        result = DeepFace.represent(img_path=img, model_name='Facenet', enforce_detection=False)

        if not result or len(result) == 0 or "embedding" not in result[0]:
            print("❌ No se generó el embedding.")
            return JSONResponse(status_code=400, content={"message": "No se generó el embedding."})

        nuevo_embedding = np.array(result[0]["embedding"])
        print("✅ Embedding generado correctamente")

        # Comparar con la base de datos
        resultado = verificar_embedding(nuevo_embedding)

        if resultado["match"]:
            response = {
                "match": True,
                "id_usuario": resultado["id_usuario"],
                "distancia": resultado["distancia"]
            }
            print("📤 Respuesta enviada (match):", response)
            return response

        response = {
            "match": False,
            "embedding": result[0]["embedding"]
        }
        print("📤 Respuesta enviada (sin match):", response)
        return response

    except Exception as e:
        print("❌ Error en el servidor:", str(e))
        return JSONResponse(status_code=500, content={"message": "Error interno", "error": str(e)})
    