import { body } from "express-validator";

const validateRegistration = [
    body("username")
        .trim()
        .notEmpty()
        .withMessage("Username is required")
        .bail()
        .isLength({max: 50})
        .withMessage("Limit username to 50 characters"),
        
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("Invalid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .bail()
        .isStrongPassword()
        .withMessage("Password must have at least 8 characters, must have uppercase letter, must have lowercase letter, must have a digit, must have special characters."),
    
    body("confirmPassword").custom((value, {req}) => {
        if (!req.body.password || value !== req.body.password) {
            throw new Error("Password comfirmation does not match password");
        }
        return true;
    }),
];
