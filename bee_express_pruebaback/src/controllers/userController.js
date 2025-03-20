const usuarioService = require('../services/userServices'); // Importar el servicio de usuario
const cargoService = require('../services/cargoServices'); // Importar el servicio de cargos

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

    // Nuevo usuario
    createUser: async (req, res) => {
        try {
            // Obtener los datos del usuario desde el cuerpo de la solicitud (req.body)
            const usuarioData = req.body;

            // Validar si el cargo existe
            const cargo = await cargoService.getCargoById(usuarioData.id_cargo);
            if (!cargo) {
                throw new Error("CARGO_NOT_FOUND");
            }

            // Llamar servicio "crear el usuario"
            const nuevoUsuario = await usuarioService.createUser(usuarioData);

            // enviar una respuesta exitosa al frontend
            res.status(201).json({
                success: true,
                message: "Usuario creado exitosamente.",
                data: nuevoUsuario
            });
        } catch (error) {
            // enviar una respuesta con el mensaje de error
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
                error: error.message
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
