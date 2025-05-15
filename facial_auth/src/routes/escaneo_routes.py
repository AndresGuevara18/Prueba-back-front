# src/routes/escaneo_routes.py

from fastapi import APIRouter, Form
from src.controllers.escaneo_controller import verificar_documento_logic

router = APIRouter()

@router.post("/verificar-documento")
async def verificar_documento(numero_documento: str = Form(...)):
    return await verificar_documento_logic(numero_documento)
