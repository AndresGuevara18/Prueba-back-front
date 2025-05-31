const db = require('../config/database');
const ReconocimientoFacial = require('../models/reconocimentoModel');

const reconocimientoService = {
  createReconocimiento: async (id_usuario, embedding) => { // Eliminamos fotoBuffer si no lo usas
    // Validaciones obligatorias
    if (!id_usuario) throw new Error('ID de usuario no proporcionado');
    if (!embedding || !Array.isArray(embedding)) {
      throw new Error('Embedding no proporcionado o formato incorrecto');
    }

    try {
      console.log('🔢 [DEBUG] Embedding recibido para almacenar:', {
        id_usuario,
        embedding_length: embedding.length,
        primeros_3_valores: embedding.slice(0, 3), // Para depuración
      });

      // 1. Convertir el array a string (para LONGTEXT)
      const embeddingString = JSON.stringify(embedding);

      // 2. Insertar en la tabla
      const insertQuery = `
                INSERT INTO reconocimiento_facial 
                (embedding, id_usuario) 
                VALUES (?, ?)
            `;
      const [result] = await db.promise().query(insertQuery, [
        embeddingString,
        id_usuario,
      ]);

      console.log('✅ Registro facial insertado. ID:', result.insertId);

      return new ReconocimientoFacial(
        result.insertId,
        id_usuario,
        embedding, // Opcional: pasar el embedding al modelo
      );

    } catch (err) {
      console.error('❌ Error en createReconocimiento:', {
        message: err.message,
        stack: err.stack,
        sqlError: err.sqlMessage, // Detalles específicos de MySQL
      });
      throw new Error('RECONOCIMIENTO_INSERT_FAILED');
    }
  },
};

module.exports = reconocimientoService;