import { Libro } from "../models/Libro.js";

export async function crearLibrosIniciales() {
  await Libro.bulkCreate([
    { nombre: 'Cien años de soledad', stock_disponible: 15 },
    { nombre: 'El señor de los anillos: La comunidad del anillo', stock_disponible: 25 },
    { nombre: '1984', stock_disponible: 8 },
    { nombre: 'Crimen y castigo', stock_disponible: 30 },
    { nombre: 'Don Quijote de la Mancha', stock_disponible: 0 },
    { nombre: 'Orgullo y prejuicio', stock_disponible: 12 },
    { nombre: 'El Principito', stock_disponible: 45 },
    { nombre: 'Drácula', stock_disponible: 20 },
    { nombre: 'Un mundo feliz', stock_disponible: 18 },
    { nombre: 'Rayuela', stock_disponible: 5 },
    { nombre: 'Harry Potter y la piedra filosofal', stock_disponible: 50 },
    { nombre: 'Fahrenheit 451', stock_disponible: 10 },
    { nombre: 'Veinte mil leguas de viaje submarino', stock_disponible: 22 },
    { nombre: 'El código Da Vinci', stock_disponible: 17 },
    { nombre: 'Las aventuras de Tom Sawyer', stock_disponible: 1 },
  ]);

  console.log("Libros de prueba creados en base de datos.");
}