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
            const nuevoUsuario = await usuarioService.createUser(usuarioData, fotoBuffer);
    
            // 4️⃣ Si todo sale bien, enviar una respuesta exitosa al frontend
            res.status(201).json({
                message: "✅ Usuario creado exitosamente.",
                usuario: nuevoUsuario
            });
        } catch (error) {
            // 5️⃣ Si ocurre un error, enviar una respuesta con el mensaje de error
            console.error("❌ Error en createUser (Controller):", error.message);
    
            // Determinar el código de estado adecuado según el tipo de error
            const statusCode = error.message.includes("⚠️") ? 400 : 500;
    
            res.status(statusCode).json({ error: error.message });
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
