# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes.reconocimiento_facial_routes import router as reconocimiento_facial
from src.routes.registro_entrada_routes import router as registro_entrada
from src.routes.registro_salida_routes import router as registro_salida

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("en main")
app.include_router(reconocimiento_facial, prefix="/api")#verificar imagen registro usuario desde NODE
app.include_router(registro_entrada, prefix="/api")#registro entrada desde react
app.include_router(registro_salida, prefix="/api") #registro salida desde react