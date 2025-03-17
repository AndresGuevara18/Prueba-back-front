const db = require('../config/database'); // Importar la conexión a la base de datos
const ReconocimientoFacial = require('../models/reconocimentoModel'); // Importar el modelo

const reconocimientoService = {
    createReconocimiento: async (id_usuario, fotoBuffer) => {
        // ⚠️ Validar que el ID del usuario sea obligatorio
        if (!id_usuario) { 
            throw new Error("⚠️ ID de usuario no proporcionado.");
        }

        try {
            //comprobar envio de datos el id
            console.log("📸 Insertando usuario en reconocimiento_facial con imagen NULL...");
            
            // Insertar el ID del usuario en la tabla `reconocimiento_facial`
            // Si no hay imagen (`fotoBuffer = null`), se insertará NULL en `fotografia_emple`
            const insertQuery = 'INSERT INTO reconocimiento_facial (fotografia_emple, id_usuario) VALUES (?, ?)';
            const [result] = await db.promise().query(insertQuery, [fotoBuffer, id_usuario]);

            // 🔹 Devolvemos el objeto con los datos insertados
            return new ReconocimientoFacial(result.insertId, fotoBuffer, id_usuario);
        } catch (err) {
            console.error("❌ Error al insertar en reconocimiento_facial:", err.message);
            throw new Error("❌ Error al guardar en reconocimiento_facial: " + err.message);
        }
    }
};

module.exports = reconocimientoService; // Exportamos el servicio para usarlo en los controladores
