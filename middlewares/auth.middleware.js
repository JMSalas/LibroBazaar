import bcrypt from 'bcryptjs';
import { expressjwt } from 'express-jwt';
import { ErrorAutenticacion, ErrorServidor } from '../utils/errors.js';

const JWT_SECRET = process.env.JWT_SECRET; 

// Middleware para encriptar la contraseña antes de guardar en la DB (registro).
export async function encryptPassword(req, res, next) {
    const { password } = req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
        next();
    } catch (error) {
        console.error("Error al encriptar la contraseña:", error);
        return next(new ErrorServidor("Error interno del servidor al procesar la contraseña."));
    }
}

// Middleware para verificar y validar un token JWT (protección de rutas).
export const authenticateToken = expressjwt({
    secret: JWT_SECRET,
    algorithms: ["HS256"], // Algoritmo usado en jsonwebtoken.sign
    // El payload decodificado se adjuntará a req.auth.
});

// Middleware para manejar errores de autenticación de express-jwt.
export function authErrorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        return next(new ErrorAutenticacion(err.message));
    }
    next(err); 
}