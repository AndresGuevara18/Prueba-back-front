const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'colpryts123',
  database: process.env.DB_NAME || 'colpryst_db',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL:', err);
    return;
  }
  console.log('Conectado a MySQL');
});

module.exports = connection;