import { Usuario } from "./Usuario.js";
import { Libro } from "./Libro.js";
import { Compra } from "./Compra.js";

// Usuario puede tener muchas Compras (1:N)
// Compras pertenece a un Usuario (N:1)
Usuario.hasMany(Compra); 
Compra.belongsTo(Usuario);

// Libro puede tener muchas Compras (1:N)
// Compras pertenece a un Libro (N:1)
Libro.hasMany(Compra);
Compra.belongsTo(Libro);