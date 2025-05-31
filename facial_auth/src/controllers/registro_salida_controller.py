from fastapi.responses import JSONResponse
from src.services.registro_salida_service import (
    obtener_usuario_y_embedding_por_documento,
    verificar_salida_hoy,
    verificar_entrada_hoy,
    registrar_salida
)
from src.utils.registro_salida_camara import iniciar_camara_tkinter, mostrar_ventana_comentario
from datetime import datetime, time 
from src.config.config import HORA_LIMITE_SALIDA

async def verificar_documento_salida_logic(numero_documento: str):
    try:
        print(f"🔎 Verificando documento para salida: {numero_documento}")
        resultado = obtener_usuario_y_embedding_por_documento(numero_documento)

        if resultado:
            id_usuario = resultado["id_usuario"]
            embedding_db = resultado["embedding"]

            # Verificar si tiene entrada registrada hoy
            if not verificar_entrada_hoy(id_usuario):
                return JSONResponse(status_code=400, content={
                    "success": False,
                    "message": "El usuario no tiene registro de entrada hoy"
                })

            # Verificar si ya tiene salida registrada hoy
            if verificar_salida_hoy(id_usuario):
                return JSONResponse(status_code=400, content={
                    "success": False,
                    "message": "El usuario ya registró salida hoy"
                })

            # Verificar si está saliendo temprano
            hora_actual = datetime.now().time()
            hora_limite = time(HORA_LIMITE_SALIDA[0], HORA_LIMITE_SALIDA[1])

            saliendo_temprano = hora_actual < hora_limite    
            print(f"✅ Documento {numero_documento} válido para salida. ID usuario: {id_usuario}")
            
            if saliendo_temprano:
                comentario = mostrar_ventana_comentario("Salida temprana")
                if not comentario:
                    return JSONResponse(
                        status_code=400,
                        content={"success": False, "message": "Debe ingresar un motivo de salida temprana"}
                    )
                iniciar_camara_tkinter(embedding_db, id_usuario, comentario)
            else:
                iniciar_camara_tkinter(embedding_db, id_usuario)

            return {
                "success": True,
                "id_usuario": id_usuario,
                "message": "Cámara iniciada para registro de salida"
            }

        return JSONResponse(status_code=404, content={
            "success": False,
            "message": "No se encontró usuario o no tiene embedding"
        })

    except Exception as e:
        print("❌ Error en verificación de salida:", str(e))
        return JSONResponse(status_code=500, content={
            "message": "Error interno",
            "error": str(e)
        })