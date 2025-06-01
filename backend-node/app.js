const express = require('express'); // Importa Express
const cors = require('cors'); // Importa CORS
const path = require('path'); // Manejo de rutas de archivos
const usuarioRoutes = require('./src/routes/userRoutes'); // Importa rutas de usuario
const cargoRoutes = require('./src/routes/cargoRoutes'); // Importa las rutas de cargo
const routes = require('./src/routes'); // Importa el enrutador principal
const swaggerUi = require('swagger-ui-express'); // Importa Swagger UI
const swaggerJsdoc = require('swagger-jsdoc'); // Importa Swagger JSDoc
const novedadesRoutes = require('./src/routes/novedadesRoutes'); // Importación de novedades

const app = express(); // Instancia de Express
const PORT = 3000; // Define el puerto


// CORS para permitir peticiones del frontend y de Swagger
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

const swaggerDocs = swaggerJsdoc(swaggerOptions);//documentacion basada en cometarios y rutas
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs)); // Habilita interfaz de la documentación de Swagger

app.use(express.json()); // Middleware para parsear JSON para todas las rutas
app.use(express.urlencoded({ extended: true })); // Middleware para parsear URL-encoded para todas las rutas

// Rutas de API
app.use('/api', routes); // Usar el enrutador principal con prefijo /api
app.use("/api/novedades", novedadesRoutes); // Ruta original de novedades

// ruta principal al frontend (Vite)
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