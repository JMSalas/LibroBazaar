import { Router } from 'express';
import { comprarLibro, renderLibros } from '../controllers/libros.controller.js';
import { authenticateToken } from '../middlewares/auth.middleware.js';
import { validarCompraLibro } from '../middlewares/validation.middleware.js';

export const librosRouter = Router();

// Ruta de la vista de libros (GET /libros)
librosRouter.route('/')
    .get(renderLibros);

// Ruta para realizar una compra (POST /libros/:id/comprar)
librosRouter.route('/:id/comprar')
    .post(authenticateToken, validarCompraLibro, comprarLibro);