# LibroBazaar: Plataforma de Venta de Libros

## Resumen del Proyecto "LibroBazaar"

**LibroBazaar** es una aplicación web full-stack que simula una plataforma de venta de libros en línea. Permite a los usuarios registrarse, iniciar sesión (mediante autenticación JWT) y comprar libros de un catálogo disponible.

El proyecto está construido sobre una arquitectura **Node.js/Express** utilizando **Sequelize** como ORM para la gestión de la base de datos **PostgreSQL**, y renderiza vistas dinámicas usando el motor de plantillas **Handlebars**.

La lógica del lado del cliente (`registro.js`, `login.js`, `libros.js`) utiliza peticiones `fetch` para interactuar con los *endpoints* del servidor, procesar el token JWT y manejar la visualización de errores y mensajes.

## Tecnologías Utilizadas

| Categoría | Tecnología | Archivos Relevantes |
| :--- | :--- | :--- |
| **Backend** | **Node.js** | `server.js`, `package.json` |
| **Framework Web** | **Express** | `server.js`, `*.router.js` |
| **Base de Datos** | **PostgreSQL** | Configuración en `.env` y `database.js` |
| **ORM** | **Sequelize** | `database.js`, `*.model.js`, `relaciones.js` |
| **Autenticación** | **JWT** (`jsonwebtoken`, `express-jwt`) | `auth.middleware.js`, `usuarios.controller.js` |
| **Hashing** | **Bcryptjs** | `auth.middleware.js`, `usuarios.controller.js` |
| **Vistas** | **Handlebars** (`express-handlebars`) | `main.hbs`, `views/` |
| **Frontend/Estilos** | **JavaScript (ES Modules)**, **Bootstrap** | `public/js/`, `main.hbs` |
| **Manejo de Variables**| **Dotenv** | `server.js`, `.env` |

-----

## Instalación y Ejecución

### Requisitos Previos

  * **Node.js** (versión compatible con ES Modules, definido en `package.json`)
  * **PostgreSQL** (servidor de base de datos en ejecución)

### 1\. Configuración de la Base de Datos

Crea una base de datos con el nombre `librobazaar_db` (o el que definas en el archivo `.env`) y asegúrate de que esté accesible con las credenciales definidas.

### 2\. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y establece las siguientes variables (usando los valores de tu entorno):

```
# Archivo .env
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_NAME=nombre_db
DB_DIALECT=postgres
DB_PORT=5432
JWT_SECRET=tu_clave_para_jwt
```

### 3\. Instalación de Dependencias

Ejecuta el siguiente comando en la terminal:

```bash
npm install
```

### 4\. Inicialización y Ejecución

El script de inicio (`inicializarDataBase.js`) autentica la conexión a PostgreSQL, sincroniza los modelos con la base de datos (creando las tablas), y agrega los libros iniciales (`libros.seeders.js`).

**Modo Desarrollo (con Nodemon):**

```bash
npm run dev
```

**Modo Producción:**

```bash
npm start
```

La aplicación se iniciará en `http://localhost:8080`.

-----

## Estructura del Proyecto

El proyecto sigue un patrón de diseño modular y está organizado por capas:

```
.
├── config/              # Configuración de la DB y scripts de inicialización
│   ├── database.js      # Conexión a Sequelize
│   └── inicializarDataBase.js # Sincronización de modelos y seeders
├── controllers/         # Lógica de la aplicación (Manejo de peticiones)
│   ├── libros.controller.js
│   └── usuarios.controller.js
├── middlewares/         # Funciones de procesamiento de peticiones (Auth, Validación, Errores)
│   ├── auth.middleware.js
│   ├── error_middleware.js
│   └── validation.middleware.js
├── models/              # Definiciones de Modelos Sequelize
│   ├── Compra.js
│   ├── Libro.js
│   ├── Usuario.js
│   └── relaciones.js    # Definición de asociaciones (Foreign Keys)
├── public/              # Contenido estático (CSS, JS del cliente)
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── libros.js    # Lógica de compra (fetch)
│       ├── login.js     # Lógica de login (fetch, guarda JWT)
│       └── registro.js  # Lógica de registro (fetch, guarda JWT)
├── routes/              # Definición de rutas (asocia rutas con controladores/middlewares)
│   ├── libros.routers.js
│   └── usuarios.router.js
├── seeders/             # Scripts para poblar la DB con datos iniciales
│   └── libros.seeders.js
├── utils/               # Clases de errores personalizadas
│   └── errors.js
├── views/               # Plantillas Handlebars
│   ├── layouts/
│   │   └── main.hbs
│   ├── partials/
│   │   ├── footer.hbs
│   │   ├── header.hbs
│   │   └── navbar.hbs
│   └── ... vistas principales
├── .env                 # Variables de entorno
├── package.json
└── server.js            # Punto de entrada de la aplicación Express
```

-----

## Modelo de Datos (Sequelize)

El esquema de la base de datos se basa en tres modelos y dos relaciones de uno a muchos (1:N).

| Modelo | Atributos Principales | Relaciones |
| :--- | :--- | :--- |
| **Usuario** | `id`, `username`, `password` (hashed) | **1:N** con `Compra` (`Usuario.hasMany(Compra)`) |
| **Libro** | `id`, `nombre`, `stock_disponible` | **1:N** con `Compra` (`Libro.hasMany(Compra)`) |
| **Compra** | `id`, `cantidad`, `UsuarioId`, `LibroId` | **N:1** con `Usuario`, **N:1** con `Libro` |

-----

## Endpoints de la Aplicación

| Método | Ruta | Descripción | Seguridad |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Página de inicio. Renderiza `home.hbs`. | Pública |
| `GET` | `/usuarios/registro` | Muestra el formulario de registro. | Pública |
| `POST`| `/usuarios/registro` | Registra un nuevo usuario, valida, encripta la contraseña y devuelve **JWT** en la respuesta JSON. | Pública, con validación |
| `GET` | `/usuarios/login` | Muestra el formulario de inicio de sesión. | Pública |
| `POST`| `/usuarios/login` | Inicia sesión, valida credenciales y devuelve **JWT** en la respuesta JSON. | Pública |
| `GET` | `/libros` | Muestra la lista de libros disponibles. Renderiza `libros.hbs`. | Pública |
| `POST`| `/libros/:id/comprar` | Procesa la compra de un libro, valida la cantidad y el stock. | **Requiere JWT** (`authenticateToken`) |

-----

## Seguridad y Manejo de Errores

### Autenticación y Autorización

  * **Contraseñas Seguras:** Las contraseñas de los usuarios se encriptan utilizando la librería **`bcryptjs`** antes de ser almacenadas en la base de datos.
  * **JWT:** El *login* y el *registro* devuelven un **JSON Web Token (JWT)**, que se almacena en `localStorage` del cliente.
  * **Protección de Rutas:** El *middleware* `authenticateToken` (basado en `express-jwt`) protege la ruta de compra, asegurando que solo los usuarios autenticados puedan realizar transacciones.

### Manejo de Errores (Centralizado y Personalizado)

El proyecto utiliza un sistema robusto de manejo de errores:

1.  **Clases de Error Personalizadas:** Se definen clases de error con códigos de estado HTTP específicos (`errors.js`), como `ErrorValidacion` (400), `ErrorAutenticacion` (401), `ErrorRegistro` (409), `ErrorRecursoNoEncontrado` (404), y `ErrorServidor` (500).
2.  **Middleware Centralizado:** El `errorMiddleware` captura todos los errores lanzados.
      * Si es una petición `POST` o un `ErrorValidacion`, responde con un objeto **JSON** para ser manejado por el JavaScript del cliente (ej. `registro.js`, `libros.js`).
      * En caso contrario (principalmente `GET`), renderiza la vista `error.hbs` con el mensaje y código de estado apropiado.

### Validación y Transacciones

  * **Validación de Entrada:** El `validation.middleware.js` aplica validaciones estrictas:
      * **Registro:** Verifica longitud, mayúsculas, minúsculas, números y caracteres especiales en la contraseña.
      * **Compra:** Asegura que el ID del libro y la cantidad sean números enteros positivos.
  * **Transacciones en Compras:** La lógica de compra (`libros.controller.js`) se ejecuta dentro de una **transacción Sequelize**. Esto garantiza que si se crea el registro de la `Compra`, el `stock_disponible` del `Libro` también se descuenta, o en caso de error (ej. stock insuficiente), ambos cambios se deshacen (rollback).

-----

¡Claro que sí! Con gusto crearé una sección de **Pruebas Detalladas** que incluye el uso de **Postman**, enfocándonos en los *endpoints* clave de autenticación y transacciones.

Aquí tienes la sección actualizada que puedes añadir a tu `README.md`:

---

## Pruebas Detalladas (Usando Postman)

Dado que el proyecto gestiona la autenticación mediante JWT y transacciones de base de datos, es crucial verificar el comportamiento de sus *endpoints* clave.

### 1. Preparación del Entorno en Postman

Para simular el flujo de la aplicación, necesitarás tres variables de entorno en Postman:

| Variable | Valor Inicial | Uso |
| :--- | :--- | :--- |
| `baseURL` | `http://localhost:8080` | URL base del servidor. |
| `jwtToken` | `""` (vacío) | Almacenará el token JWT de inicio de sesión. |
| `libroId` | `1` o el `id` de un libro con stock. | Se usará en la prueba de compra. |

### 2. Flujo de Pruebas

#### Prueba A: Registro de Usuario (POST /usuarios/registro)

Esta prueba verifica tanto el registro exitoso como la robusta validación de contraseña.

| Paso | Método | URL | Body (JSON) | Expectativa | Observaciones |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **A.1 (Éxito)** | `POST` | `{{baseURL}}/usuarios/registro` | `{ "username": "testuser", "password": "Password123." }` | Status **201** y un objeto JSON con `token` y `usuario`. | 💡 **Script Postman:** Guarda `data.token` en la variable `jwtToken`. |
| **A.2 (Fallo: Validación)** | `POST` | `{{baseURL}}/usuarios/registro` | `{ "username": "fail", "password": "123" }` | Status **400** (`BAD_REQUEST`). | La respuesta JSON debe contener el array `detalles` con mensajes de error (ej. longitud mínima). |
| **A.3 (Fallo: Duplicado)** | `POST` | `{{baseURL}}/usuarios/registro` | `{ "username": "testuser", ... }` | Status **409** (`DUPLICATE_ENTRY`). | Verifica el manejo de errores de `ErrorRegistro`. |

#### Prueba B: Inicio de Sesión (POST /usuarios/login)

Esta prueba verifica que un usuario registrado pueda autenticarse y recibir su token.

| Paso | Método | URL | Body (JSON) | Expectativa | Observaciones |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **B.1 (Éxito)** | `POST` | `{{baseURL}}/usuarios/login` | `{ "username": "testuser", "password": "Password123." }` | Status **200** y un objeto JSON con el nuevo `token`. | 💡 **Script Postman:** Sobrescribe la variable `jwtToken` con el nuevo token. |
| **B.2 (Fallo: Credencial)** | `POST` | `{{baseURL}}/usuarios/login` | `{ "username": "testuser", "password": "WrongPassword!" }` | Status **401** (`UNAUTHORIZED`). | Verifica el uso de `bcrypt.compare` y `ErrorAutenticacion`. |

#### Prueba C: Compra Transaccional (POST /libros/:id/comprar)

Esta es la prueba más crítica, ya que verifica la **autenticación** (JWT), la **validación** de entrada y la **atomiciadad de la transacción** (Sequelize Transaction).

| Paso | Método | URL | Body (JSON) | Headers | Expectativa | Observaciones |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **C.1 (Fallo: No Autenticado)** | `POST` | `{{baseURL}}/libros/{{libroId}}/comprar` | `{ "cantidad": 1 }` | **Sin** `Authorization` | Status **401** (`UnauthorizedError`). | El *middleware* `authenticateToken` debe bloquear la petición. |
| **C.2 (Fallo: Validación Cantidad)** | `POST` | `{{baseURL}}/libros/{{libroId}}/comprar` | `{ "cantidad": -5 }` | `Authorization: Bearer {{jwtToken}}` | Status **400** (`BAD_REQUEST`). | El *middleware* `validarCompraLibro` debe fallar. |
| **C.3 (Fallo: Stock)** | `POST` | `{{baseURL}}/libros/{{libroId}}/comprar` | `{ "cantidad": 99999 }` | `Authorization: Bearer {{jwtToken}}` | Status **400** (`BAD_REQUEST`). | El *controller* (`comprarLibro`) debe fallar por stock insuficiente y lanzar `ErrorValidacion`. |
| **C.4 (Éxito: Transacción)** | `POST` | `{{baseURL}}/libros/{{libroId}}/comprar` | `{ "cantidad": 1 }` | `Authorization: Bearer {{jwtToken}}` | Status **200**. | Se crea un registro en `Compra` y se reduce el `stock_disponible` en `Libro` dentro de una transacción. |
| **C.5 (Verificación de Stock)** | `GET` | `{{baseURL}}/libros` | Ninguno | Ninguno | El stock del libro con `{{libroId}}` debe ser **1 unidad menor** que antes de C.4. | Esto confirma que la transacción se completó correctamente (COMMIT). |

### 3. Consideraciones Adicionales

* **Manejo de Errores (Error Page):** Para probar el *middleware* de errores con vistas, simplemente navega a una ruta inexistente, como `GET {{baseURL}}/ruta-que-no-existe`. El servidor debe responder renderizando la vista **`error.hbs`** con el código **404**.