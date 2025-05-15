# src/utils/camara.py

import cv2
from multiprocessing import Process
from tkinter import Tk, Label
from PIL import Image, ImageTk

def mostrar_camara():
    cap = cv2.VideoCapture(0)
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

    def update_frame():
        ret, frame = cap.read()
        if ret:
            cv2image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img = Image.fromarray(cv2image)
            imgtk = ImageTk.PhotoImage(image=img)
            lmain.imgtk = imgtk
            lmain.configure(image=imgtk)

        # Actualiza cada 10 ms
        lmain.after(10, update_frame)

    update_frame()
    root.mainloop()
    cap.release()

def iniciar_camara_tkinter():
    # 👉 Usar multiprocessing en lugar de threading
    Process(target=mostrar_camara).start()
