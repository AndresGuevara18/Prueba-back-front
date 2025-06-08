const jwt = require('jsonwebtoken');

console.log('[AUTH] En Middleware de autenticación');

// Middleware para proteger rutas con JWT
function authenticateToken(req, res, next) {
  console.log('[AUTH] Middleware de autenticación iniciado');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: Bearer <token>

  console.log('[AUTH] Header recibido:', authHeader);
  if (!token) {
    console.log('[AUTH] Token no proporcionado');
    return res.status(401).json({ success: false, message: 'Token no proporcionado' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'secreto', (err, user) => {
    if (err) {
      console.log('[AUTH] Token inválido o expirado:', err.message);
      return res.status(403).json({ success: false, message: 'Token inválido o expirado' });
    }
    console.log('[AUTH] Token válido. Payload decodificado:', user);
    req.user = user; // El payload decodificado
    next();
  });
}

module.exports = authenticateToken;
