Write-Host "Auto-fixing backend (backend-node)..."
cd .\backend-node
if (Test-Path package.json) {
  if (Test-Path node_modules) {
    npm run lint -- --fix
  } else {
    Write-Host "Instala las dependencias con 'npm install' antes de ejecutar el fix."
  }
} else {
  Write-Host "No se encontró package.json en backend-node."
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
  Write-Host "No se encontró package.json en frontend-react."
}
cd ..

Write-Host "Auto-fix completed."
