# src/routes/registro_entrada_routes.py

from fastapi import APIRouter, Form
from src.controllers.registro_entrada_controller import verificar_documento_logic

router = APIRouter()

@router.post("/registro-entrada")
async def verificar_documento(numero_documento: str = Form(...)):
    print("----> Route registro entrada")
    return await verificar_documento_logic(numero_documento)
