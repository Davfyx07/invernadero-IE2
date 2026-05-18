-- V2: Tabla de parámetros configurables (tipos de insumo, estados, etc.)
CREATE TABLE IF NOT EXISTS parametros (
    id BIGSERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT true,
    UNIQUE(tipo, codigo)
);

-- Seed de valores por defecto
INSERT INTO parametros (tipo, codigo, nombre) VALUES
    ('TIPO_INSUMO', 'FERTILIZANTE', 'Fertilizante'),
    ('TIPO_INSUMO', 'PESTICIDA', 'Pesticida'),
    ('TIPO_INSUMO', 'AGUA', 'Agua'),
    ('TIPO_INSUMO', 'OTRO', 'Otro'),
    ('ESTADO_CULTIVO', 'ACTIVO', 'Activo'),
    ('ESTADO_CULTIVO', 'COSECHADO', 'Cosechado'),
    ('ESTADO_CULTIVO', 'PERDIDO', 'Perdido'),
    ('TIPO_ACTIVIDAD', 'RIEGO', 'Riego'),
    ('TIPO_ACTIVIDAD', 'FERTILIZACION', 'Fertilización'),
    ('TIPO_ACTIVIDAD', 'FUMIGACION', 'Fumigación'),
    ('TIPO_ACTIVIDAD', 'INSPECCION', 'Inspección'),
    ('TIPO_ACTIVIDAD', 'OTRO', 'Otro'),
    ('UNIDAD_MEDIDA', 'kg', 'Kilogramos'),
    ('UNIDAD_MEDIDA', 'L', 'Litros'),
    ('UNIDAD_MEDIDA', 'g', 'Gramos'),
    ('UNIDAD_MEDIDA', 'ml', 'Mililitros'),
    ('UNIDAD_MEDIDA', 'unidad', 'Unidad')
ON CONFLICT (tipo, codigo) DO NOTHING;
