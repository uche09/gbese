import AppError from "../utils/error.js"
import {createUser} from "../services/userService.js"
import db from "../models/index.js"
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/tokens.js"
import { Op } from "sequelize";
import dayjs from "dayjs";
import config from "../config/index.js";



export async function registerUser(req, res) {
    
    try {
        const {
            username,
            email,
            password,
        } = req.body;

        await createUser({username, email, password});
        return res.status(201).json({
            success: true,
            message: "User registered"
        });
    } catch (error) {
        return res.status(400).json({ success: false, error: error.message || "Registration"})
        throw new AppError(error || "Registration failed", 400)
    }
    
}
