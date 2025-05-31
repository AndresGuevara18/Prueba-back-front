Write-Host "Linting backend (bee_express_pruebaback)..."
cd .\bee_express_pruebaback
if (Test-Path package.json) {
  if (Test-Path node_modules) {
    npm run lint
  } else {
    Write-Host "Instala las dependencias con 'npm install' antes de ejecutar el linter."
  }
} else {
  Write-Host "No se encontró package.json en bee_express_pruebaback."
}
cd ..

Write-Host "Linting frontend (front-colpryst)..."
cd .\front-colpryst
if (Test-Path package.json) {
  if (Test-Path node_modules) {
    npm run lint
  } else {
    Write-Host "Instala las dependencias con 'npm install' antes de ejecutar el linter."
  }
} else {
  Write-Host "No se encontró package.json en front-colpryst."
}
cd ..

Write-Host "Linting facial_auth (Python, pylint)..."
cd .\facial_auth
if (Test-Path .\venv\Scripts\Activate.ps1) {
  .\venv\Scripts\Activate.ps1
  .\venv\Scripts\python.exe -m pylint src
  deactivate
} else {
  Write-Host "Crea y activa el entorno virtual antes de ejecutar el linter."
}
cd ..

Write-Host "Linting completed."
