-- Crear tabla 'cargo'
create table cargo (
    id_cargo int auto_increment not null,
    nombre_cargo varchar(80) not null,
    descripcion varchar(80),
    constraint pk_cargo primary key (id_cargo)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- Crear tabla 'usuario'
create table usuario (
    id_usuario int auto_increment not null,
    tipo_documento varchar(20) not null,
    numero_documento varchar(20) not null unique,
    nombre_empleado varchar(80) not null,
    direccion_empleado varchar(80),
    telefono_empleado varchar(80), 
    email_empleado varchar(80) not null unique,
    eps_empleado varchar(80),
    usuarioadmin varchar(80) unique,
    contrasenia varchar(100),
    id_cargo int not null,
    constraint pk_usuario primary key (id_usuario),
    constraint fk_usuario_cargo foreign key (id_cargo) references cargo (id_cargo)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- Crear tabla 'reconocimiento_facial'
CREATE TABLE reconocimiento_facial (
    id_foto INT AUTO_INCREMENT NOT NULL,
    embedding LONGTEXT NOT NULL,  -- Aquí se guarda el embedding como texto (ej: "[0.1, -0.2, ...]")
    id_usuario INT NOT NULL,
    CONSTRAINT pk_reconocimiento_facial PRIMARY KEY (id_foto),
    CONSTRAINT fk_reconocimiento_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- Crear tabla 'registro_entrada'
create table registro_entrada (
    id_entrada int auto_increment not null,
    fecha_hora datetime not null,
    comentarios varchar(500),
    id_usuario int not null,
    constraint pk_registro_entrada primary key (id_entrada),
    constraint fk_registro_usuario foreign key (id_usuario) references usuario (id_usuario)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- Crear tabla 'notificacion_entrada_tarde'
create table notificacion_entrada_tarde (
    id_notificacion int auto_increment not null,
    id_entrada int not null,
    id_usuario int not null,
    estado boolean not null,
    fecha_hora datetime not null,
    comentarios varchar(500) not null,
    constraint pk_notificacion primary key (id_notificacion),
    constraint fk_notificacion_entrada foreign key (id_entrada) references registro_entrada (id_entrada)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- Crear tabla 'registro_salida'
create table registro_salida (
    id_salida int auto_increment not null,
    fecha_hora datetime not null,
    comentarios varchar(500),
    id_usuario int not null,
    constraint pk_registro_salida primary key (id_salida),
    constraint fk_salida_usuario foreign key (id_usuario) references usuario (id_usuario)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- Crear tabla 'notificacion_salida_temprana'
CREATE TABLE notificacion_salida_temprana (
    id_notificacion INT AUTO_INCREMENT NOT NULL,
    id_salida INT NOT NULL,
    id_usuario INT NOT NULL,
    estado BOOLEAN NOT NULL,
    fecha_hora DATETIME NOT NULL,
    comentarios VARCHAR(500) NOT NULL,
    CONSTRAINT pk_notificacion_salida PRIMARY KEY (id_notificacion),
    CONSTRAINT fk_notificacion_salida FOREIGN KEY (id_salida) REFERENCES registro_salida (id_salida),
    CONSTRAINT fk_notificacion_salida_usuario FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;

-- crear tabla 'registro_inasistencia'
create table registro_inasistencia(
    id_inasistencia INT AUTO_INCREMENT NOT NULL,
    fecha_hora DATETIME NOT NULL,
    comentarios VARCHAR(500),
    estado BOOLEAN NOT NULL,
    id_usuario int not null,
    constraint pk_inasistencia primary key (id_inasistencia),
    constraint fk_inasistencia foreign key (id_usuario) references usuario (id_usuario)
)ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish2_ci;