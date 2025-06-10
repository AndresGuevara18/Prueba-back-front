# 📌 Proyecto Visual Scan

Este proyecto tiene como objetivo crear una solución integral para el **registro de asistencia mediante reconocimiento facial**, desarrollado a solicitud de **Colpryst Asesores Ltda**. Está compuesto por un backend en **Node.js (Express)**, un frontend en **React con Vite**, y una API de reconocimiento facial desarrollada en **Python**.

---

## 📁 Estructura del Proyecto

```
/root
│
├── backend-node/                # Backend Node.js (Express)
├── frontend-react/              # Frontend React + Vite
└── facial_auth/                 # Backend de reconocimiento facial (Python)
```

---

## 🚀 Instalación y Ejecución

### 🔧 Backend (Node.js con Express)

1. Ir al directorio:
   ```bash
   cd backend-node
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Ejecutar el servidor:
   ```bash
   node app.js
   ```

---

### 💻 Frontend (React + Vite)

1. Ir al directorio:
   ```bash
   cd frontend-react
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Ejecutar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

---

### 🧠 Backend de Reconocimiento Facial (Python)

1. Ir al directorio:
   ```bash
   cd facial_auth
   ```

2. Crear entorno virtual (requiere Python 3.10.x):
   ```bash
   py -3.10 -m venv venv310
   ```

3. Activar entorno virtual (Windows):
   ```bash
   .\venv310\Scripts\Activate.ps1
   ```

4. Actualiza pip antes de instalar dependencias  
   ```bash
   python -m pip install --upgrade pip
   ```

5. Instalar dependencias:
   ```bash
   pip install -r requirements.txt
   pip install tensorflow==2.12.0 deepface==0.0.79
   ```

6. Verificar instalación:
   ```bash
   pip list
   ```

7. Para salir del entorno virtual:
   ```bash
   deactivate
   ```
8. iniciar archivo facial:
    ```bash
   uvicorn main:app --reload 
   ```
---

## ✅ Requisitos Funcionales

Los módulos clave del sistema incluyen:

| Código  | Funcionalidad                   |
|---------|----------------------------------|
| RF01    | Registro de usuarios            |
| RF02    | Asignación de roles             |
| RF03    | Inicio de sesión                |
| RF04    | Búsqueda de usuarios            |
| RF05    | Actualización de datos          |
| RF06    | Eliminación de usuarios         |
| RT07    | Reconocimiento facial           |
| RT08    | Registro en tiempo real         |
| RT09    | Registro de novedades           |
| RT10    | Registro de ingreso             |
| RT11    | Registro de salida              |
| RT12    | Notificación por retardos       |
| RT13    | Cierre de sesión                |

Ver detalles en: `requisitos_funcionales.md`

---

## 🧪 Historias de Usuario Destacadas

- **HU1**: Registro de usuario con validaciones.
- **HU3**: Inicio de sesión con credenciales.
- **HU8**: Reconocimiento facial para entrada/salida.
- **HU13**: Notificación automática tras 3 retardos.
- **HU14**: Cierre seguro de sesión.

Consulta el archivo `historias_usuarios.md` para el listado completo.

---

## ⚙️ Requisitos No Funcionales

Alcances técnicos y de calidad que se cumplen:

| Código   | Requisito                                  |
|----------|---------------------------------------------|
| RNF01    | Interfaz fácil de usar                      |
| RNF03    | Diseño coherente                            |
| RNF05    | Responsive design                           |
| RNF10    | Seguridad y privacidad                      |
| RNF12    | Protección de datos personales              |
| RNF13    | Tiempo de carga optimizado                  |
| RNF16    | Soporte para múltiples navegadores          |
| RNF18    | Documentación y mantenibilidad              |

Consulta completa en: `requisitos_no_funcionales.md`

---

## 🧩 Verificación de Conexión a Base de Datos

Para verificar que la base de datos esté conectada correctamente:

1. Revisa la configuración en el archivo `.env` o `config.js`.
2. Asegúrate de que el servicio de base de datos esté activo.
3. Usa herramientas como Postman o Insomnia para probar los endpoints.
4. Verifica en consola que el backend loguee una conexión exitosa.

---

## 📬 Contacto

Desarrollado para: **Colpryst Asesores Ltda**  
Versión: **3.0**  
Código interno: **PT-ERS-01**

---

## 👥 Roles Principales del Proyecto

### 1️⃣ Product Owner
- **Nombre:** Leydi Johana Arevalo  
  **Responsabilidades:**  
  - Definir la visión y prioridades del producto  
  - Gestionar el product backlog  
  - Validar entregables con stakeholders  

### 2️⃣ Scrum Master  
- **Nombre:** Ivan Dario Jimenez  
  **Responsabilidades:**  
  - Facilitar ceremonias ágiles (dailies, retrospectivas)  
  - Remover obstáculos del equipo  
  - Velar por el cumplimiento de Scrum  

### 3️⃣ Tech Lead  
- **Nombre:** Mauricio Andres Castro Guevara  
  **Responsabilidades:**  
  - Arquitectura de la solución (backend y base de datos)  
  - Revisión de código y estándares técnicos  
  - Mentoría técnica al equipo    

### 4️⃣ UX/UI Team  
- **Nombres:**  
  - Jhon Jairo Moreno Montoya  
  - Diller Adrian Chaguala Marín  
  **Responsabilidades:**  
  - Diseño de interfaces en Figma  
  - Prototipado y validación con usuarios  
  - Implementación frontend (React Vite)  

---


## 👥 Autores

- **Nombre:** Mauricio Andres Castro Guevara 

  **Rol:** Desarrollador Backend (Express), Backend Reconocimiento Facial (Python), Diseñador de Base de Datos

- **Nombre:** Jhon jairo Moreno Montoya 

  **Rol:** Desarrolladora Frontend (React Vite)

- **Nombre:** Diller Adrian Chaguala Marin

  **Rol:** Desarrolladora Frontend (React Vite), Documentación

- **Nombre:** Leydi Johana Arevalo

  **Rol:** Documentación y QA (Pruebas)

  
- **Nombre:** Ivan Dario Jimenez

  **Rol:** Desarrollador Backend (Express), QA (Pruebas)

---

## 📄 Licencia

Este proyecto está licenciado bajo los términos de la **Licencia MIT**.  
Puedes usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar y/o vender copias del Software, siempre que incluyas el aviso de derechos de autor original.

---

Copyright (c) 2025 Colpryst Asesores Ltda.
