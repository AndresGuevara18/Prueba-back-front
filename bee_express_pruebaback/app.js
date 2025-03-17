const express = require('express'); // Importa Express
const cors = require('cors'); // Importa CORS
const path = require('path'); // Manejo de rutas de archivos
const usuarioRoutes = require('./src/routes/userRoutes'); // Importa rutas de usuario
const cargoRoutes = require('./src/routes/cargoRoutes'); // Importa las rutas de cargo

const app = express(); // Instancia de Express
const PORT = 3000; // Define el puerto

// Habilitar CORS
app.use(cors());

// Middleware para analizar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Permite recibir datos de formularios

// **Comentado**: Servir archivos estáticos desde la carpeta 'public'
// app.use(express.static(path.join(__dirname, 'public')));

// Rutas de API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/cargos', cargoRoutes);

// **Comentado**: Ruta principal - Servir el archivo HTML
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public','usuario.html'));
// });

// Redirigir la ruta principal al frontend (Vite)
app.get('/', (req, res) => {
  res.redirect('http://localhost:5173'); // Redirige al frontend (Vite)
});

// Manejo de rutas no encontradas (Error 404)
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});