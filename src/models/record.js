import sequelise from "../config/db.js";
import { DataTypes } from "sequelize";
import User from "./user.js";

const Record = sequelise.define(
    "Record",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: User,
                key: "id",
            },
        },

        customerName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,

        },

        customerPhoneNumber: DataTypes.STRING,
        email: DataTypes.STRING,
        
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        transactionType: {
            type: DataTypes.ENUM("borrow", "lend"),
            allowNull: false,
        },

        dueDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },

        description: {
            type: DataTypes.STRING,
            allowNull: false,
        }
        
    },

    {
        timestamps: true,


        indexes: [
            {
                fields: ["userId", "customerName", ],
            },
            
            {
                fields: ["createdAt", "dueDate"],
            }
        ],
    }
);


export default Record;