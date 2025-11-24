import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

export const Libro = sequelize.define('Libro', {
    nombre : {
        type : DataTypes.STRING,
        allowNull : false,
        validate : {
            notEmpty:{
                msg: "El nombre del libro no puede estar vacío",
            },
            notNull : {
                msg: "Se debe ingresar nombre del libro",
            }    
        }
    },
    stock_disponible : {
        type : DataTypes.INTEGER,
        allowNull : false
    }
});