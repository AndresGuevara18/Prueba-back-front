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
            // Llamar al servicio para obtener todos los usuarios
            const usuarios = await usuarioService.getAllUsers();

            // Enviar la lista de usuarios en formato JSON
            res.json(usuarios);
        } catch (error) {
            console.error("❌ Error en getAllUsers (Controller):", error);
            res.status(500).json({ error: "Error al obtener los usuarios" });
        }
    },

    //obtener usuario mediante documento
    getUserByDocument: async (req, res) =>{
        try {
            const {numero_documento} = req.params; // ID de los parámetros de la URL
            const user = await usuarioService.getCargoByDocument(numero_documento);//llamado al servicio

            if (!user){
                return res.status(404).json({ error: "Usuario no encontrado" }); // Si no se encuentra
            }

            res.json(user);//se envia en formato json
            
        } catch (error) {
            res.status(500).json({ error: "Error al buscar el usuario en el controlador" });
        }
    },

     // Crear nuevo usuario
  createUser: async (req, res) => {
    try {
      // 1. Preparar datos del usuario desde req.body y req.file
      const usuarioData = {
        ...req.body,
        foto: req.file ? {
          data: req.file.buffer,
          contentType: req.file.mimetype
        } : null
      };

      // 2. Validar que el cargo exista
      const cargo = await cargoService.getCargoById(usuarioData.id_cargo);
      if (!cargo) {
        throw new Error("CARGO_NOT_FOUND");
      }

      // 3. Validar si se subió una foto y enviar a FastAPI para verificar duplicado
      if (req.file) {
        try {
          const formData = new FormData();
          formData.append('file', req.file.buffer, {
            filename: 'imagen.jpg',
            contentType: req.file.mimetype
          });

          const respuestaFastAPI = await axios.post('http://localhost:8000/verificar-imagen', formData, {
            headers: formData.getHeaders()
          });

          console.log("✅ Respuesta de FastAPI:", respuestaFastAPI.data);

          if (respuestaFastAPI.data.match === true) {
            return res.status(400).json({
              success: false,
              message: "El rostro ya está registrado previamente con otro usuario.",
              id_usuario: respuestaFastAPI.data.id_usuario
            });
          }

        } catch (err) {
          console.error("❌ Error al enviar imagen a FastAPI:", err.response ? err.response.data : err.message);
          return res.status(500).json({
            success: false,
            message: "Error al verificar imagen en FastAPI",
            error: err.message
          });
        }
      }

      // 4. Crear el usuario en la base de datos
      const nuevoUsuario = await usuarioService.createUser(usuarioData);

      // 5. Construir respuesta exitosa
      const respuestaFinal = {
        success: true,
        message: "Usuario creado exitosamente.",
        data: {
          id: nuevoUsuario.id
        }
      };

      // Añadir URL de la foto si fue cargada
      if (req.file) {
        respuestaFinal.data.fotoUrl = `/uploads/fotos/usuario-${nuevoUsuario.id}.jpg`;
      }

      res.status(201).json(respuestaFinal);

    } catch (error) {
      console.error("❌ Error en createUser (Controller):", error.message);

      let statusCode = 500;
      let message = "Error interno del servidor.";

      // 6. Manejo de errores personalizados
      switch (error.message) {
        case "CARGO_NOT_FOUND":
          statusCode = 400;
          message = "El cargo especificado no existe.";
          break;
        case "DOCUMENTO_EXISTS":
          statusCode = 400;
          message = "El número de documento ya está registrado.";
          break;
        case "EMAIL_EXISTS":
          statusCode = 400;
          message = "El correo electrónico ya está registrado.";
          break;
        case "USUARIO_EXISTS":
          statusCode = 400;
          message = "El nombre de usuario ya está en uso.";
          break;
        case "INVALID_FILE_TYPE":
          statusCode = 415;
          message = "Solo se permiten imágenes JPEG o PNG.";
          break;
        case "LIMIT_FILE_SIZE":
          statusCode = 413;
          message = "La imagen es demasiado grande (máximo 5MB).";
          break;
      }

      res.status(statusCode).json({
        success: false,
        message: message,
        error: error.message
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
                    message: "Los campos básicos son obligatorios",
                    error: "MISSING_REQUIRED_FIELDS"
                });
            }
    
            // Validar si el cargo existe (si se está actualizando)
            if (userData.id_cargo) {
                const cargo = await cargoService.getCargoById(userData.id_cargo);
                if (!cargo) {
                    throw new Error("CARGO_NOT_FOUND");
                }
            }
    
            // Llamar al servicio de actualización
            await usuarioService.updateUser(id_usuario, userData);
    
            res.json({ 
                success: true,
                message: "Usuario actualizado correctamente"
            });
    
        } catch (error) {
            console.error("❌ Error en updateUser (Controller):", error);
    
            let statusCode = 500;
            let message = "Error al actualizar el usuario";
    
            switch (error.message) {
                case "USER_NOT_FOUND":
                    statusCode = 404;
                    message = "El usuario no existe";
                    break;
                case "DOCUMENTO_EXISTS":
                    statusCode = 400;
                    message = "El número de documento ya está registrado";
                    break;
                case "EMAIL_EXISTS":
                    statusCode = 400;
                    message = "El correo electrónico ya está registrado";
                    break;
                case "USUARIO_EXISTS":
                    statusCode = 400;
                    message = "El nombre de usuario ya está en uso";
                    break;
                case "CARGO_NOT_FOUND":
                    statusCode = 400;
                    message = "El cargo especificado no existe";
                    break;
            }
    
            res.status(statusCode).json({
                success: false,
                message: message,
                error: error.message
            });
        }
    },

    // Eliminar un usuario
    deleteUser: async (req, res) => {
        try {
            // Extraer el ID del usuario desde la URL
            const { id_usuario } = req.params;

            // Llamar al servicio para eliminar el usuario
            const resultado = await usuarioService.deleteUser(id_usuario);

            // Verificar si el usuario fue eliminado correctamente
            if (!resultado) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            // Enviar una respuesta exitosa al frontend
            res.json({ message: "✅ Usuario eliminado correctamente" });
        } catch (error) {
            console.error("❌ Error en deleteUser (Controller):", error);
            res.status(500).json({ error: "❌ Error al eliminar el usuario" }); // Manejo de errores
        }
    }
};

module.exports = usuarioController; // Exportar el controlador