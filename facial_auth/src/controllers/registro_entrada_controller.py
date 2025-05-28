# src/controllers/registro_entrada_controller.py

from fastapi.responses import JSONResponse
from src.services.registro_entrada_service import (
    obtener_usuario_y_embedding_por_documento,
    verificar_registro_hoy,
    registrar_entrada
)
from src.utils.registro_entrada_camara import iniciar_camara_tkinter, mostrar_ventana_comentario
from datetime import datetime, time 
from src.config.config import HORA_LIMITE_ENTRADA

async def verificar_documento_logic(numero_documento: str):
    try:
        print(f"🔎 Verificando documento: {numero_documento}")
        resultado = obtener_usuario_y_embedding_por_documento(numero_documento)

        if resultado:
            id_usuario = resultado["id_usuario"]
            embedding_db = resultado["embedding"]

            # Verificar si ya tiene registro hoy
            if verificar_registro_hoy(id_usuario):
                return JSONResponse(status_code=400, content={
                    "success": False,
                    "message": "El usuario ya registró entrada hoy"
                })

            # Verificar si está llegando tarde
            hora_actual = datetime.now().time()
            hora_limite = time(HORA_LIMITE_ENTRADA[0], HORA_LIMITE_ENTRADA[1])  # Crear objeto time(15, 50)

            llegando_tarde = hora_actual >= hora_limite    
            print(f"✅ Documento {numero_documento} válido. ID usuario: {id_usuario}")
            
            if llegando_tarde:
                comentario = mostrar_ventana_comentario()
                if not comentario:
                    return JSONResponse(
                        status_code=400,
                        content={"success": False, "message": "Debe ingresar un motivo de tardanza"}
                    )
                iniciar_camara_tkinter(embedding_db, id_usuario, comentario)
            else:
                iniciar_camara_tkinter(embedding_db, id_usuario)

            return {
                "success": True,
                "id_usuario": id_usuario,
                "message": "Cámara iniciada con datos"
            }

        return JSONResponse(status_code=404, content={
            "success": False,
            "message": "No se encontró usuario o no tiene embedding"
        })

    except Exception as e:
        print("❌ Error en escaneo:", str(e))
        return JSONResponse(status_code=500, content={
            "message": "Error interno",
            "error": str(e)
        })