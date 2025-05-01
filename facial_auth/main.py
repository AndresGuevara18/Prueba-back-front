# main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import cv2
import numpy as np
from deepface import DeepFace
from typing import List
from src.services.reconocimiento_service import obtener_todos_reconocimientos, obtener_foto_por_id_usuario

app = FastAPI()

# Configura CORS para permitir comunicación con Node.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/verificar-imagen")
async def verificar_imagen(file: UploadFile = File(...)):
    try:
        if not file:
            raise HTTPException(status_code=400, detail="No se proporcionó imagen")
        
        contents = await file.read()
        if not contents:
            raise HTTPException(status_code=400, detail="Imagen vacía")

        nparr = np.frombuffer(contents, np.uint8)
        img_nueva = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img_nueva is None:
            raise HTTPException(status_code=400, detail="Formato de imagen no válido")
        
        # Obtener información básica de la imagen
        height, width, channels = img_nueva.shape
        return {
            "message": "Imagen recibida correctamente",
            "width": width,
            "height": height,
            "channels": channels,
            "content_type": file.content_type
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
