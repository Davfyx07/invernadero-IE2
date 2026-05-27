# Guion de presentación de Cenit

## Introducción

Hoy presentamos Cenit, una plataforma web que desarrollamos para administrar y monitorear invernaderos agrícolas. La construimos con una arquitectura moderna de cliente-servidor, separando claramente el frontend del backend para que el sistema fuera más escalable, mantenible y fácil de desplegar.

## Qué hicimos

En este proyecto centralizamos la gestión de cultivos, zonas, sensores, insumos, usuarios y parametrización general. También añadimos autenticación segura con JWT, recuperación de contraseña, verificación por correo, integración con Google y trazabilidad operativa para tener mejor control de la aplicación.

Además, organizamos el sistema para que no dependiera de una sola capa. El frontend se encarga de la experiencia visual y de la interacción con el usuario, mientras que el backend concentra la lógica de negocio, la seguridad y el acceso a datos.

## Cómo lo construimos

En el frontend usamos React con Vite y Tailwind CSS para crear una interfaz rápida, modular y responsiva. Las llamadas al backend se hacen mediante Axios, y la navegación se gestiona con React Router.

En el backend usamos Spring Boot, Spring Security, Spring Data JPA, Flyway y PostgreSQL. Eso nos permitió manejar autenticación, persistencia, validaciones y migraciones de base de datos de forma ordenada. También usamos correo electrónico y parámetros dinámicos para cubrir los flujos más importantes de la plataforma.

## Cómo lo desplegamos

El despliegue lo preparamos para un VPS con Ubuntu usando Docker. El backend se empaqueta en una imagen ligera y se levanta con Docker Compose, exponiendo el servicio en el puerto 8080. Encima de eso, Nginx actúa como proxy inverso para publicar la aplicación bajo el dominio que corresponda y centralizar el acceso externo.

La idea fue mantener el contenedor de producción limpio. Por eso, los elementos de desarrollo y automatización no viven dentro del runtime de la aplicación. El backend corre solo con Java, mientras que las tareas de apoyo se ejecutan fuera del entorno productivo cuando hace falta.

## Qué automatizamos

Automatizamos la integración continua con GitHub Actions. Cada vez que hacemos push o abrimos un pull request, se ejecutan validaciones separadas para backend y frontend.

En backend, el flujo compila el proyecto con Java 21, ejecuta las pruebas y genera Javadoc. En frontend, instalamos dependencias con Node 20, ejecutamos lint, pruebas y build. Con eso nos aseguramos de detectar errores antes de desplegar.

También automatizamos tareas de apoyo con Python. Uno de los scripts valida mensajes de commit contra Taiga y otro compara cambios recientes para generar un resumen de modificaciones. Esos scripts se usan como herramientas de trabajo y en CI, no como parte visible de la aplicación en producción.

## Cómo funciona la aplicación

Cuando un usuario entra a la plataforma, el frontend consulta al backend a través de la API REST. El backend verifica permisos, aplica reglas de negocio y consulta la base de datos. Si el usuario está autenticado, el sistema le muestra la información que le corresponde según su rol.

El flujo general es sencillo: el usuario interactúa con la interfaz, el frontend envía peticiones HTTP, el backend procesa la solicitud, JPA accede a PostgreSQL y la respuesta vuelve al navegador. Así mantenemos una separación clara entre presentación, lógica y datos.

## Qué decidimos dejar fuera

Al final, decidimos sacar de la interfaz pública el panel de auditoría de commits. Esa funcionalidad la dejamos como herramienta local y de automatización, porque en producción no aporta valor al usuario final y sí agrega complejidad al contenedor.

Con esa decisión mantenemos el despliegue más liviano, más seguro y más fácil de mantener. En lugar de exponer herramientas internas en la web, las usamos donde realmente tienen sentido: en desarrollo y en CI.

## Cierre

En resumen, construimos una solución completa para invernaderos con frontend moderno, backend robusto, despliegue en Docker, automatización con GitHub Actions y una estructura preparada para crecer. Lo más importante es que dejamos el sistema ordenado, desplegable y fácil de evolucionar.