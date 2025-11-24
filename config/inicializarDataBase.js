
import { sequelize } from "./database.js";
import "../models/relaciones.js";
import chalk from "chalk";
import { crearLibrosIniciales } from "../seeders/libros.seeders.js";

export async function inicializarDataBase() {
  try {
    // AUTENTICACIÓN: Verificar la conexión a la DB
    await sequelize.authenticate();
    console.log(chalk.greenBright('\nConexión a la base de datos establecida exitosamente.'));

    // SINCRONIZACIÓN: Crear las tablas (si no existen)
    // Usar { force: false } para no eliminar datos existentes.
    // Cambiar a { force: true } para eliminar y recrear las tablas.
    await sequelize.sync({ force: true }); 
    console.log(chalk.green('Todas las tablas han sido sincronizadas.'));
    
    await crearLibrosIniciales();
    
  } catch (error) {
    error.message = (`Al inicializar la aplicación. ${error.message}`);
    console.error(chalk.redBright(error.message));
    process.exit(1); // Sale si hay un error crítico (como no poder conectar a la DB)
  }
}