-- V8: Convertir tipo_actividad enum a VARCHAR
ALTER TABLE registros_actividad ALTER COLUMN tipo TYPE VARCHAR(50);
