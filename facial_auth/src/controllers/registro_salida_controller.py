#src/controllers/registro_salida_controller.py
from fastapi.responses import JSONResponse
from src.services.registro_salida_service import (
    obtener_usuario_y_embedding_por_documento,
    verificar_salida_hoy,
    verificar_entrada_hoy,
    registrar_salida,
    obtener_hora_salida_por_documento
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

            # Verificar si está saliendo temprano según horario programado
            hora_salida_programada = obtener_hora_salida_por_documento(numero_documento)
            hora_actual = datetime.now().time()
            if hora_salida_programada:
                from datetime import datetime as dt, time as dttime, timedelta
                if isinstance(hora_salida_programada, str):
                    hora_salida_programada = dt.strptime(hora_salida_programada, "%H:%M:%S").time()
                elif isinstance(hora_salida_programada, timedelta):
                    total_seconds = int(hora_salida_programada.total_seconds())
                    hours = total_seconds // 3600
                    minutes = (total_seconds % 3600) // 60
                    seconds = total_seconds % 60
                    hora_salida_programada = dttime(hours, minutes, seconds)
                saliendo_temprano = hora_actual < hora_salida_programada
            else:
                saliendo_temprano = False

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