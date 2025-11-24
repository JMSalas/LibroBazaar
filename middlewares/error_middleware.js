import chalk from "chalk";
import { ErrorValidacion, ErrorRecursoNoEncontrado, ErrorAutenticacion, ErrorRegistro, ErrorServidor } from '../utils/errors.js';

const CUSTOM_ERRORS = [ErrorValidacion, ErrorRecursoNoEncontrado, ErrorAutenticacion, ErrorRegistro, ErrorServidor];

export const errorMiddleware = (err, req, res, next) => {
    // Delegar al manipulador de errores por defecto de Express, si los headers de la respuesta ya han sido enviados al cliente.
    if (res.headersSent) {
        console.error(chalk.redBright("*** Error capturado por el manipulador de errores por defecto ***"));
        return next(err);
    }

    // Logear el error en consola
    console.error(chalk.redBright('*** Error capturado por el middleware de errores ***'));
    console.error(chalk.redBright(`${err.name}: ${err.message}`));
    
    // Convertir el error genérico en una de las clases de error
    let handledError = err;
    if (!(err instanceof Error) || !CUSTOM_ERRORS.some(C => err instanceof C)) {
        // Para errores no capturados (ej. errores de base de datos o sintaxis)
        handledError = new ErrorServidor(err.message || 'Error interno del servidor.');
        handledError.stack = err.stack; // Mantener el stack trace para debugging
    }

    const statusCode = handledError.statusCode || 500;
    res.status(statusCode);

    // Si es una POST, o Si es una ErrorValidacion
    // Devolver un JSON para que el .js del cliente (registro.js, libros.js) lo procese.
    const respondWithJson = (req.method === 'POST') || (handledError instanceof ErrorValidacion);
    
    if (respondWithJson) {
        // Respuesta JSON (para formularios o API)
        const responseJson = { 
            name: handledError.name, 
            error: handledError.message 
        };
        // Incluir detalles si es un error de validación
        if (handledError.detalles) { 
            // Esto es lo que registro.js y libros.js esperan: un array de mensajes
            responseJson.detalles = handledError.detalles.map(d => d.message); 
        }
        return res.json(responseJson);
    }

    return res.render('error', { 
        title: `Error ${statusCode}`, 
        error: {
            message: handledError.message,
            code: statusCode,
            name: handledError.name,
        }
    });
}