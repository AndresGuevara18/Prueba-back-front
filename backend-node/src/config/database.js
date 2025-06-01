const mysql = require('mysql2/promise'); // Importar la versión con promesas

// Configuración del pool de conexiones
const pool = mysql.createPool({
    host: 'localhost',          // Cambia según tu configuración
    user: 'root',               // Tu usuario de MySQL
    password: 'Ximenez96',       // Tu contraseña de MySQL (ya la tienes configurada)
    database: 'colpryst_col3',      // Nombre de tu base de datos
    waitForConnections: true,
    connectionLimit: 10,        // Número máximo de conexiones en el pool
    queueLimit: 0               // Sin límite en la cola de espera de conexiones
});

// Probar la conexión (opcional, pero útil para depuración inicial)
pool.getConnection()
    .then(connection => {
        console.log('Conectado a MySQL a través del pool');
        connection.release(); // Liberar la conexión de vuelta al pool
    })
    .catch(err => {
        console.error('Error conectando a MySQL a través del pool:', err);
    });

module.exports = pool;