# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.routes.imagen_routes import router as imagen_router
from src.routes.escaneo_routes import router as escaneo_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(imagen_router, prefix="/api")
app.include_router(escaneo_router, prefix="/api")
