const db = require('../config/database'); // base de datos
const Usuario = require('../models/userModel'); // modelo de usuario
const reconocimientoService = require('./reconocimientoServices'); // servicio de reconocimiento
const bcrypt = require('bcrypt'); // bcrypt para encriptar contraseñas

const usuarioService = {
    // Obtener todos los usuarios 
    getAllUsers: async () => {
        const query = 'SELECT * FROM usuario';
        try {
            //console.log("Ejecutando consulta SQL:", query);
            const [results] = await db.promise().query(query);
            //console.log("Resultados de la consulta:", results);

            const usuarios = results.map(row => 
                new Usuario(row.id_usuario, row.tipo_documento, row.numero_documento, row.nombre_empleado, 
                    row.email_empleado, row.contrasena, row.id_cargo)
            );

            return usuarios;
        } catch (err) {
            console.error("❌ Error en getAllUsers (Service):", err);
            throw new Error("Error al obtener los usuarios.");
        }
    },

    // Nuevo usuario 
    createUser: async (usuarioData) => {
        try {
            // Verificar si el usuario ya existe
            const checkQuery = 'SELECT id_usuario FROM usuario WHERE numero_documento = ? OR email_empleado = ?';
            const [existingUser] = await db.promise().query(checkQuery, [usuarioData.numero_documento, usuarioData.email_empleado]);
    
            if (existingUser.length > 0) {
                throw new Error("USER_EXISTS"); // Error técnico
            }
    
            // Hashear la contraseña
            const hashedPassword = await bcrypt.hash(usuarioData.contrasena, 10);
    
            // Insertar usuario
            const insertQuery = `INSERT INTO usuario (tipo_documento, numero_documento, nombre_empleado, 
            email_empleado, contrasena, id_cargo) VALUES (?, ?, ?, ?, ?, ?)`;
    
            const [result] = await db.promise().query(insertQuery, [
                usuarioData.tipo_documento,
                usuarioData.numero_documento,
                usuarioData.nombre_empleado,
                usuarioData.email_empleado,
                hashedPassword,
                usuarioData.id_cargo
            ]);
    
            // Obtener el ID recién generado
            const idUsuarioGenerado = result.insertId;
    
            // Crear registro de reconocimiento facial
            await reconocimientoService.createReconocimiento(idUsuarioGenerado, null); // null imagen (segundo parámetro)
    
            // Devolver solo el ID generado
            return idUsuarioGenerado;
        } catch (err) {
            console.error("❌ Error en createUser (Service):", err);
            throw err; // Lanzar el error técnico sin modificar
        }
    },

    // ELIMINAR USUARIO
    deleteUser: async (id_usuario) => {
        const query = 'DELETE FROM reconocimiento_facial WHERE id_usuario = ?';
        try {
            // Eliminar reconocimiento facial
            await db.promise().query(query, [id_usuario]);

            // Eliminar el usuario
            const [result] = await db.promise().query('DELETE FROM usuario WHERE id_usuario = ?', [id_usuario]);

            if (result.affectedRows === 0) {
                throw new Error("⚠️ No se encontró el usuario para eliminar.");
            }

            return { message: '✅ Usuario eliminado correctamente' };
        } catch (err) {
            console.error("❌ Error en deleteUser (Service):", err);
            throw new Error("Error al eliminar el usuario: " + err.message);
        }
    }
};

module.exports = usuarioService; // Exportamos el servicio