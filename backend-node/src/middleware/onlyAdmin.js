// src/middleware/onlyAdmin.js
module.exports = (req, res, next) => {
  const cargosAdmin = [1, 2, 3, '1', '2', '3'];
  if (req.user && cargosAdmin.includes(req.user.id_cargo)) {
    return next();
  }
  return res.status(403).json({ message: 'Acceso solo para administradores.' });
};
