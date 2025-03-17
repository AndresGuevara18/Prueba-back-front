const db = require('../config/database'); // base de datos
const Usuario = require('../models/userModel'); // modelo de usuario
const reconocimientoService = require('./reconocimientoServices'); // servicio de reconocimiento
const bcrypt = require('bcrypt'); // bcrypt para encriptar contraseñas
const cargoService = require('./cargoServices'); // servicio de cargos

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
            // Instancia del usuario con los datos recibidos
            const usuario = new Usuario(
                null, usuarioData.tipo_documento, usuarioData.numero_documento, usuarioData.nombre_empleado, 
                usuarioData.email_empleado, usuarioData.contrasena, usuarioData.id_cargo);
    
            // Validar si el cargo existe
            const cargo = await cargoService.getCargoById(usuario.getIdCargo()); // llamada servicio cargo
            if (!cargo) {
                throw new Error("CARGO_NOT_FOUND: El cargo especificado no existe.");
            }
    
            // Verificar si el usuario ya existe 
            const checkQuery = 'SELECT id_usuario FROM usuario WHERE numero_documento = ? OR email_empleado = ?';
            const [existingUser] = await db.promise().query(checkQuery, [usuario.getNumeroDocumento(), usuario.getEmailEmpleado()]);
    
            if (existingUser.length > 0) {
                throw new Error("USER_EXISTS: El usuario con este documento o correo ya existe.");
            }
    
            // Hashear la contraseña
            const hashedPassword = await bcrypt.hash(usuario.getContrasena(), 10);
    
            // Insertar usuario
            const insertQuery = `INSERT INTO usuario (tipo_documento, numero_documento, nombre_empleado, 
            email_empleado, contrasena, id_cargo) VALUES (?, ?, ?, ?, ?, ?)`;
    
            const [result] = await db.promise().query(insertQuery, [
                usuario.getTipoDocumento(),
                usuario.getNumeroDocumento(),
                usuario.getNombreEmpleado(),
                usuario.getEmailEmpleado(),
                hashedPassword,
                usuario.getIdCargo()
            ]);
    
            usuario.setIdUsuario(result.insertId); // ID autogenerado por MySQL
    
            // Crear registro de reconocimiento facial
            await reconocimientoService.createReconocimiento(usuario.getIdUsuario(), null); // null imagen (segundo parámetro)
    
            return usuario;
        } catch (err) {
            console.error("❌ Error en createUser (Service):", err);
            throw new Error(err.message); // Lanzar el error con el mensaje original
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