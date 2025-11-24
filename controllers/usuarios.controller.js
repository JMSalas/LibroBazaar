import { Usuario } from "../models/Usuario.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ErrorRegistro, ErrorAutenticacion, ErrorServidor } from '../utils/errors.js';

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_super_seguro_e_impredecible'; 

// Registra un nuevo usuario. Usa la password encriptada de req.body.
export async function registroUsuario(req, res, next) {
    const { username, password } = req.body; 

    try {
        const usuarioExistente = await Usuario.findOne({ where: { username } });

        if (usuarioExistente) {
            throw new ErrorRegistro("El nombre de usuario ya está en uso.");
        }

        // La contraseña ya está encriptada por el middleware encryptPassword
        const nuevoUsuario = await Usuario.create({ username, password });

        const token = jwt.sign(
            { id: nuevoUsuario.id, username: nuevoUsuario.username },
            JWT_SECRET,
            { expiresIn: '1h' } 
        );

        res.status(201).json({ 
            message: "Usuario registrado exitosamente.", 
            token,
            usuario: {
                id: nuevoUsuario.id,
                username: nuevoUsuario.username,
            }
        });

    } catch (error) {
        if (error instanceof ErrorRegistro) {
            return next(error);
        }
        
        next(new ErrorServidor("Error interno del servidor al intentar registrar el usuario."));
    }
}

// Inicia sesión. Compara la password con bcrypt.
export async function loginUsuario(req, res, next) {
    const { username, password } = req.body; 

    if (!username || !password) {
        return next(new ErrorAutenticacion("Faltan credenciales: username y password son requeridos."));
    }

    try {
        const usuario = await Usuario.findOne({ where: { username } });

        if (!usuario) {
            throw new ErrorAutenticacion("Credenciales inválidas.");
        }
        
        const passwordValida = await bcrypt.compare(password, usuario.password);

        if (!passwordValida) {
            throw new ErrorAutenticacion("Credenciales inválidas.");
        }

        const token = jwt.sign(
            { id: usuario.id, username: usuario.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        const usuarioSinPassword = { id: usuario.id, username: usuario.username };

        res.status(200).json({ 
            message: "Inicio de sesión exitoso.", 
            token,
            usuario: usuarioSinPassword
        });

    } catch (error) {
        if (error instanceof ErrorAutenticacion) return next(error); 
        
        // Error genérico del servidor
        next(new ErrorServidor("Error interno del servidor al intentar iniciar sesión."));
    }
}

export function renderRegistro(req, res) {
    res.render('auth/registro', { title: "Registro de Usuario" });
}

export function renderLogin(req, res) {
    res.render('auth/login', { title: "Inicio de Sesión" });
}