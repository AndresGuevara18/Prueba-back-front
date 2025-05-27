# src/routes/registro_salida_routes.py

from fastapi import APIRouter, Form
from src.controllers.registro_salida_controller import verificar_documento_salida_logic

router = APIRouter()

@router.post("/registro-salida")
async def verificar_documento_salida(numero_documento: str = Form(...)):
    print("----> Route registro salida")
    return await verificar_documento_salida_logic(numero_documento)