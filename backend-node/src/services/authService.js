const db = require('../config/database');

// Validar si el usuario tiene un cargo autorizado para login
const isCargoAutorizado = (id_cargo) => {
  return [1, 2, 3, '1', '2', '3'].includes(id_cargo);
};

// Buscar usuario por nombre de usuario (usuarioadmin)
const getUserByUsername = async (usuarioadmin) => {
  const query = 'SELECT * FROM usuario WHERE usuarioadmin = ?';
  try {
    const [results] = await db.promise().query(query, [usuarioadmin]);
    console.log('[DEBUG] getUserByUsername - usuarioadmin:', usuarioadmin, '| Resultados:', results);
    if (results.length === 0) return null;
    return results[0];
  } catch (err) {
    console.error('❌ Error en getUserByUsername (authService):', err);
    throw new Error('Error al buscar usuario por nombre de usuario.');
  }
};

module.exports = {
  isCargoAutorizado,
  getUserByUsername,
};
