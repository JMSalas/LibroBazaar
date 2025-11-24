// controllers/libro.controller.js
import { Libro } from "../models/Libro.js";
import { Compra } from "../models/Compra.js";
import { sequelize } from "../config/database.js";
import { ErrorValidacion, ErrorRecursoNoEncontrado, ErrorServidor } from '../utils/errors.js';

export async function getAllLibros(req, res, next) {
    try {
        const libros = await Libro.findAll({
            attributes: ['id', 'nombre', 'stock_disponible'],
            order: [['nombre', 'ASC']]
        });

        res.status(200).json(libros);
    
    } catch (error) {
        console.error("Error al obtener libros:", error);
        next(new ErrorServidor("Error interno al cargar la página de libros."));
    }
}

// Renderizar la vista con el listado de libros.
export async function renderLibros(req, res, next) { 
    try {
        const libros = await Libro.findAll({
            attributes: ['id', 'nombre', 'stock_disponible'],
            order: [['nombre', 'ASC']]
        });

        const librosConEstado = libros.map(libro => ({
            ...libro.dataValues,
            sinStock: libro.stock_disponible === 0
        }));

        res.render("libros", {
            title: "Listado de Libros", 
            libros: librosConEstado,
        });

    } catch (error) {
        console.error("Error al renderizar libros:", error);
        next(new ErrorServidor("Error interno al cargar la página de libros."));
    }
}

// Permite a un usuario autenticado comprar un libro y descontar el stock.
// POST /api/libros/:id/comprar
export async function comprarLibro(req, res, next) {
    const { id: libroId } = req.params;
    const { cantidad } = req.body;
    const usuarioId = req.auth.id; // El ID del usuario está en req.user gracias al middleware authenticateToken 

    try {
        // Usar una transacción ADMINISTRADA para asegurar la atomicidad
        const result = await sequelize.transaction(async (t) => {  
                        
            // Bloquear el libro para evitar condiciones de carrera (ROW LOCK)
            const libro = await Libro.findByPk(libroId, {
                attributes: ['id', 'nombre', 'stock_disponible'],
                lock: t.LOCK.UPDATE, // Bloqueo exclusivo
                t,
            });

            if (!libro) {
                throw new ErrorRecursoNoEncontrado(`Libro con ID ${libroId} no encontrado.`);
            }

            const stockActual = libro.stock_disponible;

            // Verificar disponibilidad de stock
            if (stockActual < cantidad) {
                // Lanzamos ErrorValidacion con detalles para que el JS muestre el error en el campo 'cantidad'
                throw new ErrorValidacion(`Stock insuficiente. Solo quedan ${libro.stock_disponible} unidades.`, 
                [{ field: 'cantidad', message: `Stock insuficiente. Solo quedan ${libro.stock_disponible} unidades.` }]
                );
            }

            // Crear el registro de la compra en la tabla Compras (M:M)
            await Compra.create({
                UsuarioId: usuarioId,
                LibroId: libroId,
                cantidad: cantidad,
            }, { transaction: t });

            // Descontar el stock
            const nuevoStock = stockActual - cantidad;
            libro.stock_disponible = nuevoStock;
            await libro.save({ transaction: t });


            // Si llegamos aquí, se hará COMMIT automáticamente.
            return { 
                message: `Compra exitosa. Se han comprado ${cantidad} unidades de '${libro.nombre}'.`,
                stockRestante: nuevoStock
            };
        });
        
        // Si la transacción administrada fue exitosa
        res.status(200).json(result);

    } catch (error) {
        if (error instanceof ErrorValidacion || error instanceof ErrorRecursoNoEncontrado) {
            return next(error); 
        }

        // Si es un error desconocido (ej. de DB que no capturamos), se trata como ErrorServidor.
        next(new ErrorServidor("Error inesperado en la base de datos al procesar la compra."));
    }
}