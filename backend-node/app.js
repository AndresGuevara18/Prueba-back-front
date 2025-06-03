const express = require('express'); // Importa Express
const cors = require('cors'); // Importa CORS
const path = require('path'); // Manejo de rutas de archivos
const usuarioRoutes = require('./src/routes/userRoutes'); // Importa rutas de usuario
const cargoRoutes = require('./src/routes/cargoRoutes'); // Importa las rutas de cargo
const novedadRoutes = require('./src/routes/novedadRoutes'); // Importa las rutas de novedades
const reporteRoutes = require('./src/routes/reporteRoutes'); // Importa las rutas de reportes
const swaggerDocs = require('./swaggerConfig'); // Importa la configuración de Swagger

const app = express(); // Instancia de Express
const PORT = 3000; // Define el puerto

// CORS para permitir peticiones del frontend y de Swagger
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Permitir peticiones desde el frontend (Vite) y Swagger UI
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
  credentials: true, // Permitir cookies o autenticación si es necesario
}));

// Configuración de Swagger
swaggerDocs(app); // Llama a la función de configuración de Swagger desde swaggerConfig.js

// Parseo del body (condicional para evitar errores con multipart/form-data)
app.use((req, res, next) => {
  if (req.originalUrl === '/api/usuarios' && req.method === 'POST') {
    next(); // No aplica express.json() para formularios con archivos
  } else {
    express.json()(req, res, next);
  }
});

// Middleware para analizar application/x-www-form-urlencoded
app.use((req, res, next) => {
  if (req.originalUrl === '/api/usuarios' && req.method === 'POST') {
    next(); // No aplica express.urlencoded() para formularios con archivos
  } else {
    express.urlencoded({ extended: true })(req, res, next);
  }
});

// Rutas de API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/cargos', cargoRoutes);
app.use('/api/novedades', novedadRoutes);
app.use('/api/reportes', reporteRoutes);

// Ruta principal al frontend (Vite)
app.get('/', (req, res) => {
  res.redirect('http://localhost:5173'); // Redirige al frontend
});

// Manejo de rutas no encontradas (Error 404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
  console.log('📄 Documentación de Swagger disponible en http://localhost:3000/api-docs');
});
