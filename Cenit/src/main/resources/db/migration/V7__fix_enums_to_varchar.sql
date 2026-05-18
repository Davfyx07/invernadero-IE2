-- V7: Convertir enums a VARCHAR para coincidir con entidades Java (ahora usan String)
ALTER TABLE cultivos ALTER COLUMN estado TYPE VARCHAR(50);
ALTER TABLE insumos ALTER COLUMN tipo TYPE VARCHAR(50);
