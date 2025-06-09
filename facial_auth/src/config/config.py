# src/config/config.py
HORA_LIMITE_ENTRADA = (7, 15)  #HORA
HORA_LIMITE_SALIDA = (4, 50)    # Hora límite para salida (4:00 PM)

# Configuración global para facial_auth
UMBRAL_SIMILITUD = 0.5  # Umbral de similitud para verificación facial
GAP_MINIMO = 0.1         # Diferencia mínima entre el mejor y segundo mejor match

#HUMBRAL REGISTRO ENTRADA Y SALIDA
UMBRAL_SIMILITUD_REGISTRO = 0.5  # Umbral de similitud para registro de entrada y salida