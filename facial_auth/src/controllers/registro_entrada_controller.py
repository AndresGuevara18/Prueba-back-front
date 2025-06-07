# src/controllers/registro_entrada_controller.py

from fastapi.responses import JSONResponse
from src.services.registro_entrada_service import (
    obtener_usuario_y_embedding_por_documento,
    verificar_registro_hoy,
    registrar_entrada,
    obtener_hora_entrada_por_documento
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

            # Obtener hora de entrada programada
            hora_entrada_programada = obtener_hora_entrada_por_documento(numero_documento)
            hora_actual = datetime.now().time()
            comentario = None
            if hora_entrada_programada:
                # Convertir a objeto time si es necesario
                from datetime import datetime as dt, time as dttime, timedelta
                if isinstance(hora_entrada_programada, str):
                    hora_entrada_programada = dt.strptime(hora_entrada_programada, "%H:%M:%S").time()
                elif isinstance(hora_entrada_programada, timedelta):
                    # Convertir timedelta a time
                    total_seconds = int(hora_entrada_programada.total_seconds())
                    hours = total_seconds // 3600
                    minutes = (total_seconds % 3600) // 60
                    seconds = total_seconds % 60
                    hora_entrada_programada = dttime(hours, minutes, seconds)
                # Si la hora actual es mayor a la programada, es tarde
                if hora_actual > hora_entrada_programada:
                    comentario = mostrar_ventana_comentario()
                    if not comentario:
                        return JSONResponse(
                            status_code=400,
                            content={"success": False, "message": "Debe ingresar un motivo de tardanza"}
                        )
                    iniciar_camara_tkinter(embedding_db, id_usuario, comentario)
                else:
                    iniciar_camara_tkinter(embedding_db, id_usuario)
            else:
                # Si no hay horario, permitir registro normal
                iniciar_camara_tkinter(embedding_db, id_usuario)

            return {
                "success": True,
                "id_usuario": id_usuario,
                "message": "Cámara iniciada con datos"
            }
        else:
            return JSONResponse(status_code=404, content={
                "success": False,
                "message": "No se encontró usuario para el documento proporcionado"
            })
    except Exception as e:
        print(f"❌ Error en verificar_documento_logic: {e}")
        return JSONResponse(status_code=500, content={
            "success": False,
            "message": f"Error interno: {e}"
        })