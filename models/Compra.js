import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

export const Compra = sequelize.define('Compra', {
    cantidad : {
        type : DataTypes.INTEGER,
        allowNull : false
    }
});