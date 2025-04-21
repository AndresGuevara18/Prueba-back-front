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
                new Usuario( row.id_usuario, row.tipo_documento, row.numero_documento, row.nombre_empleado, 
                    row.direccion_empelado, row.telefono_empleado, row.email_empleado, row.eps_empleado, 
                    row.usuarioadmin, row.contrasenia, row.id_cargo)
            );

            return usuarios;
        } catch (err) {
            console.error("❌ Error en getAllUsers (Service):", err);
            throw new Error("Error al obtener los usuarios.");
        }
    },

    // Obtener usuario mediante documento, incluyendo el nombre del cargo
    getCargoByDocument: async (numero_documento) => {
        const queryUser = 'SELECT * FROM usuario WHERE numero_documento = ?';
        const queryCargo = `
            SELECT c.nombre_cargo AS cargo_user
            FROM usuario u 
            INNER JOIN cargo c ON u.id_cargo = c.id_cargo 
            WHERE u.numero_documento = ?;
        `;

        try {
            // Ejecutar consulta de usuario
            const [userResult] = await db.promise().execute(queryUser, [numero_documento]);

            if (userResult.length === 0) return null; // Si el usuario no existe

            // Ejecutar consulta de cargo
            const [cargoResult] = await db.promise().execute(queryCargo, [numero_documento]);

            // Verificar si se encontró un cargo
            const cargoUser = cargoResult.length > 0 ? cargoResult[0].cargo_user : null;

            console.log("Resultados de la consulta nombre cargo:", cargoUser);

            return {
                id_usuario: userResult[0].id_usuario,
                tipo_documento: userResult[0].tipo_documento,
                numero_documento: userResult[0].numero_documento,
                nombre_empleado: userResult[0].nombre_empleado,
                direccion_empelado: userResult[0].direccion_empelado,
                telefono_empleado: userResult[0].telefono_empleado,
                email_empleado: userResult[0].email_empleado,
                eps_empleado: userResult[0].eps_empleado,
                usuarioadmin: userResult[0].usuarioadmin,
                contrasenia:userResult[0].contrasenia,
                id_cargo:userResult[0].id_cargo,
                cargo_user: cargoUser 
            };

        } catch (err) {
            throw err;
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
            const fotoBuffer = usuarioData.foto ? usuarioData.foto.data : null;
            await reconocimientoService.createReconocimiento(result.insertId, fotoBuffer);
            //await reconocimientoService.createReconocimiento(result.insertId, null); // null imagen (segundo parámetro)
    
            // Devolver solo el ID generado
            return result.insertId;
        } catch (err) {
            console.error("❌ Error en createUser (Service):", err);
            throw err; // Lanzar el error técnico sin modificar
        }
    },

    //ACTUALIZAR USUARIO
    updateUser: async (id_usuario, userData) => {      
        try {
            const userExists = "SELECT id_usuario FROM usuario WHERE id_usuario = ?";
            // 1. Verificar si el usuario existe
            const [checkUserExists] = await db.promise().execute(userExists, [id_usuario]);
            
            if (checkUserExists.length === 0) {
                throw new Error("USER_NOT_FOUND");
            }

            // 2. Validaciones de datos únicos (excepto para el usuario actual)
            
            // Verificar si el número de documento ya existe en otro usuario
            if (userData.numero_documento) {
                const checkDocumentoQuery = `SELECT id_usuario FROM usuario     
                                            WHERE numero_documento = ? AND id_usuario != ?`;
                const [existingDocumento] = await db.promise().query(checkDocumentoQuery, 
                                [userData.numero_documento, id_usuario]);
                
                if (existingDocumento.length > 0) {
                    throw new Error("DOCUMENTO_EXISTS");
                }
            }

            // Verificar si el correo electrónico ya existe en otro usuario
            if (userData.email_empleado) {
                const checkEmailQuery = `SELECT id_usuario FROM usuario 
                                        WHERE email_empleado = ? AND id_usuario != ?`;
                const [existingEmail] = await db.promise().query(checkEmailQuery, 
                                [userData.email_empleado, id_usuario]);
                
                if (existingEmail.length > 0) {
                    throw new Error("EMAIL_EXISTS");
                }
            }

            // Verificar si el nombre de usuario ya existe en otro usuario (si se proporciona)
            if (userData.usuarioadmin) {
                const checkUsuarioQuery = 'SELECT id_usuario FROM usuario WHERE usuarioadmin = ? AND id_usuario != ?';
                const [existingUsuario] = await db.promise().query(checkUsuarioQuery, 
                                [userData.usuarioadmin, id_usuario]);
                
                if (existingUsuario.length > 0) {
                    throw new Error("USUARIO_EXISTS");
                }
            }

            // 3. Manejo de la contraseña
            let hashedPassword;
            
            if (userData.contrasenia && userData.contrasenia.trim() !== "") {
                // Si se proporcionó nueva contraseña: Hashear
                hashedPassword = await bcrypt.hash(userData.contrasenia, 10);
            } else {
                // Si NO se proporcionó contraseña: Obtener la actual
                const [rows] = await db.promise().execute(
                    "SELECT contrasenia FROM usuario WHERE id_usuario = ?", 
                    [id_usuario]
                );
                hashedPassword = rows[0].contrasenia;
            }

            // 4. Consulta SQL de actualización
            const query = `UPDATE usuario SET 
                tipo_documento = COALESCE(?, tipo_documento), 
                numero_documento = COALESCE(?, numero_documento), 
                nombre_empleado = COALESCE(?, nombre_empleado),
                direccion_empelado = COALESCE(?, direccion_empelado), 
                telefono_empleado = COALESCE(?, telefono_empleado), 
                email_empleado = COALESCE(?, email_empleado), 
                eps_empleado = COALESCE(?, eps_empleado), 
                usuarioadmin = COALESCE(?, usuarioadmin),
                contrasenia = ?, 
                id_cargo = COALESCE(?, id_cargo) 
                WHERE id_usuario = ?`;

            // 5. Ejecutar la actualización
            const [result] = await db.promise().execute(query, [
                userData.tipo_documento,
                userData.numero_documento,
                userData.nombre_empleado,
                userData.direccion_empelado,
                userData.telefono_empleado,
                userData.email_empleado,
                userData.eps_empleado,
                userData.usuarioadmin,
                hashedPassword, // Usa la contraseña hasheada (nueva o anterior)
                userData.id_cargo,
                id_usuario
            ]);

            return result;

        } catch (error) {
            console.error("❌ Error en updateUser (Service):", error);
            throw error;
        }
    },
    /*updateUser: async (id_usuario, userData) => {
        try {
            // 1. Manejo de la contraseña
            let hashedPassword;
            
            if (userData.contrasenia && userData.contrasenia.trim() !== "") {
                // Si se proporcionó nueva contraseña: Hashear
                hashedPassword = await bcrypt.hash(userData.contrasenia, 10);
            } else {
                // Si NO se proporcionó contraseña: Obtener la actual
                const [rows] = await db.promise().execute(
                    "SELECT contrasenia FROM usuario WHERE id_usuario = ?", 
                    [id_usuario]
                );
                
                if (rows.length === 0) {
                    throw new Error("Usuario no encontrado");
                }
                
                hashedPassword = rows[0].contrasenia;
            }
    
            // 2. Consulta SQL de actualización
            const query = `UPDATE usuario SET 
                tipo_documento = ?, 
                numero_documento = ?, 
                nombre_empleado = ?,
                direccion_empelado = ?, 
                telefono_empleado = ?, 
                email_empleado = ?, 
                eps_empleado = ?, 
                usuarioadmin = ?,
                contrasenia = ?, 
                id_cargo = ? 
                WHERE id_usuario = ?`;
    
            // 3. Ejecutar la actualización
            const [result] = await db.promise().execute(query, [
                userData.tipo_documento,
                userData.numero_documento,
                userData.nombre_empleado,
                userData.direccion_empelado,
                userData.telefono_empleado,
                userData.email_empleado,
                userData.eps_empleado,
                userData.usuarioadmin,
                hashedPassword, // Usa la contraseña hasheada (nueva o anterior)
                userData.id_cargo,
                id_usuario
            ]);
    
            return result;
    
        } catch (error) {
            console.error("❌ Error en updateUser (Service):", error);
            throw error;
        }
    }*/

    // ELIMINAR USUARIO
    deleteUser: async (id_usuario) => {
        const queryReco = 'DELETE FROM reconocimiento_facial WHERE id_usuario = ?';
        const queryUser = 'DELETE FROM usuario WHERE id_usuario = ?';

        try {
            // Eliminar reconocimiento facial
            await db.promise().query(queryReco, [id_usuario]);

            // Eliminar el usuario
            const [result] = await db.promise().execute(queryUser, [id_usuario]);

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