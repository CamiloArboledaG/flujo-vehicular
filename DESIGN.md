# Documento de Diseño: Plataforma de Monitoreo Vehicular

Este documento detalla las decisiones de arquitectura y las elecciones de stack tecnológico para la construcción de la plataforma de monitoreo de flotas en tiempo real.

## 1. Stack Tecnológico

La plataforma se compone de dos servicios principales: un **Frontend** y un **Backend**, con una base de datos ligera para la persistencia.

- **Frontend:** [Next.js](https://nextjs.org/) (React)
- **Backend:** [Node.js](https://nodejs.org/) con [Express.js](https://expressjs.com/)
- **Base de Datos:** [SQLite](https://www.sqlite.org/index.html)
- **Comunicación en Tiempo Real:** [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) (a través de la librería `ws`)
- **Estilos y Componentes:** [Tailwind CSS](https://tailwindcss.com/) y [Lucide React](https://lucide.dev/) para iconos.

## 2. Elección del Stack y Trade-offs

### Frontend: Next.js

- **Elección:** Se optó por Next.js por su robusto ecosistema sobre React. Ofrece renderizado del lado del servidor (SSR) y generación de sitios estáticos (SSG), aunque para esta aplicación se utiliza principalmente su capacidad de renderizado del lado del cliente (CSR) con la estructura del App Router.
- **Ventajas:**
    - **Desarrollo Rápido:** El sistema de enrutamiento basado en archivos y la convención sobre configuración aceleran el desarrollo.
    - **Ecosistema React:** Acceso a un inmenso ecosistema de librerías como `recharts` para gráficos y `react-map-gl` para mapas.
    - **Rendimiento:** Las optimizaciones automáticas de Next.js (como el code-splitting por ruta) aseguran una carga inicial rápida.
- **Trade-offs:**
    - **Complejidad:** Para una aplicación puramente CSR, Next.js puede introducir una capa de complejidad mayor en comparación con una configuración simple de Create React App. Sin embargo, los beneficios de su estructura y herramientas superan este inconveniente.

### Backend: Node.js + Express.js

- **Elección:** Express.js es un framework minimalista y flexible para Node.js. Es ideal para construir APIs RESTful y manejar conexiones WebSocket de manera eficiente.
- **Ventajas:**
    - **Simplicidad y Flexibilidad:** No impone una estructura rígida, lo que nos permite diseñar la API y los servicios de la manera que mejor se adapte a nuestras necesidades.
    - **Rendimiento:** Su naturaleza asíncrona y sin bloqueo es perfecta para una aplicación con un alto volumen de operaciones de I/O, como la ingesta de datos de sensores.
    - **Ecosistema npm:** Acceso a miles de paquetes para resolver problemas comunes (ej. `cors`, `ws`).
- **Trade-offs:**
    - **Gestión Manual:** Al ser minimalista, requiere una configuración más manual para aspectos como la validación, la estructuración de código y la seguridad en comparación con frameworks más "opinados" como NestJS.

### Base de Datos: SQLite

- **Elección:** SQLite es una base de datos ligera, basada en archivos y sin necesidad de un servidor separado.
- **Ventajas:**
    - **Simplicidad Extrema:** La configuración es trivial. No hay que gestionar usuarios, redes ni servicios. Ideal para desarrollo local, prototipado y aplicaciones de pequeña a mediana escala.
    - **Portabilidad:** Toda la base de datos es un único archivo (`database.db`), lo que facilita las copias de seguridad y el despliegue.
- **Trade-offs:**
    - **Escalabilidad en Concurrencia:** SQLite no está diseñado para un alto grado de escritura concurrente. Si la aplicación creciera para manejar miles de vehículos enviando datos simultáneamente, podría convertirse en un cuello de botella. En ese escenario, una migración a una base de datos más robusta como **PostgreSQL** sería el siguiente paso lógico.

### Comunicación en Tiempo Real: WebSockets

- **Elección:** Los WebSockets proporcionan un canal de comunicación bidireccional y persistente entre el cliente y el servidor.
- **Ventajas:**
    - **Eficiencia:** Es mucho más eficiente que el polling HTTP para las actualizaciones en tiempo real. Una vez que el canal está abierto, el servidor puede empujar datos al cliente con una latencia muy baja y sin la sobrecarga de las cabeceras HTTP en cada mensaje.
    - **Idoneidad para el Caso de Uso:** Es la tecnología perfecta para el seguimiento de vehículos en un mapa y para la emisión de alertas instantáneas.
- **Trade-offs:**
    - **Gestión de Estado:** Requiere una gestión cuidadosa de la conexión (reconexiones, manejo de errores).
    - **Escalabilidad:** En un entorno con balanceo de carga, escalar WebSockets es más complejo que escalar APIs REST stateless. Se requerirían soluciones como un backplane de mensajes (ej. Redis Pub/Sub) para asegurar que un mensaje de `broadcast` llegue a todos los clientes, sin importar a qué instancia del servidor estén conectados.

## 3. Arquitectura General

- **Frontend Desacoplado:** El frontend es una aplicación completamente independiente que consume los servicios del backend a través de una API REST y una conexión WebSocket. Esto permite que cada parte evolucione de forma independiente.
- **Estado Centralizado en Frontend:** Se utilizan React Contexts (`VehicleContext`, `SensorDataContext`) para gestionar el estado global de la aplicación. Esto evita el "prop drilling" y mantiene los componentes más limpios y desacoplados de la lógica de negocio.
- **Caché Offline-First:** Se utiliza `localStorage` para cachear la lista de vehículos y sus últimas posiciones. Esto mejora drásticamente el rendimiento percibido y la resiliencia de la aplicación, permitiendo un funcionamiento básico incluso sin conexión a internet.
- **Servicios en Backend:** La lógica de negocio en el backend (como el cálculo de autonomía de combustible) está encapsulada en servicios (`fuelPredictionService.js`), separándola de la capa de controladores y rutas. 