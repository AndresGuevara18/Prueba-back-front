//src/services/userServices.js
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
          row.direccion_empleado, row.telefono_empleado, row.email_empleado, row.eps_empleado, 
          row.usuarioadmin, row.contrasenia, row.id_cargo),
      );

      return usuarios;
    } catch (err) {
      console.error('❌ Error en getAllUsers (Service):', err);
      throw new Error('Error al obtener los usuarios.');
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

      console.log('Resultados de la consulta nombre cargo:', cargoUser);

      return {
        id_usuario: userResult[0].id_usuario,
        tipo_documento: userResult[0].tipo_documento,
        numero_documento: userResult[0].numero_documento,
        nombre_empleado: userResult[0].nombre_empleado,
        direccion_empleado: userResult[0].direccion_empleado,
        telefono_empleado: userResult[0].telefono_empleado,
        email_empleado: userResult[0].email_empleado,
        eps_empleado: userResult[0].eps_empleado,
        usuarioadmin: userResult[0].usuarioadmin,
        contrasenia:userResult[0].contrasenia,
        id_cargo:userResult[0].id_cargo,
        cargo_user: cargoUser, 
      };

    } catch (err) {
      throw err;
    }
  },

  // Nuevo usuario
  createUser: async (usuarioData) => {
    try {
      console.log('📡 [DEBUG] Datos recibidos en el servicio:', {
        ...usuarioData,
        foto: usuarioData.foto ? `[Buffer de ${usuarioData.foto.data.length} bytes]` : null,
        embedding: usuarioData.embedding ? `[Array de ${usuarioData.embedding.length} elementos]` : null,
        contrasenia: '[PROTEGIDO]',
      });
    
      // 1. Validar número de documento
      const [existingDocumento] = await db.promise().query(
        'SELECT id_usuario FROM usuario WHERE numero_documento = ?',
        [usuarioData.numero_documento],
      );
      if (existingDocumento.length > 0) {
        console.log('❌ [DEBUG] Documento ya existe:', usuarioData.numero_documento);
        throw new Error('DOCUMENTO_EXISTS');
      }
    
      // 2. Validar email
      const [existingEmail] = await db.promise().query(
        'SELECT id_usuario FROM usuario WHERE email_empleado = ?',
        [usuarioData.email_empleado],
      );
      if (existingEmail.length > 0) {
        console.log('❌ [DEBUG] Email ya existe:', usuarioData.email_empleado);
        throw new Error('EMAIL_EXISTS');
      }
    
      // 3. Validar usuario admin (si aplica)
      if (usuarioData.usuarioadmin) {
        const [existingUsuario] = await db.promise().query(
          'SELECT id_usuario FROM usuario WHERE usuarioadmin = ?',
          [usuarioData.usuarioadmin],
        );
        if (existingUsuario.length > 0) {
          console.log('❌ [DEBUG] Usuario admin ya existe:', usuarioData.usuarioadmin);
          throw new Error('USUARIO_EXISTS');
        }
      }
    
      // 4. Hashear contraseña
      const hashedPassword = await bcrypt.hash(usuarioData.contrasenia, 10);
      console.log('🔐 [DEBUG] Contraseña hasheada correctamente');
    
      // 5. Insertar usuario
      const insertQuery = `
                INSERT INTO usuario (
                    tipo_documento, numero_documento, nombre_empleado,
                    direccion_empleado, telefono_empleado, email_empleado,
                    eps_empleado, usuarioadmin, contrasenia, id_cargo
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
      const [result] = await db.promise().query(insertQuery, [
        usuarioData.tipo_documento,
        usuarioData.numero_documento,
        usuarioData.nombre_empleado,
        usuarioData.direccion_empleado,
        usuarioData.telefono_empleado,
        usuarioData.email_empleado,
        usuarioData.eps_empleado,
        usuarioData.usuarioadmin,
        hashedPassword,
        usuarioData.id_cargo,
      ]);
    
      const userId = result.insertId;
      console.log('✅ [DEBUG] Usuario insertado correctamente. ID:', userId);
      //console.log("🔢 [DEBUG] Embedding recibido:", usuarioData.embedding ? `Array[${usuarioData.embedding.length}]` : null);
            
      // 6. [OPCIONAL] Si necesitas procesar el reconocimiento después:
      // await reconocimientoService.createReconocimiento(userId, usuarioData.embedding);
      // Después de crear el usuario:
      await reconocimientoService.createReconocimiento(
        userId,                // ID del usuario nuevo
        usuarioData.embedding,  // Array[128] del embedding
      );
      return userId;
    
    } catch (err) {
      console.error('❌ [DEBUG] Error en createUser (Service):', {
        message: err.message,
        stack: err.stack,
      });
      throw err; // Re-lanzar el error para el controlador
    }
  },

  validarDatosUnicos: async (usuarioData) => {
    // Validar número de documento
    const [existingDocumento] = await db.promise().query(
      'SELECT id_usuario FROM usuario WHERE numero_documento = ?',
      [usuarioData.numero_documento],
    );
    if (existingDocumento.length > 0) {
      throw new Error('DOCUMENTO_EXISTS');
    }
  
    // Validar email
    const [existingEmail] = await db.promise().query(
      'SELECT id_usuario FROM usuario WHERE email_empleado = ?',
      [usuarioData.email_empleado],
    );
    if (existingEmail.length > 0) {
      throw new Error('EMAIL_EXISTS');
    }
  
    // Validar nombre de usuario si existe
    if (usuarioData.usuarioadmin) {
      const [existingUsuario] = await db.promise().query(
        'SELECT id_usuario FROM usuario WHERE usuarioadmin = ?',
        [usuarioData.usuarioadmin],
      );
      if (existingUsuario.length > 0) {
        throw new Error('USUARIO_EXISTS');
      }
    }
  },

  //ACTUALIZAR USUARIO
  updateUser: async (id_usuario, userData) => {      
    try {
      const userExists = 'SELECT id_usuario FROM usuario WHERE id_usuario = ?';
      // 1. Verificar si el usuario existe
      const [checkUserExists] = await db.promise().execute(userExists, [id_usuario]);
            
      if (checkUserExists.length === 0) {
        throw new Error('USER_NOT_FOUND');
      }

      // 2. Validaciones de datos únicos (excepto para el usuario actual)
            
      // Verificar si el número de documento ya existe en otro usuario
      if (userData.numero_documento) {
        const checkDocumentoQuery = `SELECT id_usuario FROM usuario     
                                            WHERE numero_documento = ? AND id_usuario != ?`;
        const [existingDocumento] = await db.promise().query(checkDocumentoQuery, 
          [userData.numero_documento, id_usuario]);
                
        if (existingDocumento.length > 0) {
          throw new Error('DOCUMENTO_EXISTS');
        }
      }

      // Verificar si el correo electrónico ya existe en otro usuario
      if (userData.email_empleado) {
        const checkEmailQuery = `SELECT id_usuario FROM usuario 
                                        WHERE email_empleado = ? AND id_usuario != ?`;
        const [existingEmail] = await db.promise().query(checkEmailQuery, 
          [userData.email_empleado, id_usuario]);
                
        if (existingEmail.length > 0) {
          throw new Error('EMAIL_EXISTS');
        }
      }

      // Verificar si el nombre de usuario ya existe en otro usuario (si se proporciona)
      if (userData.usuarioadmin) {
        const checkUsuarioQuery = 'SELECT id_usuario FROM usuario WHERE usuarioadmin = ? AND id_usuario != ?';
        const [existingUsuario] = await db.promise().query(checkUsuarioQuery, 
          [userData.usuarioadmin, id_usuario]);
                
        if (existingUsuario.length > 0) {
          throw new Error('USUARIO_EXISTS');
        }
      }

      // 3. Manejo de la contraseña
      let hashedPassword;
            
      if (userData.contrasenia && userData.contrasenia.trim() !== '') {
        // Si se proporcionó nueva contraseña: Hashear
        hashedPassword = await bcrypt.hash(userData.contrasenia, 10);
      } else {
        // Si NO se proporcionó contraseña: Obtener la actual
        const [rows] = await db.promise().execute(
          'SELECT contrasenia FROM usuario WHERE id_usuario = ?', 
          [id_usuario],
        );
        hashedPassword = rows[0].contrasenia;
      }

      // 4. Consulta SQL de actualización
      const query = `UPDATE usuario SET 
                tipo_documento = COALESCE(?, tipo_documento), 
                numero_documento = COALESCE(?, numero_documento), 
                nombre_empleado = COALESCE(?, nombre_empleado),
                direccion_empleado = COALESCE(?, direccion_empleado), 
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
        userData.direccion_empleado,
        userData.telefono_empleado,
        userData.email_empleado,
        userData.eps_empleado,
        userData.usuarioadmin,
        hashedPassword, // Usa la contraseña hasheada (nueva o anterior)
        userData.id_cargo,
        id_usuario,
      ]);

      return result;

    } catch (error) {
      console.error('❌ Error en updateUser (Service):', error);
      throw error;
    }
  },

  // ELIMINAR USUARIO
  deleteUser: async (id_usuario) => {
    const queryCheckUser = 'SELECT id_usuario FROM usuario WHERE id_usuario = ?';
    const queryCheckRegistro = 'SELECT COUNT(*) AS total FROM registro_entrada WHERE id_usuario = ?';
    const queryCheckRegistroSalida = 'SELECT COUNT(*) AS total FROM registro_salida WHERE id_usuario = ?';
    const queryCheckNotificacionSalida = 'SELECT COUNT(*) AS total FROM notificacion_salida_temprana WHERE id_usuario = ?';
    const queryCheckNoAsistencia = 'SELECT COUNT(*) AS total FROM no_asistencia WHERE id_usuario = ?';
    const queryCheckNotificacionEntradaTarde = 'SELECT COUNT(*) AS total FROM notificacion_entrada_tarde WHERE id_entrada IN (SELECT id_entrada FROM registro_entrada WHERE id_usuario = ?)';
    const queryReco = 'DELETE FROM reconocimiento_facial WHERE id_usuario = ?';
    const queryUser = 'DELETE FROM usuario WHERE id_usuario = ?';
        
    try {
      // Verificar si el usuario existe
      const [userResult] = await db.promise().query(queryCheckUser, [parseInt(id_usuario)]);
      if (userResult.length === 0) {
        console.log(`❌ Usuario con ID ${id_usuario} no encontrado.`);
        return { exists: false };
      }
        
      // Verificar si hay registros de entrada asociados
      const [registroResult] = await db.promise().query(queryCheckRegistro, [parseInt(id_usuario)]);
      if (registroResult[0].total > 0) {
        console.log(`⚠️ No se puede eliminar el usuario ${id_usuario}, tiene ${registroResult[0].total} registros de entrada asociados.`);
        return { exists: true, hasRegistros: true };
      }
      // Verificar si hay registros de salida asociados
      const [registroSalidaResult] = await db.promise().query(queryCheckRegistroSalida, [parseInt(id_usuario)]);
      if (registroSalidaResult[0].total > 0) {
        console.log(`⚠️ No se puede eliminar el usuario ${id_usuario}, tiene ${registroSalidaResult[0].total} registros de salida asociados.`);
        return { exists: true, hasRegistrosSalida: true };
      }
      // Verificar si hay notificaciones de salida temprana asociadas
      const [notificacionSalidaResult] = await db.promise().query(queryCheckNotificacionSalida, [parseInt(id_usuario)]);
      if (notificacionSalidaResult[0].total > 0) {
        console.log(`⚠️ No se puede eliminar el usuario ${id_usuario}, tiene ${notificacionSalidaResult[0].total} notificaciones de salida temprana asociadas.`);
        return { exists: true, hasNotificacionesSalida: true };
      }
      // Verificar si hay inasistencias asociadas
      const [noAsistenciaResult] = await db.promise().query(queryCheckNoAsistencia, [parseInt(id_usuario)]);
      if (noAsistenciaResult[0].total > 0) {
        console.log(`⚠️ No se puede eliminar el usuario ${id_usuario}, tiene ${noAsistenciaResult[0].total} registros de inasistencia asociados.`);
        return { exists: true, hasNoAsistencia: true };
      }
      // Verificar si hay notificaciones de entrada tarde asociadas
      const [notificacionEntradaTardeResult] = await db.promise().query(queryCheckNotificacionEntradaTarde, [parseInt(id_usuario)]);
      if (notificacionEntradaTardeResult[0].total > 0) {
        console.log(`⚠️ No se puede eliminar el usuario ${id_usuario}, tiene ${notificacionEntradaTardeResult[0].total} notificaciones de entrada tarde asociadas.`);
        return { exists: true, hasNotificacionesEntradaTarde: true };
      }
        
      // Eliminar reconocimiento facial primero (si no hay registros de entrada)
      await db.promise().query(queryReco, [parseInt(id_usuario)]);
        
      // Eliminar el usuario
      const [deleteResult] = await db.promise().query(queryUser, [parseInt(id_usuario)]);
        
      if (deleteResult.affectedRows > 0) {
        console.log(`✅ Usuario con ID ${id_usuario} eliminado correctamente.`);
        return { exists: true, deleted: true };
      } else {
        console.log(`⚠️ Usuario con ID ${id_usuario} no se eliminó.`);
        return { exists: true, deleted: false };
      }
    } catch (err) {
      console.error('❌ Error en deleteUser (Service):', err);
      throw err;
    }
  },

  // Verificar si existen usuarios con id_cargo 1, 2 o 3
  existenUsuariosConCargos: async () => {
    const query = 'SELECT id_cargo, COUNT(*) as cantidad FROM usuario WHERE id_cargo IN (1,2,3) GROUP BY id_cargo';
    try {
      const [results] = await db.promise().query(query);
      // Retorna un objeto con la cantidad por cada cargo
      const cargos = { 1: 0, 2: 0, 3: 0 };
      results.forEach(row => {
        cargos[row.id_cargo] = row.cantidad;
      });
      return cargos;
    } catch (err) {
      console.error('❌ Error en existenUsuariosConCargos (Service):', err);
      throw new Error('Error al verificar usuarios con cargos 1, 2 o 3.');
    }
  },
};

module.exports = usuarioService; // Exportamos el servicio