// PASO A PASO: Generar hash bcrypt para el usuario administrador inicial
//
// 1. Abre una terminal en esta carpeta.
// 2. Ejecuta: npm install bcrypt
// 3. Edita la variable 'password' con la contraseña que desees para el admin.
// 4. Ejecuta: node hash.js
// 5. Copia el hash generado y úsalo en tu INSERT de MySQL.

const bcrypt = require('bcrypt');
const password = 'Admin123'; // Cambia esto por la contraseña deseada

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log('Hash bcrypt generado para tu contraseña:');
  console.log(hash);
});
