const pool = require('../config/database'); // Asumiendo que tienes un pool de conexiones configurado

class NovedadesService {
    async getCombinedNovelties(queryParams) {
        const { periodo, searchTerm, page = 1, limit = 10 } = queryParams;
        // console.log('[NovedadesService] Query Params Recibidos:', queryParams);
        const offset = (page - 1) * limit;

        let conditionsEntrada = [];
        let conditionsSalida = [];

        let startDate;
        let endDate;

        // Filtro de PERIODO
        if (periodo) {
            const now = new Date(); 
            // console.log(`[NovedadesService] Calculando periodo: ${periodo}, Fecha actual (now): ${now.toISOString()}`);

            switch (periodo) {
                case 'today':
                    startDate = new Date(now);
                    startDate.setHours(0, 0, 0, 0);
                    endDate = new Date(now);
                    endDate.setHours(23, 59, 59, 999);
                    break;
                case 'yesterday':
                    startDate = new Date(now);
                    startDate.setDate(startDate.getDate() - 1);
                    startDate.setHours(0, 0, 0, 0);
                    endDate = new Date(now);
                    endDate.setDate(endDate.getDate() - 1);
                    endDate.setHours(23, 59, 59, 999);
                    break;
                case 'week': 
                    startDate = new Date(now);
                    startDate.setDate(startDate.getDate() - startDate.getDay());
                    startDate.setHours(0, 0, 0, 0);
                    endDate = new Date(now); 
                    endDate.setHours(23, 59, 59, 999);
                    break;
                case 'month':
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    startDate.setHours(0, 0, 0, 0);
                    endDate = new Date(now); 
                    endDate.setHours(23, 59, 59, 999);
                    break;
            }
            // console.log(`[NovedadesService] Periodo: ${periodo}, StartDate: ${startDate?.toISOString()}, EndDate: ${endDate?.toISOString()}`);

            if (startDate && endDate) { // Asegurarse que ambas fechas estén definidas
                conditionsEntrada.push('re.fecha_hora >= ?');
                conditionsSalida.push('rs.fecha_hora >= ?');
                // params.push(startDate, startDate); // Eliminado

                conditionsEntrada.push('re.fecha_hora <= ?');
                conditionsSalida.push('rs.fecha_hora <= ?');
                // params.push(endDate, endDate); // Eliminado
            }
        }

        // Filtro de SEARCHTERM
        if (searchTerm) {
            const searchTermLike = `%${searchTerm}%`;
            conditionsEntrada.push(`(u.nombre_empleado LIKE ? OR c.nombre_cargo LIKE ?)`);
            conditionsSalida.push(`(u.nombre_empleado LIKE ? OR c.nombre_cargo LIKE ?)`);
            // params.push(searchTermLike, searchTermLike, searchTermLike, searchTermLike); // Eliminado
        }
        
        const whereClauseEntrada = conditionsEntrada.length > 0 ? `WHERE ${conditionsEntrada.join(' AND ')}` : '';
        const whereClauseSalida = conditionsSalida.length > 0 ? `WHERE ${conditionsSalida.join(' AND ')}` : '';

        // Parámetros para las consultas individuales (antes de combinarlos para la consulta UNION)
        const paramsEntrada = [];
        const paramsSalida = [];

        if (startDate && endDate) { // Usar las variables startDate y endDate definidas en el bloque de periodo
            paramsEntrada.push(startDate, endDate);
            paramsSalida.push(startDate, endDate);
        }
        if (searchTerm) {
            const searchTermLike = `%${searchTerm}%`;
            paramsEntrada.push(searchTermLike, searchTermLike);
            paramsSalida.push(searchTermLike, searchTermLike);
        }
        // console.log('[NovedadesService] Params Entrada:', paramsEntrada);
        // console.log('[NovedadesService] Params Salida:', paramsSalida);

        const baseQueryEntradasTarde = `
            SELECT 
                'entrada_tarde' AS tipo_novedad,
                ne.id_notificacion AS id_novedad,
                u.nombre_empleado AS nombre_usuario,
                re.fecha_hora AS fecha_hora_evento,
                c.nombre_cargo AS cargo_usuario,
                ne.comentarios AS detalle_novedad
            FROM notificacion_entrada_tarde ne
            JOIN registro_entrada re ON ne.id_entrada = re.id_entrada
            JOIN usuario u ON re.id_usuario = u.id_usuario
            JOIN cargo c ON u.id_cargo = c.id_cargo
            ${whereClauseEntrada}
        `;

        const baseQuerySalidasTempranas = `
            SELECT 
                'salida_temprana' AS tipo_novedad,
                ns.id_notificacion AS id_novedad,
                u.nombre_empleado AS nombre_usuario,
                rs.fecha_hora AS fecha_hora_evento,
                c.nombre_cargo AS cargo_usuario,
                ns.comentarios AS detalle_novedad
            FROM notificacion_salida_temprana ns
            JOIN registro_salida rs ON ns.id_salida = rs.id_salida
            JOIN usuario u ON rs.id_usuario = u.id_usuario
            JOIN cargo c ON u.id_cargo = c.id_cargo
            ${whereClauseSalida}
        `;

        const countQuery = `
            SELECT COUNT(*) AS total
            FROM (
                ${baseQueryEntradasTarde}
                UNION ALL
                ${baseQuerySalidasTempranas}
            ) AS combined_novelties
        `;
        
        const dataQuery = `
            SELECT *
            FROM (
                ${baseQueryEntradasTarde}
                UNION ALL
                ${baseQuerySalidasTempranas}
            ) AS combined_novelties
            ORDER BY fecha_hora_evento DESC
            LIMIT ?
            OFFSET ?
        `;

        // Los parámetros para countQuery y dataQuery deben ser la concatenación de paramsEntrada y paramsSalida
        // y luego los de paginación para dataQuery
        const combinedParamsForCount = [...paramsEntrada, ...paramsSalida];
        const combinedParamsForData = [...paramsEntrada, ...paramsSalida, parseInt(limit), parseInt(offset)];

        // console.log('[NovedadesService] SQL Count Query:', countQuery);
        // console.log('[NovedadesService] SQL Count Params:', combinedParamsForCount);
        // console.log('[NovedadesService] SQL Data Query:', dataQuery);
        // console.log('[NovedadesService] SQL Data Params:', combinedParamsForData);

        try {
            const [totalResult] = await pool.query(countQuery, combinedParamsForCount);
            const totalNovedades = totalResult[0].total;
            // console.log('[NovedadesService] Total Novedades (Count):', totalNovedades);
            
            const [novedades] = await pool.query(dataQuery, combinedParamsForData);
            // console.log('[NovedadesService] Novedades Obtenidas (Data):', novedades.length);
            
            return {
                novedades,
                totalNovedades,
                paginaActual: parseInt(page),
                totalPaginas: Math.ceil(totalNovedades / limit)
            };
        } catch (error) {
            console.error('Error al obtener novedades:', error);
            throw error;
        }
    }
}

module.exports = new NovedadesService();
