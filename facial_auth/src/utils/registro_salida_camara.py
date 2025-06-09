#SRC/utils/registro_salida_camara.py
import cv2
from multiprocessing import Process
from tkinter import Tk, Label, CENTER, Button, Text, StringVar
from PIL import Image, ImageTk
from deepface import DeepFace
import time
from scipy.spatial.distance import cosine
from src.services.registro_salida_service import registrar_salida
import numpy as np
import tkinter as tk
from src.config.config import UMBRAL_SIMILITUD_REGISTRO

def mostrar_ventana_comentario(tipo="Salida temprana"):
    ventana = Tk()
    ventana.title(f"Registro de {tipo}")
    
    ventana.geometry("500x300")
    ventana.resizable(False, False)
    ventana.update_idletasks()
    ancho_ventana = ventana.winfo_width()
    alto_ventana = ventana.winfo_height()
    x_pos = (ventana.winfo_screenwidth() // 2) - (ancho_ventana // 2)
    y_pos = (ventana.winfo_screenheight() // 2) - (alto_ventana // 2)
    ventana.geometry(f"+{x_pos}+{y_pos}")
    ventana.attributes('-topmost', True)
    ventana.after(100, lambda: ventana.attributes('-topmost', False))
    
    ventana.configure(bg="#f0f0f0")
    comentario = None
    
    label = Label(ventana, 
                 text=f"Por favor ingrese el motivo de la {tipo.lower()}:",
                 font=("Arial", 12, "bold"),
                 bg="#f0f0f0")
    label.pack(pady=15)
    
    cuadro_texto = Text(ventana, 
                       height=8,
                       width=50,
                       font=("Arial", 11),
                       wrap=tk.WORD)
    cuadro_texto.pack(pady=10, padx=20)
    cuadro_texto.focus_set()
    
    def guardar():
        nonlocal comentario
        comentario = cuadro_texto.get("1.0", "end-1c").strip()
        ventana.destroy()
    
    btn_continuar = Button(ventana,
                          text="Continuar",
                          command=guardar,
                          font=("Arial", 10, "bold"),
                          bg="#4CAF50",
                          fg="white",
                          padx=20,
                          pady=5)
    btn_continuar.pack(pady=15)
    
    ventana.bind('<Return>', lambda e: guardar())
    ventana.mainloop()
    return comentario if comentario else None

def mostrar_mensaje(mensaje, exito=True):
    ventana = Tk()
    ventana.title("Resultado del Registro")
    ventana.geometry("400x150")
    ventana.resizable(False, False)
    ventana.attributes('-topmost', True)

    ventana.update_idletasks()
    screen_width = ventana.winfo_screenwidth()
    screen_height = ventana.winfo_screenheight()
    size = tuple(int(_) for _ in ventana.geometry().split('+')[0].split('x'))
    x = (screen_width // 2) - (size[0] // 2)
    y = (screen_height // 2) - (size[1] // 2)
    ventana.geometry(f"{size[0]}x{size[1]}+{x}+{y}")

    bg_color = "#d4edda" if exito else "#f8d7da"
    text_color = "#155724" if exito else "#721c24"

    ventana.configure(bg=bg_color)

    label = Label(
        ventana,
        text=mensaje,
        font=("Arial", 14, "bold"),
        wraplength=360,
        justify=CENTER,
        bg=bg_color,
        fg=text_color
    )
    label.pack(expand=True)

    ventana.after(4000, ventana.destroy)
    ventana.mainloop()

def mostrar_camara(embedding_db, id_usuario, comentario_salida=None):
    print("🧠 Embedding recibido desde base de datos para salida:")
    print(f"🧑 Usuario: {id_usuario} | Comentario: {comentario_salida or 'Ninguno'}")
    print(f"🧬 Embedding (primeros 5 valores): {embedding_db[:5]}...")

    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    cap.set(cv2.CAP_PROP_FPS, 15)

    if not cap.isOpened():
        print("❌ No se pudo abrir la cámara")
        return

    root = Tk()
    root.title("Reconocimiento Facial - Salida")
    root.attributes('-topmost', True)
    root.lift()
    root.after(100, lambda: root.attributes('-topmost', False))

    lmain = Label(root)
    lmain.pack()
    
    start_time = time.time()
    last_recognition_time = 0
    recognition_interval = 2
    UMBRAL_MOVIMIENTO = 5000
    last_face_region = None
    reconocimiento_realizado = False
    estado_reconocimiento = "analizando"
    frame_anterior = None

    after_id = None
    max_intentos_fallidos = 8
    intentos_fallidos = 0
    
    def update_frame():
        nonlocal last_recognition_time, frame_anterior, after_id
        
        if reconocimiento_realizado:
            return
            
        ret, frame = cap.read()
        if not ret:
            lmain.after(30, update_frame)
            return
        
        # Modo espejo para mejor experiencia de usuario
        frame = cv2.flip(frame, 1)
        
        movimiento_detectado = False
        if frame_anterior is not None:
            diferencia = cv2.absdiff(frame, frame_anterior)
            gris = cv2.cvtColor(diferencia, cv2.COLOR_BGR2GRAY)
            _, umbral = cv2.threshold(gris, 25, 255, cv2.THRESH_BINARY)
            movimiento = cv2.countNonZero(umbral)
            if movimiento > UMBRAL_MOVIMIENTO:
                print(f"⚠️ Movimiento brusco detectado: {movimiento}")
                movimiento_detectado = True
        
        frame_anterior = frame.copy()
        display_frame = frame.copy()
        # Ajustar el cuadro al modo espejo
        if last_face_region and not movimiento_detectado:
            x, y, w, h = last_face_region
            # EXPANDIR EL CUADRO UN 20%
            margen_x = int(w * 0.2)
            margen_y = int(h * 0.2)
            x_exp = max(0, x - margen_x)
            y_exp = max(0, y - margen_y)
            w_exp = min(display_frame.shape[1] - x_exp, w + 2 * margen_x)
            h_exp = min(display_frame.shape[0] - y_exp, h + 2 * margen_y)
            x_mirror = display_frame.shape[1] - (x_exp + w_exp)
            if estado_reconocimiento == "reconocido":
                color = (0, 255, 0)
                texto = "RECONOCIDO"
            elif estado_reconocimiento == "no_reconocido":
                color = (0, 0, 255)
                texto = "NO RECONOCIDO"
            else:
                color = (0, 255, 255)
                texto = "ANALIZANDO..."
            cv2.rectangle(display_frame, (x_mirror, y_exp), (x_mirror + w_exp, y_exp + h_exp), color, 2)
            cv2.putText(display_frame, texto, (x_mirror, y_exp-10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)
        elif movimiento_detectado:
            cv2.putText(display_frame, "MOVIMIENTO DETECTADO", (10, 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
        
        cv2image = cv2.resize(display_frame, (640, 480))
        cv2image = cv2.cvtColor(cv2image, cv2.COLOR_BGR2RGB)
        img = Image.fromarray(cv2image)
        imgtk = ImageTk.PhotoImage(image=img)
        lmain.imgtk = imgtk
        lmain.configure(image=imgtk)

        current_time = time.time()
        if (not reconocimiento_realizado and 
            not movimiento_detectado and
            current_time - start_time > 3 and 
            current_time - last_recognition_time > recognition_interval):
            
            last_recognition_time = current_time
            try:
                root.after(0, lambda: process_recognition(frame))
            except Exception as e:
                print("❌ Error en reconocimiento:", str(e))

        after_id = lmain.after(30, update_frame)
    
    def process_recognition(frame):
        nonlocal last_face_region, reconocimiento_realizado, estado_reconocimiento, intentos_fallidos
        
        if reconocimiento_realizado:
            return
            
        try:
            estado_reconocimiento = "analizando"
            
            height, width = frame.shape[:2]
            result = DeepFace.represent(
                img_path=frame,
                model_name='Facenet',
                enforce_detection=True,
                detector_backend='opencv'
            )

            if result and len(result) > 0 and "embedding" in result[0]:
                if "facial_area" in result[0]:
                    face = result[0]["facial_area"]
                    last_face_region = (face["x"], face["y"], face["w"], face["h"])
                    
                    x_center = face["x"] + face["w"]/2
                    y_center = face["y"] + face["h"]/2
                    
                    margen = 0.3
                    if (x_center < width * margen or 
                        x_center > width * (1-margen) or
                        y_center < height * margen or 
                        y_center > height * (1-margen)):
                        print("⚠️ Rostro muy cerca del borde, ignorando...")
                        estado_reconocimiento = "no_reconocido"
                        return
                
                embedding_live = result[0]["embedding"]
                distancia = cosine(embedding_live, embedding_db)
                print(f"🔍 Distancia coseno: {distancia:.4f}")

                if distancia < UMBRAL_SIMILITUD_REGISTRO:
                    if not hasattr(process_recognition, 'coincidencias_consecutivas'):
                        process_recognition.coincidencias_consecutivas = 0
                    
                    process_recognition.coincidencias_consecutivas += 1
                    print(f"✅ Coincidencia {process_recognition.coincidencias_consecutivas}/3")
                    
                    if process_recognition.coincidencias_consecutivas >= 3:
                        print(f"✅✅✅ Coincidencia confirmada para usuario ID {id_usuario}")
                        reconocimiento_realizado = True
                        estado_reconocimiento = "reconocido"
                        
                        comentario_final = f"Salida temprana: {comentario_salida}" if comentario_salida else "Registro normal"
                        resultado = registrar_salida(id_usuario, comentario_final)

                        if after_id:
                            lmain.after_cancel(after_id)
                        
                        root.destroy()
                        cap.release()
                        cv2.destroyAllWindows()
                        print("📝 Registro de salida realizado. Cerrando cámara...")
                        mostrar_mensaje(resultado["message"] if resultado["success"] else "Error en el registro")

                else:
                    process_recognition.coincidencias_consecutivas = 0
                    estado_reconocimiento = "no_reconocido"
                    intentos_fallidos += 1
                    print(f"❌ Intento fallido {intentos_fallidos}/{max_intentos_fallidos}")

                    if intentos_fallidos >= max_intentos_fallidos:
                        print("🚫 Límite de intentos fallidos alcanzado")

                        if after_id:
                            lmain.after_cancel(after_id)

                        cap.release()
                        root.destroy()
                        cv2.destroyAllWindows()

                        mostrar_mensaje("El rostro no coincide con el documento.", exito=False)

        except Exception as e:
            print("❌ Error al comparar embedding:", str(e))
            estado_reconocimiento = "no_reconocido"
            last_face_region = None
    
    update_frame()
    root.mainloop()
    cap.release()
    cv2.destroyAllWindows()

def iniciar_camara_tkinter(embedding_db, id_usuario, comentario=None):
    Process(target=mostrar_camara, args=(embedding_db, id_usuario, comentario)).start()