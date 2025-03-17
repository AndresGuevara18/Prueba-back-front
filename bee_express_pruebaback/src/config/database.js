const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',  // Cambia según tu configuración
    user: 'root',       // Tu usuario de MySQL
    password: 'admin123',       // Tu contraseña de MySQL
    database: 'colpryst_col3'  // Nombre de tu base de datos
});

connection.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL');
});

module.exports = connection;