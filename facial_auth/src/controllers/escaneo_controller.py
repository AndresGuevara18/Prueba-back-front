# src/controllers/escaneo_controller.py

from fastapi.responses import JSONResponse
from src.services.reconocimiento_service import obtener_usuario_y_embedding_por_documento
from src.utils.camara import iniciar_camara_tkinter

async def verificar_documento_logic(numero_documento: str):
    try:
        print(f"🔎 Verificando documento: {numero_documento}")
        resultado = obtener_usuario_y_embedding_por_documento(numero_documento)

        if resultado:
            print(f"✅ Documento {numero_documento} válido. ID usuario: {resultado['id_usuario']}")
            iniciar_camara_tkinter()  # solo se ejecuta si se usa este endpoint
            return {
                "success": True,
                "id_usuario": resultado["id_usuario"],
                "message": "Cámara iniciada"
            }

        return JSONResponse(status_code=404, content={
            "success": False,
            "message": "No se encontró usuario o no tiene embedding"
        })

    except Exception as e:
        print("❌ Error en escaneo:", str(e))
        return JSONResponse(status_code=500, content={"message": "Error interno", "error": str(e)})
