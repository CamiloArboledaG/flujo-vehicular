# Guía de Despliegue Local

Este documento proporciona los pasos necesarios para configurar y ejecutar la aplicación de monitoreo vehicular en un entorno de desarrollo local.

## Prerrequisitos

Asegúrate de tener instalado lo siguiente en tu sistema:

- [Node.js](https://nodejs.org/) (versión 18.x o superior)
- [npm](https://www.npmjs.com/) (generalmente se instala con Node.js)

## Estructura del Proyecto

El proyecto está organizado en dos directorios principales:

- `frontend/`: Contiene la aplicación de cliente desarrollada con Next.js.
- `backend/`: Contiene el servidor de API y WebSocket desarrollado con Express.js.

## Pasos para la Configuración

Deberás seguir los pasos de configuración para ambos, el backend y el frontend, en terminales separadas.

### 1. Configuración del Backend

Abre una terminal y navega hasta el directorio del backend.

```bash
cd backend
```

**a. Instalar Dependencias:**
Ejecuta el siguiente comando para instalar todas las dependencias del servidor.

```bash
npm install
```

**b. Inicializar la Base de Datos:**
La primera vez que configures el proyecto, necesitas crear e inicializar la base de datos SQLite con datos de prueba.

```bash
npm run seed
```
Este comando creará el archivo `database.db` y lo poblará con vehículos y datos de sensores de ejemplo. Solo necesitas ejecutarlo una vez.

**c. Configurar Variables de Entorno del Backend:**
El backend utiliza un archivo `.env` para gestionar el puerto y el secreto para los JSON Web Tokens (JWT).

1. En la raíz del directorio `backend/`, crea un archivo llamado `.env`.
2. Añade el siguiente contenido al archivo:

```
PORT=3001
JWT_SECRET=este-es-un-secreto-muy-largo-y-dificil-de-adivinar-12345
```
Puedes cambiar el secreto si lo deseas por cualquier otra cadena de texto segura.

**d. Ejecutar el Servidor Backend:**
Inicia el servidor. Gracias al archivo `.env`, se ejecutará en el puerto especificado (`3001` por defecto).

```bash
npm start
```
Verás un mensaje indicando que el servidor está escuchando en el puerto 3001. Deja esta terminal abierta.

### 2. Configuración del Frontend

Abre una **nueva** terminal y navega hasta el directorio del frontend.

```bash
cd frontend
```

**a. Instalar Dependencias:**
Ejecuta el siguiente comando para instalar todas las dependencias de la aplicación cliente.

```bash
npm install
```

**b. Configurar Variables de Entorno:**
El mapa requiere una clave de API de un proveedor de mapas como MapTiler.
1. Crea una cuenta en [MapTiler](https://www.maptiler.com/).
2. Obtén tu clave de API.
3. Crea un archivo llamado `.env.local` en la raíz del directorio `frontend/`.
4. Añade tu clave de API al archivo de la siguiente manera:

```
NEXT_PUBLIC_MAPTILER_API_KEY=TU_CLAVE_DE_API_AQUI
```

**c. Ejecutar la Aplicación Frontend:**
Inicia la aplicación de desarrollo de Next.js. Por defecto, se ejecutará en `http://localhost:3000`.

```bash
npm run dev
```
Verás un mensaje indicando que la aplicación está lista.

### 3. Acceder a la Aplicación

¡Todo listo! Abre tu navegador y visita [http://localhost:3000](http://localhost:3000).

Deberías ver la interfaz de la aplicación, con la lista de vehículos cargada y sus posiciones en el mapa. La comunicación con el backend (API y WebSockets) ya estará funcionando. 