from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from src.services.reconocimiento_service import obtener_todos_reconocimientos
from src.logic.face_verification import comparar_imagen_con_lista

app = FastAPI()

# CORS
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

        reconocimientos = obtener_todos_reconocimientos()
        match, id_usuario = comparar_imagen_con_lista(contents, reconocimientos)

        if match:
            return {
                "match": True,
                "id_usuario": id_usuario,
                "message": "El rostro ya está registrado"
            }

        return {
            "match": False,
            "message": "Rostro no encontrado en la base de datos"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error general: {str(e)}")
