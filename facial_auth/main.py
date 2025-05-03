from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import numpy as np
import cv2
from deepface import DeepFace
from src.utils.verificador_facial import verificar_embedding

app = FastAPI()

@app.post("/verificar-imagen")
async def verificar_imagen(file: UploadFile = File(...)):
    try:
        print("📥 Imagen recibida para verificación")
        contents = await file.read()

        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return JSONResponse(status_code=400, content={"message": "No se pudo leer la imagen."})

        print("🧠 Procesando imagen con DeepFace...")
        result = DeepFace.represent(img_path=img, model_name='Facenet', enforce_detection=False)

        if not result or len(result) == 0:
            return JSONResponse(status_code=400, content={"message": "No se generó el embedding."})

        nuevo_embedding = np.array(result[0]["embedding"])
        print("✅ Embedding generado correctamente")

        # 👉 Llamar al verificador facial reutilizable
        resultado = verificar_embedding(nuevo_embedding)

        if resultado["match"]:
            return {
                "match": True,
                "id_usuario": resultado["id_usuario"],
                "distancia": resultado["distancia"]
            }

        return {
            "match": False,
            "embedding": result[0]["embedding"]
        }

    except Exception as e:
        print("❌ Error en el servidor:", str(e))
        return JSONResponse(status_code=500, content={"message": "Error interno", "error": str(e)})
