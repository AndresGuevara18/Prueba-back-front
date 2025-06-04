Write-Host "Auto-fixing backend (backend-node)..."
cd .\backend-node
if (Test-Path package.json) {
  if (Test-Path node_modules) {
    npm run lint -- --fix
  } else {
    Write-Host "Instala las dependencias con 'npm install' antes de ejecutar el fix."
  }
} else {
  Write-Host "No se encontró package.json en bee_express_pruebaback."
}
cd ..

Write-Host "Auto-fixing frontend (frontend-react)..."
cd .\frontend-react
if (Test-Path package.json) {
  if (Test-Path node_modules) {
    npm run lint -- --fix
  } else {
    Write-Host "Instala las dependencias con 'npm install' antes de ejecutar el fix."
  }
} else {
  Write-Host "No se encontró package.json en front-colpryst."
}
cd ..

Write-Host "Auto-fix completed."
