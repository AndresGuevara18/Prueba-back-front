const usuarioService = require('../services/userServices'); // Importar el servicio de usuario

const usuarioController = {
    //todos los usuarios
    getAllUsers: async (req, res) => {
        try {
            const usuarios = await usuarioService.getAllUsers(); // Llamar al servicio
            res.json(usuarios); // Enviar la lista de usuarios en formato JSON
        } catch (error) {
            console.error("❌ Error en getAllUsers (Controller):", error);
            res.status(500).json({ error: "Error al obtener los usuarios" });
        }
    },

    // nuevo usuario
    createUser: async (req, res) => {
        try {
            // 1️⃣ Obtener los datos del usuario desde el cuerpo de la solicitud (req.body)
            const usuarioData = req.body;
    
            // 2️⃣ Obtener la foto del usuario si se subió (req.file)
            const fotoBuffer = req.file ? req.file.buffer : null;
    
            // 3️⃣ Llamar al servicio para crear el usuario
            const nuevoUsuario = await usuarioService.createUser(usuarioData);
    
            // 4️⃣ Si todo sale bien, enviar una respuesta exitosa al frontend
            res.status(201).json({
                success: true,
                message: "Usuario creado exitosamente.",
                data: nuevoUsuario
            });
        } catch (error) {
            // 5️⃣ Si ocurre un error, enviar una respuesta con el mensaje de error
            console.error("❌ Error en createUser (Controller):", error.message);
    
            let statusCode = 500;
            let message = "Error interno del servidor.";
    
            // Traducir errores técnicos a mensajes amigables
            switch (error.message) {
                case "CARGO_NOT_FOUND":
                    statusCode = 400;
                    message = "El cargo especificado no existe.";
                    break;
                case "USER_EXISTS":
                    statusCode = 400;
                    message = "El usuario con este documento o correo ya existe.";
                    break;
            }
    
            res.status(statusCode).json({
                success: false,
                message: message,
                error: error.message // Opcional: enviar el error técnico para depuración
            });
        }
    },


    //ELIMINAR USAURIO
    deleteUser: async (req, res) =>{
        try {
            const {id_usuario} = req.params; //Extraer el  ID desde la url
            const resultado = await usuarioService.deleteUser(id_usuario); //llamado servicio

            if (!resultado) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            res.json({ message: "✅ Usuario eliminado correctamente" });

        } catch (error) {
            console.error("❌Error en deleteUser:", error);
            res.status(500).json({ error: "❌Error al eliminar el usuario" }); // Manejo de errores
        }
    }
};

module.exports = usuarioController;
