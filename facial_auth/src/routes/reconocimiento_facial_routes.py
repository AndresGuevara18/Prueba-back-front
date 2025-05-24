# src/routes/reconocimiento_facial_routes.py

from fastapi import APIRouter, File, UploadFile
from src.controllers.reconocimiento_facial_controller import verificar_imagen_logic

router = APIRouter()

@router.post("/verificar-imagen")
async def verificar_imagen(file: UploadFile = File(...)):
    print("----> EN route verificar imagen")
    return await verificar_imagen_logic(file)
