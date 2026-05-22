# 🌱 Cenit

Sistema web inteligente para la administración y monitoreo de invernaderos agrícolas, desarrollado bajo una arquitectura cliente-servidor moderna utilizando React y Spring Boot.

---

# 📌 Descripción

Cenit es una plataforma web orientada a la gestión integral de invernaderos inteligentes. El sistema permite administrar cultivos, zonas, sensores, insumos y usuarios, integrando funcionalidades de monitoreo ambiental, autenticación segura y trazabilidad operativa.

La aplicación implementa una arquitectura desacoplada entre frontend y backend, permitiendo escalabilidad, mantenibilidad y despliegue independiente de cada componente.

---

# 🚀 Características principales

- 🔐 Autenticación JWT
- 🔑 Recuperación de contraseña mediante OTP
- 📧 Verificación de correo electrónico
- 👥 Gestión de usuarios y roles
- 🌱 Administración de cultivos
- 🏢 Gestión de invernaderos
- 🗺️ Administración de zonas
- 📡 Monitoreo de sensores
- 📦 Gestión de insumos agrícolas
- ⚙️ Parametrización dinámica
- 📜 Auditoría y trazabilidad
- 🔔 Sistema de notificaciones
- 📊 Visualización estructural ERD
- 🌐 Integración OAuth2 con Google

---

# 🏗️ Arquitectura del sistema


Frontend (React + Vite + Tailwind)
                │
                ▼
         API REST Spring Boot
                │
      ┌─────────┼─────────┐
      │         │         │
   Security    JWT      Services
                │
                ▼
         Spring Data JPA
                │
                ▼
            PostgreSQL
                │
                ▼
              Flyway


---

# 🧰 Tecnologías utilizadas

## Frontend

| Tecnología       | Descripción                     |
| ---------------- | ------------------------------- |
| React 19         | Biblioteca para interfaces SPA  |
| Vite             | Entorno de desarrollo y build   |
| Tailwind CSS     | Framework CSS responsive        |
| Axios            | Cliente HTTP                    |
| React Router DOM | Manejo de rutas                 |
| React Konva      | Renderizado gráfico interactivo |

---

## Backend

| Tecnología        | Descripción               |
| ----------------- | ------------------------- |
| Spring Boot 3.3.5 | Framework backend         |
| Spring Security   | Seguridad y autenticación |
| JWT               | Tokens de autenticación   |
| OAuth2 Client     | Login con Google          |
| Spring Data JPA   | Persistencia ORM          |
| PostgreSQL        | Base de datos relacional  |
| Flyway            | Control de migraciones    |
| Lombok            | Reducción de boilerplate  |
| Spring Validation | Validación de DTOs        |
| Spring Mail       | Envío de correos SMTP     |

---

# 📂 Estructura del proyecto


Cenit/
│
├── Cenit/                 # Backend Spring Boot
│   ├── src/
│   ├── pom.xml
│   └── mvnw
│
├── cenit-web/             # Frontend React
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── i18n/
│   │   ├── pages/
│   │   └── utils/
│   └── package.json
│
├── scripts/
└── .github/workflows/


---

# 🧩 Módulos del sistema

## 🔐 Autenticación

* Registro de usuarios
* Inicio de sesión
* Recuperación de contraseña
* Validación OTP
* Cambio de contraseña
* Login con Google OAuth2

---

## 👥 Usuarios

* Gestión de usuarios
* Administración de roles
* Activación/desactivación

---

## 🌱 Cultivos

* Registro de cultivos
* Control de estados
* Fechas de siembra y cosecha
* Asociación con zonas

---

## 🏢 Invernaderos

* Gestión de invernaderos
* Organización estructural
* Administración de ubicaciones

---

## 🗺️ Zonas

* Segmentación de invernaderos
* Control de capacidad
* Asociación con cultivos

---

## 📡 Sensores

* Registro de lecturas
* Monitoreo ambiental
* Seguimiento histórico

---

## 📦 Insumos

* Gestión de inventario agrícola
* Clasificación de recursos

---

## ⚙️ Parametrización

* Estados de cultivo
* Tipos de insumo
* Unidades de medida
* Configuración dinámica

---

## 📜 Auditoría

* Registro de actividades
* Historial operativo
* Trazabilidad de acciones

---

# 🗃️ Modelo relacional simplificado


Usuario
 ├── Cultivo
 ├── RegistroActividad
 ├── Notificacion
 └── OtpToken

Invernadero
 └── Zona
      ├── Cultivo
      └── LecturaSensor


---

# 🔒 Seguridad

El sistema implementa múltiples mecanismos de seguridad:

* JWT Authentication
* Spring Security
* OAuth2 Login
* Verificación OTP
* Validación de correo
* Recuperación segura de contraseña
* Validación de DTOs
* Protección de endpoints

---

# ⚙️ Configuración del entorno

## Variables de entorno backend


DB_URL=jdbc:postgresql://localhost:5432/cenit
DB_USER=postgres
DB_PASSWORD=tu_password

JWT_SECRET=tu_jwt_secret

GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

MAIL_USERNAME=correo@gmail.com
MAIL_PASSWORD=password


---

# 🛠️ Instalación

## 1️⃣ Clonar repositorio


git clone https://github.com/Davfyx07/invernadero-IE2.git


---

# ▶️ Backend

## Entrar al backend


cd Cenit


## Ejecutar aplicación

### Linux/Mac


./mvnw spring-boot:run


### Windows


mvnw.cmd spring-boot:run


El backend quedará disponible en:


http://localhost:8080


---

# ▶️ Frontend

## Entrar al frontend


cd cenit-web


## Instalar dependencias


npm install


## Ejecutar aplicación


npm run dev


El frontend quedará disponible en:


http://localhost:5173


---

# 🧪 Scripts disponibles frontend


npm run dev
npm run build
npm run preview
npm run lint


---

# 🧪 Scripts disponibles backend

## Ejecutar pruebas


./mvnw test


## Generar build

./mvnw clean install


---

# 🔄 Migraciones Flyway

Las migraciones se ejecutan automáticamente al iniciar el backend.

Ubicación:


src/main/resources/db/migration


---

# 📡 Endpoints principales

## Auth

| Método | Endpoint                  |
| ------ | ------------------------- |
| POST   | /api/auth/register        |
| POST   | /api/auth/login           |
| GET    | /api/auth/me              |
| POST   | /api/auth/verify-otp      |
| POST   | /api/auth/resend-otp      |
| POST   | /api/auth/forgot-password |
| POST   | /api/auth/reset-password  |
| POST   | /api/auth/change-password |
| POST   | /api/auth/logout          |

---

# 📈 Buenas prácticas implementadas

* Arquitectura multicapa
* DTO Pattern
* Repository Pattern
* Validación centralizada
* ORM con JPA
* Migraciones versionadas
* Configuración por perfiles
* Frontend desacoplado
* Manejo de autenticación stateless

---

# 📌 Estado del proyecto

🚧 Proyecto en desarrollo activo.

---

# 👨‍💻 Autor

Desarrollado por el equipo del proyecto Cenit.


---

# 📄 Licencia

Este proyecto es de uso académico y/o privado.

```
