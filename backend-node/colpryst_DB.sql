-- Script de migración para base de datos colpryst_col3
-- Solo incluye definiciones de tablas, triggers y procedimientos (sin ejecuciones ni pruebas)

-- Crear tabla 'horario_laboral'
CREATE TABLE IF NOT EXISTS horario_laboral (
    id_horario INT AUTO_INCREMENT PRIMARY KEY,
    hora_entrada TIME NOT NULL,
    hora_salida TIME NOT NULL,
    descripcion VARCHAR(100)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- Crear tabla 'cargo'
CREATE TABLE IF NOT EXISTS cargo (
    id_cargo INT AUTO_INCREMENT NOT NULL,
    nombre_cargo VARCHAR(80) NOT NULL,
    descripcion VARCHAR(80),
    id_horario INT NOT NULL,
    CONSTRAINT pk_cargo PRIMARY KEY (id_cargo),
    CONSTRAINT fk_cargo_horario FOREIGN KEY (id_horario) REFERENCES horario_laboral(id_horario)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- Crear tabla 'usuario'
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT AUTO_INCREMENT NOT NULL,
    tipo_documento VARCHAR(20) NOT NULL,
    numero_documento VARCHAR(20) NOT NULL UNIQUE,
    nombre_empleado VARCHAR(80) NOT NULL,
    direccion_empleado VARCHAR(80),
    telefono_empleado VARCHAR(80),
    email_empleado VARCHAR(80) NOT NULL UNIQUE,
    eps_empleado VARCHAR(80),
    usuarioadmin VARCHAR(80) UNIQUE,
    contrasenia VARCHAR(100),
    id_cargo INT NOT NULL,
    CONSTRAINT pk_usuario PRIMARY KEY (id_usuario),
    CONSTRAINT fk_usuario_cargo FOREIGN KEY (id_cargo) REFERENCES cargo (id_cargo)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- Crear tabla 'reconocimiento_facial'
CREATE TABLE IF NOT EXISTS reconocimiento_facial (
    id_foto INT AUTO_INCREMENT NOT NULL,
    embedding LONGTEXT NOT NULL,
    id_usuario INT NOT NULL,
    CONSTRAINT pk_reconocimiento_facial PRIMARY KEY (id_foto),
    CONSTRAINT fk_reconocimiento_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- Crear tabla 'registro_entrada'
CREATE TABLE IF NOT EXISTS registro_entrada (
    id_entrada INT AUTO_INCREMENT NOT NULL,
    fecha_hora DATETIME NOT NULL,
    comentarios VARCHAR(500),
    id_usuario INT NOT NULL,
    CONSTRAINT pk_registro_entrada PRIMARY KEY (id_entrada),
    CONSTRAINT fk_registro_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- Crear tabla 'notificacion_entrada_tarde'
CREATE TABLE IF NOT EXISTS notificacion_entrada_tarde (
    id_notificacion INT AUTO_INCREMENT NOT NULL,
    id_entrada INT NOT NULL,
    id_usuario INT NOT NULL,
    estado BOOLEAN NOT NULL,
    fecha_hora DATETIME NOT NULL,
    comentarios VARCHAR(500) NOT NULL,
    CONSTRAINT pk_notificacion PRIMARY KEY (id_notificacion),
    CONSTRAINT fk_notificacion_entrada FOREIGN KEY (id_entrada) REFERENCES registro_entrada (id_entrada)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- Crear tabla 'registro_salida'
CREATE TABLE IF NOT EXISTS registro_salida (
    id_salida INT AUTO_INCREMENT NOT NULL,
    fecha_hora DATETIME NOT NULL,
    comentarios VARCHAR(500),
    id_usuario INT NOT NULL,
    CONSTRAINT pk_registro_salida PRIMARY KEY (id_salida),
    CONSTRAINT fk_salida_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- Crear tabla 'notificacion_salida_temprana'
CREATE TABLE IF NOT EXISTS notificacion_salida_temprana (
    id_notificacion INT AUTO_INCREMENT NOT NULL,
    id_salida INT NOT NULL,
    id_usuario INT NOT NULL,
    estado BOOLEAN NOT NULL,
    fecha_hora DATETIME NOT NULL,
    comentarios VARCHAR(500) NOT NULL,
    CONSTRAINT pk_notificacion_salida PRIMARY KEY (id_notificacion),
    CONSTRAINT fk_notificacion_salida FOREIGN KEY (id_salida) REFERENCES registro_salida (id_salida)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- Crear tabla 'no_asistencia'
CREATE TABLE IF NOT EXISTS no_asistencia (
    id_inasistencia INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha DATE NOT NULL,
    motivo VARCHAR(255) DEFAULT 'No marcó entrada',
    CONSTRAINT fk_no_asistencia_usuario FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- TRIGGER: notificar_llegada_tarde
DELIMITER $$
CREATE TRIGGER notificar_llegada_tarde
AFTER INSERT ON registro_entrada
FOR EACH ROW
BEGIN
    DECLARE hora_limite TIME;
    SELECT h.hora_entrada INTO hora_limite
    FROM usuario u
    JOIN cargo c ON u.id_cargo = c.id_cargo
    JOIN horario_laboral h ON c.id_horario = h.id_horario
    WHERE u.id_usuario = NEW.id_usuario;
    IF TIME(NEW.fecha_hora) > hora_limite THEN
        INSERT INTO notificacion_entrada_tarde (
            id_entrada, id_usuario, estado, fecha_hora, comentarios
        ) VALUES (
            NEW.id_entrada,
            NEW.id_usuario,
            FALSE,
            NEW.fecha_hora,
            COALESCE(NEW.comentarios, 'Sin comentarios')
        );
    END IF;
END$$
DELIMITER ;

-- TRIGGER: notificar_salida_temprana
DELIMITER $$
CREATE TRIGGER notificar_salida_temprana
AFTER INSERT ON registro_salida
FOR EACH ROW
BEGIN
    DECLARE hora_limite TIME;
    SELECT h.hora_salida INTO hora_limite
    FROM usuario u
    JOIN cargo c ON u.id_cargo = c.id_cargo
    JOIN horario_laboral h ON c.id_horario = h.id_horario
    WHERE u.id_usuario = NEW.id_usuario;
    IF TIME(NEW.fecha_hora) < hora_limite THEN
        INSERT INTO notificacion_salida_temprana (
            id_salida, id_usuario, estado, fecha_hora, comentarios
        ) VALUES (
            NEW.id_salida,
            NEW.id_usuario,
            FALSE,
            NEW.fecha_hora,
            COALESCE(NEW.comentarios, 'Sin comentarios')
        );
    END IF;
END$$
DELIMITER ;

-- PROCEDIMIENTO: revisar_inasistencias
DELIMITER $$

CREATE PROCEDURE revisar_inasistencias(IN fecha_revision DATE)
BEGIN
  -- Eliminar usando la clave primaria para evitar el error
  DELETE na FROM no_asistencia na
  JOIN usuario u ON na.id_usuario = u.id_usuario
  WHERE na.fecha = fecha_revision;
  
  -- Insertar inasistencias
  INSERT INTO no_asistencia (id_usuario, fecha, motivo)
  SELECT u.id_usuario, fecha_revision, 'No marcó entrada'
  FROM usuario u
  WHERE NOT EXISTS (
    SELECT 1
    FROM registro_entrada re
    WHERE re.id_usuario = u.id_usuario
      AND DATE(re.fecha_hora) = fecha_revision
  );

  -- 1. Retornar la lista de inasistentes
  SELECT na.id_inasistencia, u.numero_documento, u.nombre_empleado, c.nombre_cargo
  FROM no_asistencia na
  JOIN usuario u ON na.id_usuario = u.id_usuario
  JOIN cargo c ON u.id_cargo = c.id_cargo
  WHERE na.fecha = fecha_revision;

  -- 2. Retornar el mensaje
  SELECT CONCAT('Se registraron ', ROW_COUNT(), ' inasistencias para el ', fecha_revision) AS mensaje;
END$$

DELIMITER ;
