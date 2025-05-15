# src/routes/imagen_routes.py

from fastapi import APIRouter, File, UploadFile
from src.controllers.imagen_controller import verificar_imagen_logic

router = APIRouter()

@router.post("/verificar-imagen")
async def verificar_imagen(file: UploadFile = File(...)):
    print("----> En router imagen")
    return await verificar_imagen_logic(file)
