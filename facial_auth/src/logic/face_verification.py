import cv2
import numpy as np
from deepface import DeepFace
from models.reconocimiento_facial import ReconocimientoFacial
from typing import Tuple, List

def comparar_imagen_con_lista(blob_imagen: bytes, lista_reconocimientos: List[ReconocimientoFacial]) -> Tuple[bool, int]:
    try:
        img_array = np.frombuffer(blob_imagen, np.uint8)
        img_capturada = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

        for reco in lista_reconocimientos:
            try:
                img_bd = cv2.imdecode(np.frombuffer(reco.fotografia_emple, np.uint8), cv2.IMREAD_COLOR)
                if img_capturada is None or img_bd is None:
                    continue

                resultado = DeepFace.verify(img1_path=img_capturada, img2_path=img_bd, enforce_detection=False)

                if resultado.get("verified"):
                    return True, reco.id_usuario
            except Exception as e:
                print(f"⚠️ Error al comparar con ID {reco.id_usuario}: {e}")

    except Exception as e:
        print(f"❌ Error general en comparación: {e}")

    return False, None
