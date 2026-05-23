# Diccionario de Datos

_Generado automáticamente desde las entidades JPA. Total entidades: 10_

## Cultivo
**Tabla:** `cultivos`

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| id | Long | Sí | - | Clave primaria |
| especie | String | No | - |  |
| variedad | String | Sí | - |  |
| fechaSiembra | LocalDate | No | - |  |
| fechaCosecha | LocalDate | Sí | - |  |
| estado | String | No | - |  |
| zona_id | Long | No | - |  |
| usuario_id | Long | No | - |  |
| activo | boolean | No | true |  |

## Insumo
**Tabla:** `insumos`

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| id | Long | Sí | - | Clave primaria |
| nombre | String | No | - |  |
| tipo | String | No | - |  |
| unidadMedida | String | No | - |  |
| stockActual | Double | No | - |  |
| activo | boolean | No | true |  |

## Invernadero
**Tabla:** `invernaderos`
Contiene método `@PrePersist`.

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| id | Long | Sí | - | Clave primaria |
| nombre | String | No | - |  |
| ubicacion | String | Sí | - |  |
| descripcion | String | Sí | - |  |
| creadoEn | LocalDateTime | No | LocalDateTime.now() | Se inicializa automáticamente en @PrePersist |
| activo | boolean | No | true |  |

## LecturaSensor
**Tabla:** `lecturas_sensores`

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| id | Long | Sí | - | Clave primaria |
| zona_id | Long | No | - |  |
| humedad | Double | No | - |  |
| temperatura | Double | No | - |  |
| fechaHora | LocalDateTime | No | - |  |
| activo | boolean | No | true |  |

## Notificacion
**Tabla:** `notificaciones`
Contiene método `@PrePersist`.

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| id | Long | Sí | - | Clave primaria |
| usuario_id | Long | No | - |  |
| titulo | String | No | - |  |
| mensaje | String | No | - |  |
| tipo | String | Sí | - |  |
| leida | boolean | No | false |  |
| creadoEn | LocalDateTime | No | LocalDateTime.now() | Se inicializa automáticamente en @PrePersist |

## OtpToken
**Tabla:** `otp_tokens`
Contiene método `@PrePersist`.

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| id | Long | Sí | - | Clave primaria |
| email | String | No | - |  |
| code | String | No | - |  |
| type | String | No | - |  |
| expiry | LocalDateTime | No | - |  |
| used | boolean | No | false |  |
| createdAt | LocalDateTime | No | LocalDateTime.now() | Se inicializa automáticamente en @PrePersist |

## Parametro
**Tabla:** `parametros`

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| id | Long | Sí | - | Clave primaria |
| tipo | String | No | - |  |
| codigo | String | No | - |  |
| nombre | String | No | - |  |
| activo | boolean | No | true |  |

## RegistroActividad
**Tabla:** `registros_actividad`

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| id | Long | Sí | - | Clave primaria |
| tipo | String | No | - |  |
| fecha | LocalDateTime | No | - |  |
| cantidad | Double | Sí | - |  |
| notas | String | Sí | - |  |
| cultivo_id | Long | No | - |  |
| insumo_id | Long | Sí | - |  |
| usuario_id | Long | No | - |  |
| activo | boolean | No | true |  |

## Usuario
**Tabla:** `usuarios`
Contiene método `@PrePersist`.

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| id | Long | Sí | - | Clave primaria |
| nombre | String | No | - |  |
| email | String | No | - |  |
| password | String | No | - |  |
| rol | Rol | No | - | Enumeración |
| activo | boolean | No | true |  |
| emailVerified | boolean | No | false |  |
| firstLogin | boolean | No | true |  |
| creadoEn | LocalDateTime | No | LocalDateTime.now() | Se inicializa automáticamente en @PrePersist |

## Zona
**Tabla:** `zonas`

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|-------------|
| id | Long | Sí | - | Clave primaria |
| nombre | String | No | - |  |
| capacidad | Integer | Sí | - |  |
| invernadero_id | Long | No | - |  |
| activo | boolean | No | true |  |
