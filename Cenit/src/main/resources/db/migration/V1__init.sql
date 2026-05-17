CREATE TABLE IF NOT EXISTS invernaderos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(200),
    descripcion TEXT,
    creado_en TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS zonas (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    capacidad INTEGER,
    invernadero_id BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    activo BOOLEAN NOT NULL,
    creado_en TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS cultivos (
    id BIGSERIAL PRIMARY KEY,
    especie VARCHAR(100) NOT NULL,
    variedad VARCHAR(100),
    fecha_siembra DATE NOT NULL,
    fecha_cosecha DATE,
    estado VARCHAR(20) NOT NULL,
    zona_id BIGINT NOT NULL,
    usuario_id BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS insumos (
    id BIGSERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL,
    unidad_medida VARCHAR(20) NOT NULL,
    stock_actual DOUBLE PRECISION NOT NULL
);

CREATE TABLE IF NOT EXISTS registros_actividad (
    id BIGSERIAL PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL,
    fecha TIMESTAMP NOT NULL,
    cantidad DOUBLE PRECISION,
    notas TEXT,
    cultivo_id BIGINT NOT NULL,
    insumo_id BIGINT,
    usuario_id BIGINT NOT NULL
);
