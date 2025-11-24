import { sequelize } from "../config/database.js";
import { DataTypes } from "sequelize";

export const Usuario = sequelize.define('Usuario', {
    username : {
        type : DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});