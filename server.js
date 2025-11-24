import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { inicializarDataBase } from "./config/inicializarDataBase.js";
import { create } from "express-handlebars";
import { librosRouter } from "./routes/libros.routers.js";
import { usuariosRouter } from "./routes/usuarios.router.js";
import { authErrorHandler } from "./middlewares/auth.middleware.js";
import { ErrorRecursoNoEncontrado } from "./utils/errors.js"; 
import { errorMiddleware } from "./middlewares/error_middleware.js";

// Recrear __dirname para EMS 6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;
const app = express();

// Configuración del Motor de Vistas Handlebars
const hbs = create({
    defaultLayout: 'main', // Definir layout principal
    extname: 'hbs', // Especifica a Handlebars la extensión de los archivos de plantillas
    layoutsDir: path.join(__dirname, 'views', 'layouts'), // Definir directorio layouts
    partialsDir: path.join(__dirname, 'views', 'partials'), // Definir directorio de partials
})

// Especificar a Express que motor usar al renderizar archivos con extension 'hbs'
app.engine('hbs', hbs.engine);
// Especificar a Express que extension buscar al usar render()
app.set('view engine', 'hbs');
// Especificar el directorio de vistas
app.set('views', path.join(__dirname, 'views'));

// Middleware contenido estático
app.use(express.static("public"));

// Middleware recibir JSON en req
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
    //res.send("<h1>¡Express funciona! Si ves esto, Handlebars es el problema.</h1>");
    res.render("home", { title: "Bienvenido a Librobazaar" });
});

// Rutas de Autenticación
app.use('/usuarios', usuariosRouter);

// Rutas de Libros y Compras
app.use('/libros', librosRouter);

app.all("/{*ruta}", (req, res, next) => {
  const ruta = req.originalUrl;
  // Lanza el error 404 para que errorMiddleware lo capture y renderice error.hbs
  next(new ErrorRecursoNoEncontrado(`Endpoint (${req.method})${ruta} no encontrado`));
});

// Middleware de manejo de errores de JWT
app.use(authErrorHandler);

// Middleware de manejo de errores GENERAL (DEBE ir al final)
app.use(errorMiddleware);

async function startServer() {
    try {
        // 1. Aseguramos que la DB y los datos estén listos PRIMERO
        await inicializarDataBase(); 
        
        // 2. Solo después de que la DB esté lista, iniciamos Express
        app.listen(PORT, () => {
            console.log(`Server corriendo en http://localhost:${PORT}`);
        });

    } catch (error) {
        // Manejo de errores críticos de la DB que impiden el inicio
        console.error('Error FATAL al iniciar la aplicación:', error.message);
        process.exit(1); 
    }
}

// Ejecutar la función de inicio
startServer();