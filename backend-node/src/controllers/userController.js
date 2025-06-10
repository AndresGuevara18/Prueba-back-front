const usuarioService = require('../services/userServices'); // Importar el servicio de usuario
const cargoService = require('../services/cargoServices'); // Importar el servicio de cargos
//reconocimeinto
const axios = require('axios');
const FormData = require('form-data');
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

const usuarioController = {
  // Obtener todos los usuarios
  getAllUsers: async (req, res) => {
    try {
      console.log('🔍 Controlador Obteniendo todos los usuarios');
      // Llamar al servicio para obtener todos los usuarios
      const usuarios = await usuarioService.getAllUsers();

      // Enviar la lista de usuarios en formato JSON
      res.json(usuarios);
    } catch (error) {
      console.error('❌ Error en getAllUsers (Controller):', error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  },

  //obtener usuario mediante documento
  getUserByDocument: async (req, res) =>{
    try {
      const {numero_documento} = req.params; // ID de los parámetros de la URL
      const user = await usuarioService.getCargoByDocument(numero_documento);//llamado al servicio

      if (!user){
        return res.status(404).json({ error: 'Usuario no encontrado' }); // Si no se encuentra
      }

      res.json(user);//se envia en formato json
            
    } catch (error) {
      res.status(500).json({ error: 'Error al buscar el usuario en el controlador' });
    }
  },

  // Crear nuevo usuario
  createUser: async (req, res) => {
    try {
      console.log('✅ 1. Iniciando creación de usuario');
        
      // 1. Validar tipo de archivo
      if (req.file && !['image/jpeg', 'image/png'].includes(req.file.mimetype)) {
        console.log('❌ Tipo de archivo no válido:', req.file.mimetype);
        throw new Error('INVALID_FILE_TYPE');
      } else if (req.file) {
        console.log('✔ Archivo válido recibido. Tipo:', req.file.mimetype, 'Tamaño:', req.file.size, 'bytes');
      }
    
      // 2. Preparar datos del usuario
      const usuarioData = {
        ...req.body,
        foto: req.file ? {
          data: req.file.buffer,
          contentType: req.file.mimetype,
        } : null,
        contrasenia: req.body.contrasenia, // Asegurar que la contraseña esté incluida
      };
        
      console.log('📋 Datos del usuario preparados:', {
        ...usuarioData,
        foto: usuarioData.foto ? `[Buffer de ${usuarioData.foto.data.length} bytes]` : null,
        contrasenia: '[PROTEGIDO]',
      });
      // 3. Validaciones BÁSICAS antes de FastAPI
      // 3.1 Validar que el cargo exista
      console.log('🔍 Validando cargo con ID:', usuarioData.id_cargo);
      const cargo = await cargoService.getCargoById(usuarioData.id_cargo);
      if (!cargo) {
        console.log('❌ Cargo no encontrado con ID:', usuarioData.id_cargo);
        throw new Error('CARGO_NOT_FOUND');
      }
      console.log('✔ Cargo válido encontrado:', cargo);

      // 3.1.1 Validar si ya existen usuarios con cargos 1, 2 o 3
      const cargosExistentes = await usuarioService.existenUsuariosConCargos();
      console.log('🔎 Usuarios existentes por cargo (1,2,3):', cargosExistentes);
      // Solo se permite un usuario por cargo 1, 2 o 3
      if (['1','2','3',1,2,3].includes(usuarioData.id_cargo) && cargosExistentes[usuarioData.id_cargo] > 0) {
        throw new Error('SOLO_UNO_POR_CARGO');
      }

      // 3.2 Validar datos únicos ANTES de procesar imagen
      console.log('🔍 Validando datos únicos (documento, email, usuarioadmin)');
      await usuarioService.validarDatosUnicos(usuarioData); // <- EXTRAER ESTO como función aparte

      // 4. Validar y obtener embedding desde FastAPI
      let embedding = null;
        
      if (req.file) {
        try {
          console.log('🖼 Procesando imagen facial...');
            
          const formData = new FormData();
          formData.append('file', req.file.buffer, {
            filename: 'imagen.jpg',
            contentType: req.file.mimetype,
          });
    
          console.log('📤 Enviando imagen a FastAPI...', {
            bufferSize: req.file.buffer.length,
            headers: formData.getHeaders(),
          });
    
          const respuestaFastAPI = await axios.post('http://localhost:8000/api/verificar-imagen', formData, {
            headers: formData.getHeaders(),
          });
    
          console.log('📥 Respuesta recibida de FastAPI:', {
            status: respuestaFastAPI.status,
            data: {
              match: respuestaFastAPI.data.match,
              id_usuario: respuestaFastAPI.data.id_usuario,
              embedding: respuestaFastAPI.data.embedding ? `[Array de ${respuestaFastAPI.data.embedding.length} elementos]` : null,
            },
          });
    
          const data = respuestaFastAPI.data;
    
          if (data.match === true) {
            console.log('❌ Rostro ya registrado. ID usuario existente:', data.id_usuario);
            return res.status(400).json({
              success: false,
              message: 'El rostro ya está registrado previamente con otro usuario.',
              id_usuario: data.id_usuario,
            });
          }
    
          if (Array.isArray(data.embedding) && data.embedding.length > 0) {
            console.log('✔ Embedding recibido. Longitud:', data.embedding.length);
            embedding = data.embedding;
          } else {
            console.log('❌ No se recibió embedding válido:', data.embedding);
            throw new Error('EMBEDDING_NOT_RECEIVED');
          }
        } catch (err) {
          console.error('❌ Error en comunicación con FastAPI:', {
            message: err.message,
            response: err.response ? {
              status: err.response.status,
              data: err.response.data,
            } : null,
            stack: err.stack,
          });
          throw new Error('EMBEDDING_NOT_RECEIVED');
        }
      } else {
        console.log('⚠ No se proporcionó imagen facial - Se omitirá verificación');
      }
    
      // 5. Agregar embedding a los datos del usuario si existe
      if (embedding) {
        usuarioData.embedding = embedding; // Corregí el typo (embedding no embedding)
        console.log('🔢 Embedding agregado a datos del usuario. Longitud:', embedding.length);
      } else {
        console.log('⚠ No se agregó embedding a los datos del usuario');
      }
    
      // 6. Llamar al servicio de usuario para creación REAL
      console.log('📨 Enviando datos al servicio de usuario...');
      const nuevoUsuarioId = await usuarioService.createUser(usuarioData);
      console.log('🆔 ID de usuario creado:', nuevoUsuarioId);
    
      // 7. Generar URL de foto (si existe)
      let fotoUrl = null;
      if (req.file) {
        fotoUrl = `/uploads/fotos/usuario-${nuevoUsuarioId}.jpg`;
        // Aquí deberías guardar físicamente el archivo si es necesario
        // await guardarArchivo(req.file.buffer, fotoUrl);
      }
    
      // 8. Respuesta exitosa
      console.log('🎉 Usuario creado exitosamente');
      return res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente.',
        data: {
          id: nuevoUsuarioId,
          fotoUrl: fotoUrl,
        },
      });
    
    } catch (error) {
      console.error('❌ Error en createUser (Controller):', {
        message: error.message,
        stack: error.stack,
      });
        
      let statusCode = 500;
      let message = 'Error interno del servidor.';
    
      switch (error.message) {
      case 'CARGO_NOT_FOUND':
        statusCode = 400;
        message = 'El cargo especificado no existe.';
        break;
      case 'SOLO_UNO_POR_CARGO':
        statusCode = 400;
        message = 'Solo se permite un usuario por este cargo.';
        break;
      case 'DOCUMENTO_EXISTS':
        statusCode = 400;
        message = 'El número de documento ya está registrado.';
        break;
      case 'EMAIL_EXISTS':
        statusCode = 400;
        message = 'El correo electrónico ya está registrado.';
        break;
      case 'USUARIO_EXISTS':
        statusCode = 400;
        message = 'El nombre de usuario ya está en uso.';
        break;
      case 'INVALID_FILE_TYPE':
        statusCode = 415;
        message = 'Solo se permiten imágenes JPEG o PNG.';
        break;
      case 'LIMIT_FILE_SIZE':
        statusCode = 413;
        message = 'La imagen es demasiado grande (máximo 5MB).';
        break;
      case 'EMBEDDING_NOT_RECEIVED':
        statusCode = 500;
        message = 'No se recibió el embedding desde FastAPI.';
        break;
      case 'RECONOCIMIENTO_INSERT_FAILED':
        statusCode = 500;
        message = 'Error al guardar en la tabla de reconocimiento facial.';
        break;
      }
    
      return res.status(statusCode).json({
        success: false,
        message: message,
        error: error.message,
        ...(process.env.NODE_ENV === 'development' && {
          debug_info: {
            stack: error.stack,
          },
        }),
      });
    }
  }, 
    
  //actualizar usaurio
  updateUser: async (req, res) => {
    const { id_usuario } = req.params;
    const userData = req.body;
    
    try {
      // Validaciones básicas
      if (!userData.tipo_documento || !userData.numero_documento || !userData.nombre_empleado) {
        return res.status(400).json({ 
          success: false,
          message: 'Los campos básicos son obligatorios',
          error: 'MISSING_REQUIRED_FIELDS',
        });
      }
    
      // Validar si el cargo existe (si se está actualizando)
      if (userData.id_cargo) {
        const cargo = await cargoService.getCargoById(userData.id_cargo);
        if (!cargo) {
          throw new Error('CARGO_NOT_FOUND');
        }
      }
    
      // Llamar al servicio de actualización
      await usuarioService.updateUser(id_usuario, userData);
    
      res.json({ 
        success: true,
        message: 'Usuario actualizado correctamente',
      });
    
    } catch (error) {
      console.error('❌ Error en updateUser (Controller):', error);
    
      let statusCode = 500;
      let message = 'Error al actualizar el usuario';
    
      switch (error.message) {
      case 'USER_NOT_FOUND':
        statusCode = 404;
        message = 'El usuario no existe';
        break;
      case 'DOCUMENTO_EXISTS':
        statusCode = 400;
        message = 'El número de documento ya está registrado';
        break;
      case 'EMAIL_EXISTS':
        statusCode = 400;
        message = 'El correo electrónico ya está registrado';
        break;
      case 'USUARIO_EXISTS':
        statusCode = 400;
        message = 'El nombre de usuario ya está en uso';
        break;
      case 'CARGO_NOT_FOUND':
        statusCode = 400;
        message = 'El cargo especificado no existe';
        break;
      }
    
      res.status(statusCode).json({
        success: false,
        message: message,
        error: error.message,
      });
    }
  },

  // Eliminar un usuario
  // Método para eliminar un usuario
  deleteUser: async (req, res) => {
    try {
      const { id_usuario } = req.params;
      const resultado = await usuarioService.deleteUser(id_usuario);
        
      if (!resultado.exists) {
        return res.status(404).json({ error: '❌ Usuario no encontrado.' });
      }
          
      if (resultado.hasRegistros) {
        return res.status(400).json({ error: '⚠️ No se puede eliminar porque el usuario tiene registros de entrada asociados.' });
      }
      if (resultado.hasRegistrosSalida) {
        return res.status(400).json({ error: '⚠️ No se puede eliminar porque el usuario tiene registros de salida asociados.' });
      }
      if (resultado.hasNotificacionesSalida) {
        return res.status(400).json({ error: '⚠️ No se puede eliminar porque el usuario tiene notificaciones de salida temprana asociadas.' });
      }
      if (resultado.hasNotificacionesEntradaTarde) {
        return res.status(400).json({ error: '⚠️ No se puede eliminar porque el usuario tiene notificaciones de entrada tarde asociadas.' });
      }
      if (resultado.hasNoAsistencia) {
        return res.status(400).json({ error: '⚠️ No se puede eliminar porque el usuario tiene registros de inasistencia asociados.' });
      }
      if (resultado.deleted) {
        return res.status(200).json({ message: '✅ Usuario eliminado correctamente.' });
      }
          
      res.status(400).json({ error: '⚠️ No se pudo eliminar el usuario.' });
    } catch (error) {
      console.error('❌ Error en deleteUser (Controller):', error);
      res.status(500).json({ error: '❌ Error interno al eliminar el usuario.' });
    }
  },

  // (Eliminados los métodos de login y getProfile para moverlos a AuthController)
};

module.exports = usuarioController; // Exportar el controlador