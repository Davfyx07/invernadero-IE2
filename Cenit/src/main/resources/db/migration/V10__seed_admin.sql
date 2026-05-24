# ─── Admin inicial en produccion ───────────────────
# Solo inserta si la tabla esta vacia (primer deploy).
# La password se hashea via el endpoint /api/auth/register
# o se debe insertar manualmente con BCrypt.

INSERT INTO usuarios (nombre, email, password, rol, activo, email_verified, first_login, creado_en)
SELECT 'Admin', '${ADMIN_EMAIL:admin@cenit.app}',
       '${ADMIN_BCRYPT_PASSWORD:$2a$10$placeholder}',
       'ADMIN', true, true, false, NOW()
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = '${ADMIN_EMAIL:admin@cenit.app}');
