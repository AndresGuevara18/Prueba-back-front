from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import numpy as np
import cv2
from deepface import DeepFace

app = FastAPI()

@app.post("/verificar-imagen")
async def verificar_imagen(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        # Convertir blob a imagen
        nparr = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return JSONResponse(status_code=400, content={"message": "No se pudo leer la imagen."})

        # Obtener embedding con DeepFace
        result = DeepFace.represent(img_path=img, model_name='Facenet', enforce_detection=False)

        if result and len(result) > 0:
            return {
                "match": False,  # Puedes usar DeepFace.find más adelante si quieres verificar duplicados
                "embedding": result[0]["embedding"]
            }

        return JSONResponse(status_code=400, content={"message": "No se generó el embedding."})

    except Exception as e:
        return JSONResponse(status_code=500, content={"message": "Error interno", "error": str(e)})
