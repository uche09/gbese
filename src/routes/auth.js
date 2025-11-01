import express from "express";
import {validateRegistration, validateLogin} from "../validators/auth_input.js"
import getValidationErr from "../middlewares/get_validation_error.js"
import * as authCtrl from "../controllers/user_auth.js"

const router = express.Router();

router.post(
    "/register",
    validateRegistration,
    getValidationErr,
    authCtrl.registerUser,
);

// router.post("/login", 
//     validateLogin, 
//     getValidationErr,
//     authCtrl.login,
// )

export default router;