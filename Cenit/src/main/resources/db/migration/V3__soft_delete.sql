-- V3: Soft delete global — añadir columna activo a tablas que no la tienen
ALTER TABLE invernaderos ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;
ALTER TABLE zonas ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;
ALTER TABLE cultivos ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;
ALTER TABLE insumos ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;
ALTER TABLE registros_actividad ADD COLUMN IF NOT EXISTS activo BOOLEAN DEFAULT true;
