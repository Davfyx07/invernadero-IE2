-- V6: Tabla de lecturas de sensores ambientales por zona
CREATE TABLE IF NOT EXISTS lecturas_sensores (
    id BIGSERIAL PRIMARY KEY,
    zona_id BIGINT NOT NULL,
    humedad DOUBLE PRECISION NOT NULL,
    temperatura DOUBLE PRECISION NOT NULL,
    fecha_hora TIMESTAMP NOT NULL DEFAULT NOW(),
    activo BOOLEAN DEFAULT true
);
