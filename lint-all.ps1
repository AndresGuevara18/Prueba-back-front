Write-Host "Linting backend (backend-node)..."
cd .\backend-node
if (Test-Path package.json) {
  if (Test-Path node_modules) {
    npm run lint
  } else {
    Write-Host "Instala las dependencias con 'npm install' antes de ejecutar el linter."
  }
} else {
  Write-Host "No se encontró package.json en backend-node."
}
cd ..

Write-Host "Linting frontend (frontend-react)..."
cd .\frontend-react
if (Test-Path package.json) {
  if (Test-Path node_modules) {
    npm run lint
  } else {
    Write-Host "Instala las dependencias con 'npm install' antes de ejecutar el linter."
  }
} else {
  Write-Host "No se encontró package.json en frontend-react."
}
cd ..

Write-Host "Linting facial_auth (Python, pylint)..."
cd .\facial_auth
if (Test-Path .\venv\Scripts\Activate.ps1) {
  .\venv\Scripts\Activate.ps1
  python -m pylint src
  deactivate
} else {
  Write-Host "Crea y activa el entorno virtual antes de ejecutar el linter."
}
cd ..

Write-Host "Linting completed."
