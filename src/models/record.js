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

        },

        customerPhoneNumber: DataTypes.STRING,
        email: DataTypes.STRING,
        
        amount: { // Sales total amount
            type: DataTypes.FLOAT,
            allowNull: false,
        },

        payment: { // Total payment so far
            type: DataTypes.FLOAT,
            defaultValue: 0.0,
        },

        balance: DataTypes.FLOAT, // Balance left

        beenCleared: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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

        hooks: {
            beforeCreate: async (record) => {
                record.balance = record.amount - record.payment;

                if (record.balance === 0 && record.amount === record.payment) {
                    record.beenCleared = true;
                }else {
                    record.beenCleared = false;
                }
            },

            beforeUpdate: async (record) => {
                // Recalculate balance

                if (record.changed("payment")) {
                    record.balance = record.amount - record.payment;
                }

                if (record.changed("amount")) {
                    record.balance = record.amount - record.payment;
                }


                if (record.balance === 0 && record.amount === record.payment) {
                    record.beenCleared = true;
                }else {
                    record.beenCleared = false;
                }
            },
        },

        indexes: [
            {
                fields: ["userId" ],
            },
            
            {
                fields: ["createdAt", "dueDate"],
            }
        ],
    }
);


export default Record;