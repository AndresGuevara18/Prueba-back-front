# src/utils/registro_entrada_camara.py (versión con validación de movimiento)

import cv2
from multiprocessing import Process
from tkinter import Tk, Label, CENTER
from PIL import Image, ImageTk
from deepface import DeepFace
import time
from scipy.spatial.distance import cosine
from src.services.registro_entrada_service import registrar_entrada
import numpy as np

def mostrar_mensaje(mensaje, exito=True):
    ventana = Tk()
    ventana.title("Resultado del Registro")
    ventana.geometry("400x150")
    ventana.resizable(False, False)
    ventana.attributes('-topmost', True)

    # Centrar la ventana en la pantalla
    ventana.update_idletasks()
    screen_width = ventana.winfo_screenwidth()
    screen_height = ventana.winfo_screenheight()
    size = tuple(int(_) for _ in ventana.geometry().split('+')[0].split('x'))
    x = (screen_width // 2) - (size[0] // 2)
    y = (screen_height // 2) - (size[1] // 2)
    ventana.geometry(f"{size[0]}x{size[1]}+{x}+{y}")

    # Color de fondo: verde para éxito, rojo para error
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

    ventana.after(4000, ventana.destroy)  # Cierra automáticamente después de 4 segundos
    ventana.mainloop()


def mostrar_camara(embedding_db, id_usuario):
    print("🧠 Embedding recibido desde base de datos:")
    print(f"🧑 ID usuario: {id_usuario}")
    print(f"🧬 Embedding (primeros 5 valores): {embedding_db[:5]}...")

    after_id = None  # 🔸Variable global para cancelar after
    # Configuración de cámara optimizada
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    cap.set(cv2.CAP_PROP_FPS, 15)

    if not cap.isOpened():
        print("❌ No se pudo abrir la cámara")
        return

    root = Tk()
    root.title("Reconocimiento Facial")
    root.attributes('-topmost', True)
    root.lift()
    root.after(100, lambda: root.attributes('-topmost', False))

    lmain = Label(root)
    lmain.pack()
    
    # Variables de control
    start_time = time.time()
    last_recognition_time = 0
    recognition_interval = 2  # Segundos entre reconocimientos
    UMBRAL_SIMILITUD = 0.3
    UMBRAL_MOVIMIENTO = 5000  # Umbral para detectar movimiento brusco
    last_face_region = None
    reconocimiento_realizado = False
    estado_reconocimiento = "analizando"
    frame_anterior = None
    
    def update_frame():
        nonlocal last_recognition_time, frame_anterior, after_id
        
        if reconocimiento_realizado:
            return
            
        ret, frame = cap.read()
        if not ret:
            lmain.after(30, update_frame)
            return
            
        # Detección de movimiento brusco
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
        
        # Mostrar imagen en Tkinter
        display_frame = frame.copy()
        
        # Dibujar cuadro según estado
        if last_face_region and not movimiento_detectado:
            x, y, w, h = last_face_region
            if estado_reconocimiento == "reconocido":
                color = (0, 255, 0)  # Verde
                texto = "RECONOCIDO"
            elif estado_reconocimiento == "no_reconocido":
                color = (0, 0, 255)  # Rojo
                texto = "NO RECONOCIDO"
            else:  # analizando
                color = (0, 255, 255)  # Amarillo
                texto = "ANALIZANDO..."
            
            cv2.rectangle(display_frame, (x, y), (x+w, y+h), color, 2)
            cv2.putText(display_frame, texto, (x, y-10), 
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

        # Control de tiempo para reconocimiento
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
        nonlocal last_face_region, reconocimiento_realizado, estado_reconocimiento
        
        if reconocimiento_realizado:
            return
            
        try:
            estado_reconocimiento = "analizando"
            
            # Validación adicional: requiere rostro centrado
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
                    
                    # Validar posición del rostro (debe estar relativamente centrado)
                    x_center = face["x"] + face["w"]/2
                    y_center = face["y"] + face["h"]/2
                    
                    margen = 0.3  # 30% de margen en los bordes
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

                # Validación estricta para evitar falsos positivos
                if distancia < UMBRAL_SIMILITUD:
                    # Requerir múltiples coincidencias consecutivas
                    if not hasattr(process_recognition, 'coincidencias_consecutivas'):
                        process_recognition.coincidencias_consecutivas = 0
                    
                    process_recognition.coincidencias_consecutivas += 1
                    print(f"✅ Coincidencia {process_recognition.coincidencias_consecutivas}/3")
                    
                    if process_recognition.coincidencias_consecutivas >= 3:
                        print(f"✅✅✅ Coincidencia confirmada para usuario ID {id_usuario}")
                        reconocimiento_realizado = True
                        estado_reconocimiento = "reconocido"
                        resultado = registrar_entrada(id_usuario)

                        #registrar_entrada(id_usuario)
                        # 🔸 Cancelar el after pendiente antes de cerrar la ventana
                        if after_id:
                            lmain.after_cancel(after_id)
                        
                        # 🔸 Cerrar la cámara y la ventana principal
                        root.destroy()
                        cap.release()
                        cv2.destroyAllWindows()
                        print("📝 Registro de entrada realizado. Cerrando cámara...")
                        #root.after(2000, root.destroy)
                        # Mostrar ventana nueva con mensaje
                        mostrar_mensaje(resultado["message"] if resultado["success"] else "Error en el registro")

                else:
                    process_recognition.coincidencias_consecutivas = 0
                    estado_reconocimiento = "no_reconocido"
        except Exception as e:
            print("❌ Error al comparar embedding:", str(e))
            estado_reconocimiento = "no_reconocido"
            last_face_region = None
    
    update_frame()
    root.mainloop()
    cap.release()
    cv2.destroyAllWindows()

def iniciar_camara_tkinter(embedding_db, id_usuario):
    Process(target=mostrar_camara, args=(embedding_db, id_usuario)).start()