const express = require('express'); // Importa Express
const cors = require('cors'); // Importa CORS
const path = require('path'); // Manejo de rutas de archivos
const usuarioRoutes = require('./src/routes/userRoutes'); // Importa rutas de usuario
const cargoRoutes = require('./src/routes/cargoRoutes'); // Importa las rutas de cargo
const swaggerUi = require('swagger-ui-express'); // Importa Swagger UI
const swaggerJsdoc = require('swagger-jsdoc'); // Importa Swagger JSDoc

const app = express(); // Instancia de Express
const PORT = 3000; // Define el puerto


// 🔹 Habilitar CORS para permitir peticiones del frontend y de Swagger
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Permitir peticiones desde el frontend (Vite) y Swagger UI
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
  credentials: true // Permitir cookies o autenticación si es necesario
}));

// Configuración de Swagger
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Usuarios y Cargos",
      version: "1.0.0",
      description: "Documentación de la API con Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000", // URL del servidor backend
        description: "Servidor local",
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Especifica dónde están las rutas documentadas
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Habilita la documentación de Swagger

app.use((req, res, next) => {
  if (req.originalUrl === '/api/usuarios' && req.method === 'POST') {
    // Skip body parsing for multipart/form-data
    next();
  } else {
    express.json()(req, res, next);
  }
});

// Middleware para analizar application/x-www-form-urlencoded (solo para rutas que no usen multipart/form-data)
app.use((req, res, next) => {
  if (req.originalUrl === '/api/usuarios' && req.method === 'POST') {
    next();
  } else {
    express.urlencoded({ extended: true })(req, res, next);
  }
});

// Rutas de API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/cargos', cargoRoutes);

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
  console.log(`📄 Swagger Docs disponibles en http://localhost:${PORT}/api-docs`);
});