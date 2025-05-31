# Linters y Estilos del Proyecto

Este proyecto utiliza linters para mantener la calidad y consistencia del código en los diferentes módulos (backend, frontend y facial_auth).

## Dependencias necesarias

### Frontend (`frontend-react`)
- Node.js y npm
- ESLint
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- eslint-plugin-tailwindcss
- Tailwind CSS

Instala las dependencias ejecutando en la carpeta `frontend-react`:
1. Abre PowerShell y ejecuta:
```powershell
cd .\frontend-react
npm install
npm install eslint eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-plugin-tailwindcss --save-dev
cd ..
```

### Backend (`backend-node`)
- Node.js y npm
- ESLint

Instala las dependencias ejecutando en la carpeta `backend-node`:
1. Abre PowerShell y ejecuta:
```powershell
cd .\backend-node
npm install
npm install eslint --save-dev
cd ..
```

### facial_auth (Python)
- Python 3.x
- pylint
- Entorno virtual (recomendado)

Crea y activa el entorno virtual en la carpeta `facial_auth` e instala pylint:

#### PowerShell (Windows):
```powershell
cd .\facial_auth
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install pylint
```

#### Git Bash (Windows):
```bash
cd facial_auth
python -m venv venv
source venv/Scripts/activate
pip install pylint
deactivate
cd ..
```

## Cómo ejecutar los linters

Desde la carpeta raíz del proyecto, ejecuta el siguiente script en PowerShell:
```powershell
.\lint-all.ps1
```

Este script:
- Lintéa el backend y frontend usando los scripts configurados en cada package.json.
- Lintéa facial_auth usando pylint dentro del entorno virtual.

Si alguna dependencia falta, sigue las instrucciones de arriba para instalarla.

## Cómo ejecutar los linters por separado

Puedes ejecutar los linters de cada módulo individualmente desde la raíz del proyecto o entrando a cada carpeta. Asegúrate de tener las dependencias instaladas.

### Frontend (`front-colpryst`)

Lint:
```powershell
cd .\frontend-react
npm run lint
```

Auto-fix:
```powershell
cd .\frontend-react
npm run lint -- --fix
```

### Backend (`backend-node`)

Lint:
```powershell
cd .\backend-node
npm run lint
```

Auto-fix:
```powershell
cd .\backend-node
npm run lint -- --fix
```

### facial_auth (Python)

Lint (PowerShell):
```powershell
cd .\facial_auth
.\venv\Scripts\Activate.ps1
.\venv\Scripts\python.exe -m pylint src
```

Lint (Git Bash):
```bash
cd facial_auth
source venv/Scripts/activate
python -m pylint src
```

> **Nota:** pylint no tiene auto-fix automático, pero puedes corregir los problemas que reporte manualmente.

## Cómo auto-arreglar todos los módulos

Desde la raíz del proyecto, puedes intentar auto-arreglar los problemas de backend y frontend con:
```powershell
.\fix-all.ps1
```

Esto ejecuta ESLint con la opción `--fix` en ambos módulos. Los problemas que no puedan arreglarse automáticamente requerirán intervención manual.
