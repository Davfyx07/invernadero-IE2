-- V9: Tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
    id BIGSERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    titulo VARCHAR(100) NOT NULL,
    mensaje VARCHAR(500) NOT NULL,
    tipo VARCHAR(30),
    leida BOOLEAN DEFAULT false,
    creado_en TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notificaciones_usuario ON notificaciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leida ON notificaciones(usuario_id, leida);
