import sequelise from "../config/db.js";
import { DataTypes } from "sequelize";
import bcrypt from "bcrypt";

const User = sequelise.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false
        },

        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },

        creditsGiven: {
            type: DataTypes.FLOAT, // Total Credit sale
            defaultValue: 0,
        },
        creditPayments: {
            type: DataTypes.FLOAT, // Total Credit payment
            defaultValue: 0,
        },
        outstanding_credits: {
            type: DataTypes.FLOAT, // Remaining Balance
            defaultValue: 0,
        },

        debtorCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    },

    {
        hooks: {
            beforeCreate: async (user) => {
                user.email = user.email.toLowerCase();
                if (user.password) {
                    const salt = await bcrypt.genSalt();
                    user.password = await bcrypt.hash(user.password, salt);
                }

            },

            beforeUpdate: async (user) => {
                if (user.changed("email")) {
                    user.email = user.email.toLowerCase();
                }

                if (user.changed("password")) {
                    const salt = await bcrypt.genSalt();
                    user.password = await bcrypt.hash(user.password, salt);
                }

                if (user.changed("creditsGiven") || user.changed("creditPayments")) {
                    user.outstanding_credits = user.creditsGiven - user.creditPayments;
                }
            },
        },

        indexes: [
            {
                unique: true,
                fields: ["email"],
            },
            
            {
                fields: ["createdAt"],
            }
        ],
    }
);

User.prototype.verifyPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}


export default User;