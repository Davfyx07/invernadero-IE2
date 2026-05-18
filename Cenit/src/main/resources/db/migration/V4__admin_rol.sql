-- Script para cambiar el rol de un usuario a ADMIN
-- Ejecuta en PostgreSQL (tu BD cenit):

-- Opción 1: Si sabes tu email (reemplaza con tu email real):
-- UPDATE usuarios SET rol = 'ADMIN' WHERE email = 'tu-email@cenit.app';

-- Opción 2: Si no sabes tu email, lista primero los usuarios:
-- SELECT id, nombre, email, rol FROM usuarios;

-- Opción 3: Cambiar TODOS los usuarios a ADMIN (rápido para desarrollo):
UPDATE usuarios SET rol = 'ADMIN';

-- Verificar:
-- SELECT id, nombre, email, rol FROM usuarios;
