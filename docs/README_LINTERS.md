
# Linters y Estilos del Proyecto

Este proyecto utiliza linters para mantener la calidad y consistencia del código en los diferentes módulos (backend, frontend y facial_auth).

## Dependencias necesarias

### Frontend (`frontend-react`)
- Node.js y npm
- ESLint
- @babel/core
- @babel/preset-env
- @babel/preset-react
- @babel/eslint-parser
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- eslint-plugin-tailwindcss
- globals
- Tailwind CSS


Instala todas las dependencias necesarias ejecutando en la carpeta `frontend-react`:
1. Abre PowerShell y ejecuta:
```powershell
cd .\frontend-react
npm install
# Instala las dependencias de desarrollo para linting y estilos
npm install eslint @babel/core @babel/preset-env @babel/preset-react @babel/eslint-parser eslint-plugin-react-hooks eslint-plugin-react-refresh eslint-plugin-tailwindcss globals --save-dev
cd ..
```

> **Nota:** Si usas la sintaxis `import`/`export` en tu configuración de ESLint, asegúrate de que el archivo de configuración sea `eslint.config.mjs` o que tu `package.json` tenga el campo `"type": "module"`.


### Backend (`backend-node`)
- Node.js y npm
- ESLint
- @eslint/js

Instala las dependencias ejecutando en la carpeta `backend-node`:
1. Abre PowerShell y ejecuta:
```powershell
cd .\backend-node
npm install
npm install eslint @eslint/js --save-dev
cd ..
```

> **Importante:** Si tu archivo de configuración de ESLint usa la sintaxis `import`/`export`, renómbralo a `eslint.config.mjs` para evitar errores de módulos. No es necesario cambiar el `package.json` a `type: module` si solo quieres módulos ES en la configuración de ESLint.


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

Para desactivar el entorno virtual en PowerShell:
```powershell
deactivate
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

### facial_auth (Python)

crear el entorno virtual e instalar pylint:

```powershell
cd .\facial_auth
Remove-Item -Recurse -Force .\venv
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install pylint
pylint src
```

Lint (Git Bash):
```bash
cd facial_auth
source venv/Scripts/activate
pylint src
```

> **Nota:** pylint no tiene auto-fix automático, pero puedes corregir los problemas que reporte manualmente.

## Cómo ejecutar los linters


Desde la carpeta raíz del proyecto, ejecuta el siguiente script en PowerShell:
```powershell
./lint-all.ps1
```


Este script:
- Lintéa el backend y frontend usando los scripts configurados en cada package.json.
- Lintéa facial_auth usando pylint dentro del entorno virtual (asegúrate de tener el entorno virtual creado y activado antes de usar pylint).

Si alguna dependencia falta, sigue las instrucciones de arriba para instalarla.

## Cómo ejecutar los linters por separado

Puedes ejecutar los linters de cada módulo individualmente desde la raíz del proyecto o entrando a cada carpeta. Asegúrate de tener las dependencias instaladas.


### Frontend (`frontend-react`)

Lint:
> Ejecuta este comando dentro de la carpeta `frontend-react` (no en la raíz del proyecto):
```powershell
cd .\frontend-react
npm run lint
npx eslint --fix
```

Auto-fix:
> Ejecuta este comando dentro de la carpeta `frontend-react` (no en la raíz del proyecto):
```powershell
cd .\frontend-react
npm run lint 
npx eslint --fix
```


### Backend (`backend-node`)

Lint:
```powershell
cd .\backend-node
npm run lint
npx eslint --fix
```

Auto-fix:
```powershell
cd .\backend-node
npm run lint 
npx eslint --fix
```


### facial_auth (Python)

Lint (PowerShell):
```powershell
cd .\facial_auth
.\venv\Scripts\Activate.ps1
python -m pylint src
```

Para desactivar el entorno virtual:
```powershell
deactivate
```

Lint (Git Bash):
```bash
cd facial_auth
source venv/Scripts/activate
python -m pylint src
deactivate
cd ..
```

> **Nota:** pylint no tiene auto-fix automático, pero puedes corregir los problemas que reporte manualmente.

## Cómo auto-arreglar todos los módulos

Para intentar auto-arreglar los problemas de estilo y lint en todos los módulos del proyecto, puedes usar el siguiente script desde la raíz del proyecto:

```powershell
./fix-all.ps1
```

Este script realiza lo siguiente:
- Ejecuta ESLint con la opción `--fix` en el backend (`backend-node`) y el frontend (`frontend-react`), corrigiendo automáticamente los problemas que ESLint pueda solucionar.
- **No ejecuta pylint en el módulo de Python (`facial_auth`)**, ya que pylint no tiene opción de auto-fix automático. Si quieres revisar los problemas de lint en facial_auth, debes hacerlo manualmente con los comandos indicados en la sección correspondiente.

> **Nota:** Los problemas que no puedan arreglarse automáticamente requerirán intervención manual. Además, si quieres incluir la revisión de facial_auth en el script, deberás modificar `fix-all.ps1` para agregar la ejecución de pylint, pero recuerda que solo reportará problemas, no los corregirá automáticamente.
