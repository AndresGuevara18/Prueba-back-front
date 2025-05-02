# src/controllers/reconocimiento_controller.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from src.services.reconocimiento_service import guardar_reconocimiento_facial
import json
import requests

app = FastAPI()

@app.post("/verificar-imagen")
async def verificar_imagen(file: UploadFile = File(...)):
    # Validación básica
    if not file:
        raise HTTPException(status_code=400, detail="No se proporcionó ninguna imagen.")
    
    # Lee el contenido del archivo
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="La imagen está vacía.")
    
    print(f"✅ [FastAPI] Imagen recibida correctamente, tamaño: {len(contents)} bytes.")

    # Aquí iría el código para obtener el embedding de la imagen.
    # Usamos una API externa o un servicio interno para obtenerlo (esto es solo un ejemplo de cómo hacerlo)
    try:
        # Aquí deberías procesar la imagen, por ejemplo, enviar a otro servicio de reconocimiento facial.
        # Vamos a simular que el embedding es un array.
        embedding = [0.1, 0.2, 0.3, 0.4, 0.5]  # Simulamos el embedding de la imagen

        # Guardamos el reconocimiento facial en la base de datos
        # Asegúrate de obtener el ID del usuario de algún modo (se pasa aquí como ejemplo)
        id_usuario = 1  # Deberías obtener este ID según el contexto de tu sistema
        guardar_reconocimiento_facial(id_usuario, embedding)

        return {"message": "Imagen procesada y reconocimiento guardado."}

    except Exception as e:
        raise HTTPException(status_code=500, detail="Error al procesar la imagen.")
