const usuarioService = require('../services/userServices'); // Importar el servicio de usuario
const cargoService = require('../services/cargoServices'); // Importar el servicio de cargos

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

    // Nuevo usuario
    createUser: async (req, res) => {
        try {
            console.log("Datos recibidos en el controlador:", req.body); // Depuración
    
            // Obtener los datos del usuario desde el cuerpo de la solicitud (req.body)
            const usuarioData = req.body;
    
            // Validar si el cargo existe
            const cargo = await cargoService.getCargoById(usuarioData.id_cargo);
            if (!cargo) {
                throw new Error("CARGO_NOT_FOUND");
            }
    
            // Llamar servicio "crear el usuario"
            const nuevoUsuario = await usuarioService.createUser(usuarioData);
    
            // Enviar una respuesta exitosa al frontend
            res.status(201).json({
                success: true,
                message: "Usuario creado exitosamente.",
                data: nuevoUsuario
            });
        } catch (error) {
            console.error("❌ Error en createUser (Controller):", error.message);
    
            let statusCode = 500;
            let message = "Error interno del servidor.";
    
            // Traducir errores técnicos a mensajes amigables
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
            // Validaciones básicas (sin incluir contraseña como obligatoria)
            if (!userData.tipo_documento || !userData.numero_documento || !userData.nombre_empleado) {
                return res.status(400).json({ 
                    success: false,
                    error: "Los campos básicos son obligatorios" 
                });
            }
    
            // Llamar al servicio de actualización
            const resultado = await usuarioService.updateUser(id_usuario, userData);
    
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false,
                    error: "No se encontró el usuario para actualizar" 
                });
            }
    
            res.json({ 
                success: true,
                message: "✅ Usuario actualizado correctamente",
                data: {
                    id: id_usuario,
                    camposActualizados: Object.keys(userData).filter(key => key !== 'contrasenia'),
                    cambioContrasenia: !!userData.contrasenia
                }
            });
    
        } catch (error) {
            console.error("❌ Error en updateUser (Controller):", error);
            res.status(500).json({ 
                success: false,
                error: error.message || "Error al actualizar el usuario" 
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