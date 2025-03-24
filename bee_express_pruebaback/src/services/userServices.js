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
            console.log("Resultados de la consulta:", results);

            const usuarios = results.map(row => 
                new Usuario(
                    row.id_usuario,
                    row.tipo_documento,
                    row.numero_documento,
                    row.nombre_empleado,
                    row.direccion_empelado,
                    row.telefono_empleado,
                    row.email_empleado,
                    row.eps_empleado,
                    row.usuarioadmin,
                    row.contrasenia,
                    row.id_cargo
                )
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
            console.log("Datos recibidos en el servicio:", usuarioData); // Depuración
    
            // Verificar si el número de documento ya existe
            const checkDocumentoQuery = 'SELECT id_usuario FROM usuario WHERE numero_documento = ?';
            const [existingDocumento] = await db.promise().query(checkDocumentoQuery, [usuarioData.numero_documento]);
    
            if (existingDocumento.length > 0) {
                throw new Error("DOCUMENTO_EXISTS"); // Error técnico
            }
    
            // Verificar si el correo electrónico ya existe
            const checkEmailQuery = 'SELECT id_usuario FROM usuario WHERE email_empleado = ?';
            const [existingEmail] = await db.promise().query(checkEmailQuery, [usuarioData.email_empleado]);
    
            if (existingEmail.length > 0) {
                throw new Error("EMAIL_EXISTS"); // Error técnico
            }
    
            // Verificar si el nombre de usuario ya existe (si se proporciona)
            if (usuarioData.usuarioadmin) {
                const checkUsuarioQuery = 'SELECT id_usuario FROM usuario WHERE usuarioadmin = ?';
                const [existingUsuario] = await db.promise().query(checkUsuarioQuery, [usuarioData.usuarioadmin]);
    
                if (existingUsuario.length > 0) {
                    throw new Error("USUARIO_EXISTS"); // Error técnico
                }
            }
    
            // Hashear la contraseña
            const hashedPassword = await bcrypt.hash(usuarioData.contrasenia, 10);
    
            // Insertar usuario
            const insertQuery = `INSERT INTO usuario (tipo_documento, numero_documento, nombre_empleado, 
            direccion_empelado, telefono_empleado, email_empleado, eps_empleado, usuarioadmin, contrasenia, id_cargo) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
            const [result] = await db.promise().query(insertQuery, [
                usuarioData.tipo_documento,
                usuarioData.numero_documento,
                usuarioData.nombre_empleado,
                usuarioData.direccion_empelado,
                usuarioData.telefono_empleado,
                usuarioData.email_empleado,
                usuarioData.eps_empleado,
                usuarioData.usuarioadmin,
                hashedPassword,
                usuarioData.id_cargo
            ]);
    
            console.log("Usuario insertado correctamente. ID generado:", result.insertId); // Depuración
    
            // Crear registro de reconocimiento facial
            await reconocimientoService.createReconocimiento(result.insertId, null); // null imagen (segundo parámetro)
    
            // Devolver solo el ID generado
            return result.insertId;
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