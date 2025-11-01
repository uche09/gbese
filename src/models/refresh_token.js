import sequelise from "../config/db.js";
import { DataTypes } from "sequelize";
import User from "./user.js";


const RefreshToken = sequelise.define(
    "RefreshToken",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        token: {
            type: DataTypes.STRING,
            allowNull: false 
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: User,
                key: "id",
            },
        },

        isRevoked: { 
            type: DataTypes.BOOLEAN, 
            defaultValue: false 
        },

        expiresAt: { type: DataTypes.DATE, allowNull: false },
    }, 
    
    { timestamps: true },
  
);

export default RefreshToken;