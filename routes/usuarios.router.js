import { Router } from 'express';
import { renderRegistro, renderLogin, registroUsuario, loginUsuario } from '../controllers/usuarios.controller.js';
import { encryptPassword } from '../middlewares/auth.middleware.js';
import { validarRegistroUsuario } from '../middlewares/validation.middleware.js';

export const usuariosRouter = Router();

// Rutas para servir vistas
usuariosRouter.get('/registro', renderRegistro);
usuariosRouter.get('/login', renderLogin);

// Middleware: encryptPassword se llama ANTES de registroUsuario
usuariosRouter.post('/registro', validarRegistroUsuario, encryptPassword, registroUsuario);
usuariosRouter.post('/login', loginUsuario);