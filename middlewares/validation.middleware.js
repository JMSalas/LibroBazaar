import { ErrorValidacion } from '../utils/errors.js';

export function validarRegistroUsuario(req, res, next) {
    const { username, password } = req.body;
    const errores = [];

    // Validación de Username
    if (!username || typeof username !== 'string' || username.trim() === '') {
        errores.push({ field: 'username', message: 'El nombre de usuario es requerido y no puede estar vacío.' });
    }

    // Validación de Password (Complejidad y Longitud)
    if (!password || typeof password !== 'string') {
        errores.push({ field: 'password', message: 'La contraseña es requerida.' });
    } else {
        const p = password;
        if (p.length < 10 || p.length > 32) {
            errores.push({ field: 'password', message: 'Contraseña debe tener entre 10 y 32 caracteres.' });
        }
        if (!/[A-Z]/.test(p)) {
            errores.push({ field: 'password', message: 'Contraseña debe contener al menos una letra mayúscula.' });
        }
        if (!/[a-z]/.test(p)) {
            errores.push({ field: 'password', message: 'Contraseña debe contener al menos una letra minúscula.' });
        }
        if (!/[0-9]/.test(p)) {
            errores.push({ field: 'password', message: 'Contraseña debe contener al menos un número.' });
        }
        // Usamos una regex simple para encontrar cualquier cosa que no sea letra, número o espacio.
        if (!/[^a-zA-Z0-9\s]/.test(p)) { 
            errores.push({ field: 'password', message: 'Contraseña debe contener al menos un carácter especial.' });
        }
    }

    if (errores.length > 0) {
        // Lanzar ErrorValidacion con los detalles de todos los errores.
        return next(new ErrorValidacion('Fallo la validación del formulario de registro.', errores));
    }

    next();
}

export function validarCompraLibro(req, res, next) {
    const { cantidad } = req.body;
    const libroId = req.params.id; // El ID del libro viene en los parámetros de ruta
    const errores = [];

    // Validación del ID del libro
    const idNum = parseInt(libroId);
    if (!libroId || isNaN(idNum) || idNum <= 0) {
        // Incluimos 'id' como un detalle de error
        errores.push({ field: 'id', message: 'ID de libro inválido o faltante.' });
    }

    // Validación de Cantidad
    const cantidadNum = parseInt(cantidad);
    if (!cantidad || isNaN(cantidadNum) || cantidadNum <= 0 || !Number.isInteger(cantidadNum)) {
        errores.push({ field: 'cantidad', message: 'Cantidad debe ser un número entero positivo (mínimo 1).' });
    }
    
    // Si hay errores, lanza ErrorValidacion
    if (errores.length > 0) {
        return next(new ErrorValidacion('Fallo la validación de la compra.', errores));
    }

    next();
}